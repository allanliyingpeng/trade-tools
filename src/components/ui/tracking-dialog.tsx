"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Package,
  Truck,
  PackageCheck,
  MapPin,
  Clock,
  AlertCircle,
  Loader2,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

interface TrackingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TrackData {
  context: string
  time: string
  ftime: string
  status?: string
  areaCode?: string
  areaName?: string
}

interface TrackingResult {
  trackingNumber: string
  company: string
  state: string
  condition: string
  ischeck: string
  tracks: TrackData[]
}

// 根据物流状态选择图标
const getStatusIcon = (index: number, totalCount: number, context: string) => {
  const isLatest = index === 0
  const iconClass = isLatest ? 'text-blue-600' : 'text-gray-500'

  // 根据上下文内容智能选择图标
  if (context.includes('签收') || context.includes('妥投') || context.includes('派送成功')) {
    return <PackageCheck className={`w-5 h-5 ${iconClass}`} />
  } else if (context.includes('派送中') || context.includes('派件') || context.includes('正在派送')) {
    return <Truck className={`w-5 h-5 ${iconClass}`} />
  } else if (context.includes('到达') || context.includes('抵达') || context.includes('到站')) {
    return <MapPin className={`w-5 h-5 ${iconClass}`} />
  } else if (context.includes('揽收') || context.includes('收件') || context.includes('发出')) {
    return <Package className={`w-5 h-5 ${iconClass}`} />
  } else if (context.includes('转运') || context.includes('运输')) {
    return <ArrowRight className={`w-5 h-5 ${iconClass}`} />
  } else {
    return <Clock className={`w-5 h-5 ${iconClass}`} />
  }
}

// 获取快递公司中文名
const getCompanyName = (com: string) => {
  const companyNames: Record<string, string> = {
    'shentong': '申通快递',
    'ems': 'EMS',
    'shunfeng': '顺丰速运',
    'yuantong': '圆通速递',
    'yunda': '韵达速递',
    'zhongtong': '中通快递',
    'huitongkuaidi': '汇通快递',
    'tiantian': '天天快递',
    'dhl': 'DHL',
    'fedex': 'FedEx',
    'ups': 'UPS'
  }
  return companyNames[com] || com.toUpperCase()
}

export function TrackingDialog({ open, onOpenChange }: TrackingDialogProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [error, setError] = useState<string>('')

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('请输入快递单号')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || '查询失败，请重试')
      }
    } catch (err) {
      console.error('Tracking error:', err)
      setError('网络错误，请检查网络连接后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTrackingNumber('')
    setResult(null)
    setError('')
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-2" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            追踪您的包裹
          </DialogTitle>
        </DialogHeader>

        {/* 输入区域 */}
        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="请输入快递单号"
            className="flex-1"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleTrack()}
          />
          <Button
            onClick={result ? handleReset : handleTrack}
            disabled={loading}
            className="min-w-[80px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                查询中
              </>
            ) : result ? (
              '重新查询'
            ) : (
              '查询'
            )}
          </Button>
        </div>

        {/* 结果区域 */}
        <div className="flex-1 overflow-y-auto">
          {loading && <LoadingSkeleton />}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-6">
              {/* 快递信息头部 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {getCompanyName(result.company)}
                    </h3>
                    <p className="text-sm text-gray-600">运单号: {result.trackingNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      result.ischeck === '1'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.ischeck === '1' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          已签收
                        </>
                      ) : (
                        <>
                          <Truck className="w-3 h-3 mr-1" />
                          运输中
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 物流时间线 */}
              <div className="relative">
                <h4 className="font-semibold mb-4 text-gray-900">物流轨迹</h4>
                <div className="space-y-4">
                  {result.tracks.map((track, index) => (
                    <div key={index} className="flex items-start gap-4">
                      {/* 状态图标 */}
                      <div className="flex-shrink-0 relative">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                          index === 0
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          {getStatusIcon(index, result.tracks.length, track.context)}
                        </div>
                        {/* 连接线 */}
                        {index < result.tracks.length - 1 && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
                        )}
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className={`p-3 rounded-lg border ${
                          index === 0
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <p className={`text-sm font-medium ${
                            index === 0 ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {track.context}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">
                              {track.ftime || track.time}
                            </span>
                            {track.areaName && (
                              <>
                                <MapPin className="w-3 h-3 text-gray-500 ml-2" />
                                <span className="text-xs text-gray-600">
                                  {track.areaName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.tracks.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">暂无物流信息</p>
                </div>
              )}
            </div>
          )}

          {/* 默认状态 */}
          {!loading && !error && !result && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">开始追踪您的包裹</h3>
              <p className="text-gray-500">
                输入快递单号，即可查询实时物流信息
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}