import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DifyClient, DifyApiError } from '@/lib/dify-client'
import { createUsageLimiter } from '@/lib/usage-limiter'
import type { DifyWorkflowRequest } from '@/types/dify'

interface RouteParams {
  params: Promise<{
    workflowId: string
  }>
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return null
    }
    return user
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { error: message, success: false },
    { status }
  )
}

function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    { ...data, success: true },
    { status }
  )
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const startTime = Date.now()
  let workflowRunId = ''
  let tokensUsed = 0
  let usageLimiter: any = null

  try {
    const resolvedParams = await params
    const user = await authenticateUser(request)
    if (!user) {
      return createErrorResponse('未授权访问', 401)
    }

    usageLimiter = createUsageLimiter(user.id)

    const canExecute = await usageLimiter.canExecuteWorkflow(resolvedParams.workflowId)
    if (!canExecute.allowed) {
      return createErrorResponse(
        canExecute.reason || '已达到使用限制',
        429
      )
    }

    let requestBody: DifyWorkflowRequest
    try {
      requestBody = await request.json()
    } catch (error) {
      return createErrorResponse('无效的请求格式')
    }

    if (!requestBody.inputs || !requestBody.user) {
      return createErrorResponse('缺少必要的请求参数')
    }

    requestBody.user = user.id

    let difyClient: DifyClient
    try {
      difyClient = new DifyClient({
        apiUrl: process.env.DIFY_API_URL!,
        apiKey: process.env.DIFY_API_KEY!,
        timeout: 60000
      })
    } catch (error) {
      console.error('Dify client initialization error:', error)
      return createErrorResponse('服务配置错误', 500)
    }

    const result = await difyClient.executeWorkflowWithRetry(
      resolvedParams.workflowId,
      requestBody,
      3,
      1000
    )

    workflowRunId = result.id
    tokensUsed = result.usage.tokens
    const executionTime = Date.now() - startTime

    if (result.status === 'error') {
      await usageLimiter.logWorkflowUsage(
        resolvedParams.workflowId,
        workflowRunId,
        tokensUsed,
        executionTime,
        'failed',
        result.error,
        requestBody,
        null
      )

      return createErrorResponse(result.error || '工作流执行失败', 500)
    }

    await usageLimiter.incrementUsageCount(resolvedParams.workflowId, tokensUsed)

    await usageLimiter.logWorkflowUsage(
      resolvedParams.workflowId,
      workflowRunId,
      tokensUsed,
      executionTime,
      'success',
      undefined,
      requestBody,
      result.data
    )

    const updatedUsage = await usageLimiter.canExecuteWorkflow(resolvedParams.workflowId)

    return createSuccessResponse({
      id: result.id,
      status: result.status,
      data: result.data,
      usage: {
        tokens: tokensUsed,
        time: executionTime,
        remainingToday: updatedUsage.remainingToday,
        remainingMonth: updatedUsage.remainingMonth
      }
    })

  } catch (error) {
    console.error('API route error:', error)

    const executionTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : '未知错误'

    if (usageLimiter && workflowRunId) {
      const resolvedParams = await params
      await usageLimiter.logWorkflowUsage(
        resolvedParams.workflowId,
        workflowRunId,
        tokensUsed,
        executionTime,
        'failed',
        errorMessage,
        null,
        null
      )
    }

    if (error instanceof DifyApiError) {
      return createErrorResponse(error.message, error.status >= 400 && error.status < 500 ? error.status : 500)
    }

    return createErrorResponse('内部服务器错误', 500)
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params
    const user = await authenticateUser(request)
    if (!user) {
      return createErrorResponse('未授权访问', 401)
    }

    const { searchParams } = new URL(request.url)
    const runId = searchParams.get('runId')

    if (!runId) {
      return createErrorResponse('缺少运行ID参数')
    }

    let difyClient: DifyClient
    try {
      difyClient = new DifyClient({
        apiUrl: process.env.DIFY_API_URL!,
        apiKey: process.env.DIFY_API_KEY!
      })
    } catch (error) {
      console.error('Dify client initialization error:', error)
      return createErrorResponse('服务配置错误', 500)
    }

    const result = await difyClient.getWorkflowStatus(resolvedParams.workflowId, runId)

    return createSuccessResponse({
      id: result.id,
      status: result.status,
      data: result.data,
      error: result.error,
      usage: result.usage
    })

  } catch (error) {
    console.error('GET API route error:', error)

    if (error instanceof DifyApiError) {
      return createErrorResponse(error.message, error.status >= 400 && error.status < 500 ? error.status : 500)
    }

    return createErrorResponse('内部服务器错误', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params
    const user = await authenticateUser(request)
    if (!user) {
      return createErrorResponse('未授权访问', 401)
    }

    const usageLimiter = createUsageLimiter(user.id)
    const usage = await usageLimiter.getUserUsageStats(resolvedParams.workflowId)

    if (!usage) {
      return createErrorResponse('无法获取使用统计', 500)
    }

    return createSuccessResponse({
      usage: {
        dailyUsed: usage.dailyUsed,
        dailyLimit: usage.dailyLimit,
        monthlyUsed: usage.monthlyUsed,
        monthlyLimit: usage.monthlyLimit,
        remainingToday: usage.remainingToday,
        remainingMonth: usage.remainingMonth,
        lastReset: usage.lastReset
      }
    })

  } catch (error) {
    console.error('PUT API route error:', error)
    return createErrorResponse('内部服务器错误', 500)
  }
}