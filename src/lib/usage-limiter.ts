import { supabase } from './supabase'
import type { UserUsageLimit, WorkflowUsageLog } from '@/types/database'

export interface UsageCheckResult {
  canUse: boolean
  dailyRemaining: number
  monthlyRemaining: number
  limitType: 'daily' | 'monthly' | 'none'
  limitReached: boolean
  error?: string
}

export interface UsageStats {
  dailyUsed: number
  dailyLimit: number
  monthlyUsed: number
  monthlyLimit: number
  remainingToday: number
  remainingMonth: number
  lastReset: string
}

export class UsageLimiter {
  constructor(private userId: string) {}

  async checkUsageLimit(workflowId?: string): Promise<UsageCheckResult> {
    try {
      const { data, error } = await supabase.rpc('check_usage_limit', {
        p_user_id: this.userId,
        p_workflow_id: workflowId || null
      })

      if (error) {
        console.error('Error checking usage limit:', error)
        return {
          canUse: false,
          dailyRemaining: 0,
          monthlyRemaining: 0,
          limitType: 'daily',
          limitReached: true,
          error: error.message
        }
      }

      if (!data || data.length === 0) {
        return {
          canUse: false,
          dailyRemaining: 0,
          monthlyRemaining: 0,
          limitType: 'daily',
          limitReached: true,
          error: 'No usage data found'
        }
      }

      const result = data[0]
      return {
        canUse: result.can_use,
        dailyRemaining: Math.max(0, result.daily_remaining),
        monthlyRemaining: Math.max(0, result.monthly_remaining),
        limitType: result.limit_type,
        limitReached: result.limit_reached
      }
    } catch (error) {
      console.error('Error in checkUsageLimit:', error)
      return {
        canUse: false,
        dailyRemaining: 0,
        monthlyRemaining: 0,
        limitType: 'daily',
        limitReached: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async incrementUsageCount(workflowId?: string, tokensUsed: number = 0): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('increment_usage_count', {
        p_user_id: this.userId,
        p_workflow_id: workflowId || null,
        p_tokens_used: tokensUsed
      })

      if (error) {
        console.error('Error incrementing usage count:', error)
        return false
      }

      return data === true
    } catch (error) {
      console.error('Error in incrementUsageCount:', error)
      return false
    }
  }

  async initializeUserLimits(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('initialize_user_limits', {
        user_id: this.userId
      })

      if (error) {
        console.error('Error initializing user limits:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in initializeUserLimits:', error)
      return false
    }
  }

  async getUserUsageStats(workflowId?: string): Promise<UsageStats | null> {
    try {
      const { data: limits, error: limitsError } = await supabase
        .from('user_usage_limits')
        .select('*')
        .eq('user_id', this.userId)
        .is('workflow_id', workflowId || null)
        .in('limit_type', ['daily', 'monthly'])

      if (limitsError) {
        console.error('Error fetching usage limits:', limitsError)
        return null
      }

      const dailyLimit = limits?.find(l => l.limit_type === 'daily')
      const monthlyLimit = limits?.find(l => l.limit_type === 'monthly')

      if (!dailyLimit || !monthlyLimit) {
        await this.initializeUserLimits()
        return this.getUserUsageStats(workflowId)
      }

      return {
        dailyUsed: dailyLimit.used_count,
        dailyLimit: dailyLimit.limit_count,
        monthlyUsed: monthlyLimit.used_count,
        monthlyLimit: monthlyLimit.limit_count,
        remainingToday: Math.max(0, dailyLimit.limit_count - dailyLimit.used_count),
        remainingMonth: Math.max(0, monthlyLimit.limit_count - monthlyLimit.used_count),
        lastReset: dailyLimit.updated_at
      }
    } catch (error) {
      console.error('Error in getUserUsageStats:', error)
      return null
    }
  }

  async logWorkflowUsage(
    workflowId: string,
    workflowRunId: string,
    tokensUsed: number,
    executionTime: number,
    status: 'success' | 'failed',
    errorMessage?: string,
    requestData?: any,
    responseData?: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workflow_usage_logs')
        .insert({
          user_id: this.userId,
          workflow_id: workflowId,
          workflow_run_id: workflowRunId,
          tokens_used: tokensUsed,
          execution_time: executionTime,
          status,
          error_message: errorMessage,
          request_data: requestData,
          response_data: responseData
        })

      if (error) {
        console.error('Error logging workflow usage:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in logWorkflowUsage:', error)
      return false
    }
  }

  async getUsageHistory(
    limit: number = 50,
    workflowId?: string
  ): Promise<WorkflowUsageLog[]> {
    try {
      let query = supabase
        .from('workflow_usage_logs')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (workflowId) {
        query = query.eq('workflow_id', workflowId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching usage history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getUsageHistory:', error)
      return []
    }
  }

  async updateUserLimits(
    limitType: 'daily' | 'monthly',
    newLimit: number,
    workflowId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_usage_limits')
        .upsert({
          user_id: this.userId,
          workflow_id: workflowId || null,
          limit_type: limitType,
          limit_count: newLimit,
          used_count: 0,
          reset_at: limitType === 'daily'
            ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        }, {
          onConflict: 'user_id,workflow_id,limit_type'
        })

      if (error) {
        console.error('Error updating user limits:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateUserLimits:', error)
      return false
    }
  }

  async resetUsageCount(
    limitType: 'daily' | 'monthly',
    workflowId?: string
  ): Promise<boolean> {
    try {
      const nextReset = limitType === 'daily'
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)

      const { error } = await supabase
        .from('user_usage_limits')
        .update({
          used_count: 0,
          reset_at: nextReset.toISOString()
        })
        .eq('user_id', this.userId)
        .eq('limit_type', limitType)
        .is('workflow_id', workflowId || null)

      if (error) {
        console.error('Error resetting usage count:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in resetUsageCount:', error)
      return false
    }
  }

  async canExecuteWorkflow(workflowId?: string): Promise<{
    allowed: boolean
    reason?: string
    remainingToday: number
    remainingMonth: number
  }> {
    const result = await this.checkUsageLimit(workflowId)

    if (result.error) {
      return {
        allowed: false,
        reason: result.error,
        remainingToday: 0,
        remainingMonth: 0
      }
    }

    return {
      allowed: result.canUse,
      reason: result.limitReached
        ? `已达到${result.limitType === 'daily' ? '每日' : '每月'}使用限制`
        : undefined,
      remainingToday: result.dailyRemaining,
      remainingMonth: result.monthlyRemaining
    }
  }
}

export const createUsageLimiter = (userId: string): UsageLimiter => {
  return new UsageLimiter(userId)
}