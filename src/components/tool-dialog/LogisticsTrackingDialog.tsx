"use client"

import React, { useState } from 'react'
import { Truck, X, Search, Package, MapPin, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TrackingData {
  trackingNumber: string
  carrier: string
  carrierName: string
  status: string
  statusColor: string
  ischeck: boolean
  data: Array<{
    time: string
    location: string
    status: string
  }>
}

interface LogisticsTrackingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LogisticsTrackingDialog({ open, onOpenChange }: LogisticsTrackingDialogProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 查询物流信息
  const handleTrackingSearch = async () => {
    if (!trackingNumber.trim()) {
      setError('请输入运单号')
      return
    }

    setLoading(true)
    setError(null)
    setTrackingData(null)

    try {
      const response = await fetch('/api/logistics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          carrier: carrier
        })
      })

      const result = await response.json()

      if (result.success) {
        setTrackingData(result.data)
      } else {
        setError(result.error || '查询失败')
      }
    } catch (error: any) {
      setError('网络错误，请稍后重试')
      console.error('物流查询错误:', error)
    } finally {
      setLoading(false)
    }
  }

  // 重置状态
  const resetState = () => {
    setTrackingData(null)
    setError(null)
    setTrackingNumber('')
    setCarrier('auto')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange(false)}
      />

      {/* 弹窗主体 */}
      <div className="relative w-[800px] max-h-[90vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* 头部区域 */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center justify-between flex-shrink-0">
          {/* 左侧标题 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">物流查询</h2>
              <p className="text-cyan-100 text-sm">快递追踪 · 物流状态 · 实时更新</p>
            </div>
          </div>

          {/* 关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* 查询区域 */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-gray-900">物流追踪查询</h3>
            </div>

            <div className="grid gap-4">
              {/* 快递公司选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">快递公司</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="auto">自动识别</option>
                  <option value="sf">顺丰速运</option>
                  <option value="ems">EMS</option>
                  <option value="yuantong">圆通速递</option>
                  <option value="shentong">申通快递</option>
                  <option value="zhongtong">中通快递</option>
                  <option value="yunda">韵达速递</option>
                  <option value="dhl">DHL</option>
                  <option value="fedex">FedEx</option>
                  <option value="ups">UPS</option>
                  <option value="tnt">TNT</option>
                </select>
              </div>

              {/* 运单号输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">运单号</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="请输入快递单号或运单号..."
                    className="w-full pr-12 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* 查询按钮 */}
              <Button
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                disabled={!trackingNumber.trim() || loading}
                onClick={handleTrackingSearch}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {loading ? '查询中...' : '开始查询'}
              </Button>
            </div>
          </div>

          {/* 结果显示区域 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* 错误信息显示 */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-800 font-medium">查询失败</h4>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetState}
                  className="mt-3"
                >
                  重新查询
                </Button>
              </div>
            )}

            {/* 物流信息显示 */}
            {trackingData ? (
              <div className="space-y-6">
                {/* 快递基本信息 */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        trackingData.statusColor === 'green' ? 'bg-green-500' :
                        trackingData.statusColor === 'blue' ? 'bg-blue-500' :
                        trackingData.statusColor === 'red' ? 'bg-red-500' :
                        trackingData.statusColor === 'orange' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`} />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {trackingData.carrierName}
                      </h3>
                    </div>
                    {trackingData.ischeck && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        已签收
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">运单号</p>
                      <p className="font-mono font-medium">{trackingData.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">当前状态</p>
                      <p className="font-medium text-gray-900">{trackingData.status}</p>
                    </div>
                  </div>
                </div>

                {/* 物流轨迹 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">物流轨迹</h4>
                  <div className="space-y-4">
                    {trackingData.data.length > 0 ? (
                      trackingData.data.map((item, index) => (
                        <div key={index} className="relative flex gap-4">
                          {/* 时间轴线条 */}
                          {index !== trackingData.data.length - 1 && (
                            <div className="absolute left-2 top-8 bottom-0 w-px bg-gray-200" />
                          )}

                          {/* 时间轴节点 */}
                          <div className={`relative z-10 w-4 h-4 rounded-full border-2 mt-1 ${
                            index === 0
                              ? 'bg-cyan-500 border-cyan-500'
                              : 'bg-white border-gray-300'
                          }`} />

                          {/* 内容 */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium">{item.status}</p>
                                {item.location && item.location !== '未知' && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <p className="text-sm text-gray-600">{item.location}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500 ml-4">
                                <Clock className="w-3 h-3" />
                                <time>{item.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">暂无物流轨迹信息</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={resetState}
                    className="flex-1"
                  >
                    查询其他单号
                  </Button>
                  <Button
                    onClick={handleTrackingSearch}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    刷新状态
                  </Button>
                </div>
              </div>
            ) : !error && !loading && (
              /* 默认状态 */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">物流查询</h3>
                <p className="text-gray-500 mb-4">
                  请输入运单号开始查询物流信息
                </p>
                <div className="max-w-md mx-auto">
                  <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-800">支持的快递公司：</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-blue-700">
                      <div>• 顺丰速运</div>
                      <div>• EMS邮政</div>
                      <div>• 圆通速递</div>
                      <div>• 申通快递</div>
                      <div>• 中通快递</div>
                      <div>• 韵达速递</div>
                      <div>• DHL国际</div>
                      <div>• FedEx联邦</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}