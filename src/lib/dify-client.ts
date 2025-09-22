import {
  DifyWorkflowRequest,
  DifyWorkflowResponse,
  DifyStreamResponse,
  DifyClientConfig,
  WorkflowExecutionResult
} from '@/types/dify'

export class DifyApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'DifyApiError'
  }
}

export class DifyClient {
  private apiUrl: string
  private apiKey: string
  private timeout: number

  constructor(config: DifyClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '')
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 30000
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: response.statusText }
        }

        throw new DifyApiError(
          errorData.code || 'HTTP_ERROR',
          errorData.message || `Request failed with status ${response.status}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DifyApiError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new DifyApiError('TIMEOUT', 'Request timeout', 408)
      }

      const errorMessage = error instanceof Error ? error.message : 'Network request failed'
      throw new DifyApiError('NETWORK_ERROR', errorMessage, 0)
    }
  }

  async executeWorkflow(
    workflowId: string,
    request: DifyWorkflowRequest
  ): Promise<WorkflowExecutionResult> {
    try {
      const response = await this.makeRequest<DifyWorkflowResponse>(
        `/v1/workflows/${workflowId}/run`,
        {
          method: 'POST',
          body: JSON.stringify(request)
        }
      )

      const result: WorkflowExecutionResult = {
        id: response.workflow_run_id,
        status: response.data.status === 'succeeded' ? 'success' :
                response.data.status === 'failed' ? 'error' : 'pending',
        data: response.data.outputs,
        error: response.data.error,
        usage: {
          tokens: response.data.total_tokens,
          time: response.data.elapsed_time
        }
      }

      return result
    } catch (error) {
      if (error instanceof DifyApiError) {
        return {
          id: '',
          status: 'error',
          error: error.message,
          usage: { tokens: 0, time: 0 }
        }
      }
      throw error
    }
  }

  async getWorkflowStatus(
    workflowId: string,
    runId: string
  ): Promise<WorkflowExecutionResult> {
    try {
      const response = await this.makeRequest<DifyWorkflowResponse>(
        `/v1/workflows/${workflowId}/runs/${runId}`
      )

      return {
        id: response.workflow_run_id,
        status: response.data.status === 'succeeded' ? 'success' :
                response.data.status === 'failed' ? 'error' : 'pending',
        data: response.data.outputs,
        error: response.data.error,
        usage: {
          tokens: response.data.total_tokens,
          time: response.data.elapsed_time
        }
      }
    } catch (error) {
      if (error instanceof DifyApiError) {
        return {
          id: runId,
          status: 'error',
          error: error.message,
          usage: { tokens: 0, time: 0 }
        }
      }
      throw error
    }
  }

  async executeWorkflowWithRetry(
    workflowId: string,
    request: DifyWorkflowRequest,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<WorkflowExecutionResult> {
    let lastError: Error = new Error('Unknown error')

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeWorkflow(workflowId, request)

        if (result.status === 'success' || result.status === 'pending') {
          return result
        }

        if (attempt === maxRetries) {
          return result
        }

        lastError = new Error(result.error || 'Workflow execution failed')
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        if (error instanceof DifyApiError && error.status < 500) {
          throw error
        }

        if (attempt === maxRetries) {
          throw error
        }
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
      }
    }

    throw lastError
  }

  async executeWorkflowStreaming(
    workflowId: string,
    request: DifyWorkflowRequest,
    onMessage: (data: DifyStreamResponse) => void
  ): Promise<WorkflowExecutionResult> {
    const streamRequest: DifyWorkflowRequest = {
      ...request,
      response_mode: 'streaming'
    }

    const response = await fetch(`${this.apiUrl}/v1/workflows/${workflowId}/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(streamRequest)
    })

    if (!response.ok) {
      throw new DifyApiError(
        'HTTP_ERROR',
        `Request failed with status ${response.status}`,
        response.status
      )
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new DifyApiError('STREAM_ERROR', 'Failed to get response stream', 500)
    }

    let workflowRunId = ''
    let finalResult: WorkflowExecutionResult = {
      id: '',
      status: 'pending',
      usage: { tokens: 0, time: 0 }
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: DifyStreamResponse = JSON.parse(line.slice(6))
              workflowRunId = data.workflow_run_id
              onMessage(data)

              if (data.event === 'workflow_finished') {
                finalResult = {
                  id: data.workflow_run_id,
                  status: 'success',
                  data: data.data,
                  usage: {
                    tokens: data.data.total_tokens || 0,
                    time: data.data.elapsed_time || 0
                  }
                }
              } else if (data.event === 'error') {
                finalResult = {
                  id: data.workflow_run_id,
                  status: 'error',
                  error: data.data.message || 'Workflow execution failed',
                  usage: { tokens: 0, time: 0 }
                }
              }
            } catch (error) {
              console.error('Failed to parse stream data:', error)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return finalResult
  }
}

export const createDifyClient = (): DifyClient => {
  const apiUrl = process.env.NEXT_PUBLIC_DIFY_API_URL || process.env.DIFY_API_URL
  const apiKey = process.env.DIFY_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('Dify API configuration missing. Please set DIFY_API_URL and DIFY_API_KEY environment variables.')
  }

  return new DifyClient({
    apiUrl,
    apiKey,
    timeout: 30000
  })
}