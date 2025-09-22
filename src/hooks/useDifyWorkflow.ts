import { useState, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import type { WorkflowStatus, DifyWorkflowRequest } from '@/types/dify'

interface WorkflowExecutionResult {
  id: string
  status: 'success' | 'error' | 'pending'
  data?: any
  error?: string
  usage: {
    tokens: number
    time: number
    remainingToday: number
    remainingMonth: number
  }
}

interface UseDifyWorkflowReturn {
  executeWorkflow: (workflowId: string, inputs: Record<string, any>) => Promise<WorkflowExecutionResult | null>
  getWorkflowStatus: (workflowId: string, runId: string) => Promise<WorkflowExecutionResult | null>
  status: WorkflowStatus
  result: WorkflowExecutionResult | null
  error: string | null
  isLoading: boolean
  resetState: () => void
}

export function useDifyWorkflow(): UseDifyWorkflowReturn {
  const { user, session } = useAuth()
  const [status, setStatus] = useState<WorkflowStatus>('idle')
  const [result, setResult] = useState<WorkflowExecutionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resetState = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const executeWorkflow = useCallback(
    async (workflowId: string, inputs: Record<string, any>): Promise<WorkflowExecutionResult | null> => {
      if (!user || !session) {
        setError('用户未登录')
        return null
      }

      setIsLoading(true)
      setStatus('running')
      setError(null)
      setResult(null)

      try {
        const requestBody: DifyWorkflowRequest = {
          inputs,
          response_mode: 'blocking',
          user: user.id
        }

        const response = await fetch(`/api/dify/${workflowId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        if (!data.success) {
          throw new Error(data.error || '工作流执行失败')
        }

        const executionResult: WorkflowExecutionResult = {
          id: data.id,
          status: data.status === 'success' ? 'success' : 'error',
          data: data.data,
          error: data.error,
          usage: data.usage
        }

        setResult(executionResult)
        setStatus(executionResult.status === 'success' ? 'success' : 'error')

        return executionResult

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '执行工作流时发生未知错误'
        setError(errorMessage)
        setStatus('error')

        const errorResult: WorkflowExecutionResult = {
          id: '',
          status: 'error',
          error: errorMessage,
          usage: { tokens: 0, time: 0, remainingToday: 0, remainingMonth: 0 }
        }

        setResult(errorResult)
        return errorResult

      } finally {
        setIsLoading(false)
      }
    },
    [user, session]
  )

  const getWorkflowStatus = useCallback(
    async (workflowId: string, runId: string): Promise<WorkflowExecutionResult | null> => {
      if (!user || !session) {
        setError('用户未登录')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/dify/${workflowId}?runId=${runId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        if (!data.success) {
          throw new Error(data.error || '获取工作流状态失败')
        }

        const statusResult: WorkflowExecutionResult = {
          id: data.id,
          status: data.status === 'success' ? 'success' :
                  data.status === 'pending' ? 'pending' : 'error',
          data: data.data,
          error: data.error,
          usage: data.usage
        }

        setResult(statusResult)
        setStatus(statusResult.status === 'success' ? 'success' :
                 statusResult.status === 'pending' ? 'running' : 'error')

        return statusResult

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取工作流状态时发生未知错误'
        setError(errorMessage)
        setStatus('error')

        const errorResult: WorkflowExecutionResult = {
          id: runId,
          status: 'error',
          error: errorMessage,
          usage: { tokens: 0, time: 0, remainingToday: 0, remainingMonth: 0 }
        }

        setResult(errorResult)
        return errorResult

      } finally {
        setIsLoading(false)
      }
    },
    [user, session]
  )

  return {
    executeWorkflow,
    getWorkflowStatus,
    status,
    result,
    error,
    isLoading,
    resetState
  }
}