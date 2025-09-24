"use client"

import React, { useState } from 'react'
import { Truck, X, Search, Package, MapPin, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LogisticsTrackingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LogisticsTrackingDialog({ open, onOpenChange }: LogisticsTrackingDialogProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('auto')

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
                disabled={!trackingNumber.trim()}
              >
                <Search className="w-4 h-4 mr-2" />
                开始查询
              </Button>
            </div>
          </div>

          {/* 结果显示区域 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">物流查询功能</h3>
              <p className="text-gray-500 mb-4">
                请输入运单号开始查询物流信息
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex items-start gap-3 text-left">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">功能开发中...</p>
                    <p>我们正在开发物流追踪功能，敬请期待！届时将支持：</p>
                    <ul className="mt-2 space-y-1 text-gray-500">
                      <li>• 多家快递公司查询</li>
                      <li>• 实时物流状态更新</li>
                      <li>• 物流轨迹可视化</li>
                      <li>• 预计到达时间</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}