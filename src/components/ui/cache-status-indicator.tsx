"use client"

import React from 'react'
import { RefreshCw, Loader2, Database, Wifi, WifiOff, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CacheStatusIndicatorProps {
  isCached?: boolean
  isFresh?: boolean
  isFallback?: boolean
  cacheAge?: number
  apiCallCount?: number
  nextRefresh?: string
  message?: string
  loading?: boolean
  onRefresh?: () => void
  className?: string
}

export function CacheStatusIndicator({
  isCached = false,
  isFresh = false,
  isFallback = false,
  cacheAge = 0,
  apiCallCount = 0,
  nextRefresh,
  message = '',
  loading = false,
  onRefresh,
  className = ''
}: CacheStatusIndicatorProps) {

  const getStatusConfig = () => {
    if (isFallback) {
      return {
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-700',
        icon: WifiOff,
        label: '离线模式',
        description: 'API暂时不可用，使用历史数据'
      }
    }

    if (isCached && !isFresh) {
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-700',
        icon: Clock,
        label: '更新中',
        description: '数据略有延迟，正在后台更新'
      }
    }

    if (isCached && isFresh) {
      return {
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        icon: Database,
        label: `缓存数据`,
        description: `${cacheAge}分钟前更新，节省API调用`
      }
    }

    return {
      color: 'green',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      icon: Wifi,
      label: '实时数据',
      description: '刚从API获取的最新汇率'
    }
  }

  const status = getStatusConfig()
  const StatusIcon = status.icon

  return (
    <div className={`bg-white rounded-lg border p-4 ${status.bgColor} ${status.borderColor} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-4 h-4 ${status.textColor}`} />
          <span className={`font-medium ${status.textColor}`}>{status.label}</span>
        </div>

        <div className="flex items-center space-x-2">
          {apiCallCount > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              API调用: {apiCallCount}次
            </span>
          )}

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="h-auto p-1.5 hover:bg-white/50"
              title="手动刷新汇率"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              ) : (
                <RefreshCw className="w-4 h-4 text-gray-600" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className={`text-sm ${status.textColor}`}>
        <div>{status.description}</div>
        {message && <div className="mt-1 text-xs opacity-80">{message}</div>}

        {nextRefresh && isFresh && (
          <div className="mt-2 text-xs opacity-60">
            下次自动更新: {new Date(nextRefresh).toLocaleString('zh-CN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CacheStatusIndicator