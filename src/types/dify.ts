export interface DifyWorkflowRequest {
  inputs: Record<string, any>
  response_mode: 'blocking' | 'streaming'
  user: string
  conversation_id?: string
  files?: DifyFile[]
}

export interface DifyFile {
  type: 'image' | 'document' | 'audio' | 'video'
  transfer_method: 'remote_url' | 'local_file'
  url?: string
  upload_file_id?: string
}

export interface DifyWorkflowResponse {
  workflow_run_id: string
  task_id: string
  data: {
    id: string
    workflow_id: string
    status: 'running' | 'succeeded' | 'failed' | 'stopped'
    outputs?: Record<string, any>
    error?: string
    elapsed_time: number
    total_tokens: number
    total_steps: number
    created_at: number
    finished_at?: number
  }
}

export interface DifyStreamResponse {
  event: 'workflow_started' | 'workflow_finished' | 'node_started' | 'node_finished' | 'error'
  task_id: string
  workflow_run_id: string
  data: any
}

export interface DifyApiError {
  code: string
  message: string
  status: number
}

export interface DifyClientConfig {
  apiUrl: string
  apiKey: string
  timeout?: number
}

export interface WorkflowExecutionResult {
  id: string
  status: 'success' | 'error' | 'pending'
  data?: any
  error?: string
  usage: {
    tokens: number
    time: number
  }
}

export interface UsageLimit {
  id: string
  user_id: string
  workflow_id?: string
  limit_type: 'daily' | 'monthly' | 'total'
  limit_count: number
  used_count: number
  reset_at?: string
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  workflow_id: string
  workflow_run_id: string
  tokens_used: number
  execution_time: number
  status: 'success' | 'failed'
  created_at: string
}

export interface WorkflowUsageStats {
  daily_used: number
  daily_limit: number
  monthly_used: number
  monthly_limit: number
  remaining_today: number
  remaining_month: number
  last_reset: string
}

export type WorkflowStatus = 'idle' | 'running' | 'success' | 'error'