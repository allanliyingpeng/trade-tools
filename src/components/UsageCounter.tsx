"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUsageLimits } from '@/hooks/useUsageLimits'
import { Progress } from '@/components/ui/progress'
import { RefreshCw, AlertCircle, TrendingUp, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UsageCounterProps {
  workflowId?: string
  showDetails?: boolean
  variant?: 'compact' | 'detailed' | 'badge'
  className?: string
}

export function UsageCounter({
  workflowId,
  showDetails = false,
  variant = 'compact',
  className
}: UsageCounterProps) {
  const { usageStats, isLoading, error, refreshUsage, canExecute, limitMessage } = useUsageLimits(workflowId)

  if (variant === 'badge' && usageStats) {
    return (
      <Badge
        variant={canExecute ? 'secondary' : 'destructive'}
        className={cn('flex items-center gap-1', className)}
      >
        <span>{usageStats.remainingToday}</span>
        <span className="text-xs opacity-70">/ {usageStats.dailyLimit}</span>
      </Badge>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">加载中...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>获取失败</span>
          </div>
        ) : usageStats ? (
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-medium',
              canExecute ? 'text-foreground' : 'text-destructive'
            )}>
              剩余 {usageStats.remainingToday}
            </span>
            <span className="text-muted-foreground">/ {usageStats.dailyLimit}</span>
            {!canExecute && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">使用统计</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refreshUsage()}
              disabled={isLoading}
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </Button>
          </div>

          {error ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : usageStats ? (
            <div className="space-y-4">
              {!canExecute && limitMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{limitMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">今日使用</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{usageStats.dailyUsed} / {usageStats.dailyLimit}</span>
                      <span className="text-muted-foreground">
                        {((usageStats.dailyUsed / usageStats.dailyLimit) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(usageStats.dailyUsed / usageStats.dailyLimit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    剩余 {usageStats.remainingToday} 次
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">本月使用</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{usageStats.monthlyUsed} / {usageStats.monthlyLimit}</span>
                      <span className="text-muted-foreground">
                        {((usageStats.monthlyUsed / usageStats.monthlyLimit) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(usageStats.monthlyUsed / usageStats.monthlyLimit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    剩余 {usageStats.remainingMonth} 次
                  </div>
                </div>
              </div>

              {showDetails && (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      上次更新: {new Date(usageStats.lastReset).toLocaleString('zh-CN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">每日重置:</span>
                      <span className="ml-1">每天 00:00</span>
                    </div>
                    <div>
                      <span className="font-medium">每月重置:</span>
                      <span className="ml-1">每月 1 号</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function UsageBadge({ workflowId, className }: { workflowId?: string; className?: string }) {
  return <UsageCounter workflowId={workflowId} variant="badge" className={className} />
}

export function UsageProgress({ workflowId, className }: { workflowId?: string; className?: string }) {
  const { usageStats, canExecute } = useUsageLimits(workflowId)

  if (!usageStats) return null

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">今日使用</span>
        <span className={cn(
          'font-medium',
          canExecute ? 'text-foreground' : 'text-destructive'
        )}>
          {usageStats.dailyUsed} / {usageStats.dailyLimit}
        </span>
      </div>
      <Progress
        value={(usageStats.dailyUsed / usageStats.dailyLimit) * 100}
        className="h-1"
      />
    </div>
  )
}