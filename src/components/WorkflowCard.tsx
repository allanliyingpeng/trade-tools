"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useDifyWorkflow } from '@/hooks/useDifyWorkflow'
import { useUsageLimits } from '@/hooks/useUsageLimits'
import { UsageBadge, UsageProgress } from '@/components/UsageCounter'
import { LucideIcon, Loader2, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkflowCardProps {
  workflow: {
    id: string
    title: string
    description: string
    icon: LucideIcon
    color: string
    gradient: string
    defaultInputs?: Record<string, any>
  }
  onExecute?: (workflowId: string, inputs: Record<string, any>) => void
  onResult?: (result: any) => void
  inputs?: Record<string, any>
  className?: string
}

export function WorkflowCard({
  workflow,
  onExecute,
  onResult,
  inputs = {},
  className
}: WorkflowCardProps) {
  const { executeWorkflow, status, result, error, isLoading, resetState } = useDifyWorkflow()
  const { canExecute, limitMessage, usageStats } = useUsageLimits(workflow.id)
  const [isExpanded, setIsExpanded] = useState(false)

  const Icon = workflow.icon

  const handleExecute = async () => {
    if (!canExecute) return

    const finalInputs = { ...workflow.defaultInputs, ...inputs }

    try {
      const executionResult = await executeWorkflow(workflow.id, finalInputs)

      if (executionResult && onResult) {
        onResult(executionResult)
      }

      if (onExecute) {
        onExecute(workflow.id, finalInputs)
      }
    } catch (error) {
      console.error('Workflow execution failed:', error)
    }
  }

  const handleReset = () => {
    resetState()
    setIsExpanded(false)
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'running':
        return '执行中...'
      case 'success':
        return '执行成功'
      case 'error':
        return '执行失败'
      default:
        return canExecute ? '开始执行' : '已达限制'
    }
  }

  const showResults = (status === 'success' || status === 'error') && (result || error)

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      !canExecute && 'opacity-75',
      className
    )}>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
          workflow.gradient
        )}
      />

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shrink-0",
                workflow.gradient
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{workflow.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <UsageBadge workflowId={workflow.id} />
                {status !== 'idle' && (
                  <Badge variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
                    {getStatusIcon()}
                    <span className="ml-1">{getStatusText()}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {usageStats && (
          <UsageProgress workflowId={workflow.id} className="mt-3" />
        )}
      </CardHeader>

      <CardContent className="relative space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {workflow.description}
        </CardDescription>

        {limitMessage && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{limitMessage}</span>
            </div>
          </div>
        )}

        {showResults && (
          <div className="space-y-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors">
                <span className="text-sm font-medium">
                  {status === 'success' ? '执行结果' : '错误信息'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isExpanded ? '收起' : '展开'}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="space-y-2">
                {status === 'success' && result?.data && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-green-800">执行成功</div>
                      <div className="text-xs text-green-700">
                        <pre className="whitespace-pre-wrap overflow-x-auto">
                          {typeof result.data === 'string'
                            ? result.data
                            : JSON.stringify(result.data, null, 2)
                          }
                        </pre>
                      </div>
                      {result.usage && (
                        <div className="flex items-center gap-4 pt-2 border-t border-green-200 text-xs text-green-600">
                          <span>用时: {result.usage.time}ms</span>
                          <span>Token: {result.usage.tokens}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {status === 'error' && (error || result?.error) && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-red-800">执行失败</div>
                      <div className="text-xs text-red-700">
                        {error || result?.error}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleExecute}
            disabled={!canExecute || isLoading}
            className="flex-1"
            variant={canExecute ? 'default' : 'secondary'}
          >
            {getStatusIcon()}
            <span className="ml-2">{getStatusText()}</span>
          </Button>

          {showResults && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function WorkflowCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-2 w-full mt-3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}