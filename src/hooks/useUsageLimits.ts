import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

interface UsageStats {
  dailyUsed: number
  dailyLimit: number
  monthlyUsed: number
  monthlyLimit: number
  remainingToday: number
  remainingMonth: number
  lastReset: string
}

interface UseUsageLimitsReturn {
  usageStats: UsageStats | null
  isLoading: boolean
  error: string | null
  refreshUsage: (workflowId?: string) => Promise<void>
  canExecute: boolean
  limitMessage: string | null
}

export function useUsageLimits(workflowId?: string): UseUsageLimitsReturn {
  const { user, session } = useAuth()
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshUsage = useCallback(
    async (targetWorkflowId?: string) => {
      if (!user || !session) {
        setError('用户未登录')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const workflowIdParam = targetWorkflowId || workflowId
        const url = workflowIdParam
          ? `/api/dify/${workflowIdParam}`
          : '/api/dify/general'

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        if (!data.success) {
          throw new Error(data.error || '获取使用统计失败')
        }

        setUsageStats(data.usage)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取使用统计时发生未知错误'
        setError(errorMessage)
        console.error('Error refreshing usage:', err)

      } finally {
        setIsLoading(false)
      }
    },
    [user, session, workflowId]
  )

  useEffect(() => {
    if (user && session) {
      refreshUsage()
    }
  }, [user, session, refreshUsage])

  const canExecute = usageStats ?
    usageStats.remainingToday > 0 && usageStats.remainingMonth > 0 :
    false

  const limitMessage = usageStats && !canExecute ?
    usageStats.remainingToday <= 0 ? '今日使用次数已用完' :
    usageStats.remainingMonth <= 0 ? '本月使用次数已用完' :
    null : null

  return {
    usageStats,
    isLoading,
    error,
    refreshUsage,
    canExecute,
    limitMessage
  }
}

export function useGlobalUsageLimits(): UseUsageLimitsReturn {
  return useUsageLimits()
}

export function useWorkflowUsageLimits(workflowId: string): UseUsageLimitsReturn {
  return useUsageLimits(workflowId)
}