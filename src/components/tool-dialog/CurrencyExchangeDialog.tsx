"use client"

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  TrendingUp,
  X,
  ArrowUpDown,
  ArrowRight,
  Copy,
  Globe,
  Clock,
  Star,
  Bell,
  Loader2,
  RefreshCw
} from 'lucide-react'
import CacheStatusIndicator from '@/components/ui/cache-status-indicator'

interface CurrencyExchangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ExchangeResult {
  success: boolean
  fromCurrency: string
  toCurrency: string
  exchangeRate: number
  convertedAmount: number
  originalAmount: number
  lastUpdate: string
  nextUpdate: string
  cached?: boolean
  fallback?: boolean
  fresh?: boolean
  cacheAge?: number
  apiCallCount?: number
  nextRefresh?: string
  message?: string
}

interface MultiCurrencyResult {
  success: boolean
  baseCurrency: string
  results: Array<{
    currency: string
    rate: number
    convertedAmount: string
    flag: string
  }>
  lastUpdate: string
}

// 支持的货币列表
const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' }
]

// 热门货币对
const POPULAR_PAIRS = [
  { id: 1, from: 'USD', to: 'CNY', fromFlag: '🇺🇸', toFlag: '🇨🇳', rate: '7.2107' },
  { id: 2, from: 'EUR', to: 'CNY', fromFlag: '🇪🇺', toFlag: '🇨🇳', rate: '7.8452' },
  { id: 3, from: 'GBP', to: 'CNY', fromFlag: '🇬🇧', toFlag: '🇨🇳', rate: '9.1523' },
  { id: 4, from: 'JPY', to: 'CNY', fromFlag: '🇯🇵', toFlag: '🇨🇳', rate: '0.0485' },
  { id: 5, from: 'USD', to: 'EUR', fromFlag: '🇺🇸', toFlag: '🇪🇺', rate: '0.9186' },
  { id: 6, from: 'USD', to: 'GBP', fromFlag: '🇺🇸', toFlag: '🇬🇧', rate: '0.7876' }
]

export default function CurrencyExchangeDialog({ open, onOpenChange }: CurrencyExchangeDialogProps) {
  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('CNY')
  const [exchangeResult, setExchangeResult] = useState<ExchangeResult | null>(null)
  const [multiCurrencyData, setMultiCurrencyData] = useState<MultiCurrencyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 汇率查询Hook
  const fetchExchangeRate = useCallback(async (forceRefresh = false) => {
    const currentAmount = amount?.trim() || '0'
    const parsedAmount = parseFloat(currentAmount)

    if (!fromCurrency || !toCurrency || !currentAmount || parsedAmount <= 0) {
      setExchangeResult(null)
      return
    }

    setLoading(true)
    setError('')

    try {
      const url = `/api/exchange-rate?from=${fromCurrency}&to=${toCurrency}&amount=${currentAmount}${forceRefresh ? '&fresh=true' : ''}`
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setExchangeResult(result)
      } else {
        throw new Error(result.error || '获取汇率失败')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('汇率查询失败:', err)
      setExchangeResult(null)
    } finally {
      setLoading(false)
    }
  }, [fromCurrency, toCurrency, amount])

  // 多货币对比查询
  const fetchMultiCurrencyRates = useCallback(async () => {
    const currentAmount = amount?.trim() || '0'
    const parsedAmount = parseFloat(currentAmount)

    const targetCurrencies = ['CNY', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
      .filter(currency => currency !== fromCurrency)
      .slice(0, 6)

    if (targetCurrencies.length === 0 || parsedAmount <= 0) {
      setMultiCurrencyData(null)
      return
    }

    try {
      const response = await fetch('/api/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseCurrency: fromCurrency,
          targetCurrencies,
          amount: parsedAmount
        })
      })

      const result = await response.json()
      if (result.success) {
        setMultiCurrencyData(result)
      } else {
        setMultiCurrencyData(null)
      }
    } catch (error) {
      console.error('获取多货币汇率失败:', error)
      setMultiCurrencyData(null)
    }
  }, [fromCurrency, amount])

  // 防抖查询汇率 - 避免频繁API调用
  useEffect(() => {
    if (!open || !amount || !fromCurrency || !toCurrency) return

    const timeoutId = setTimeout(() => {
      fetchExchangeRate()
      fetchMultiCurrencyRates()
    }, 500) // 500ms防抖

    return () => clearTimeout(timeoutId)
  }, [open, amount, fromCurrency, toCurrency, fetchExchangeRate, fetchMultiCurrencyRates])

  // 定时更新
  useEffect(() => {
    if (!open) return

    const interval = setInterval(() => {
      fetchExchangeRate()
      fetchMultiCurrencyRates()
    }, 1000000) // 30秒更新一次

    return () => clearInterval(interval)
  }, [open, fetchExchangeRate, fetchMultiCurrencyRates])

  // 快捷设置货币对
  const setQuickPair = (from: string, to: string) => {
    setFromCurrency(from)
    setToCurrency(to)
  }

  // 货币互换
  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  // 复制功能
  const copyRate = async () => {
    if (exchangeResult) {
      const text = `1 ${exchangeResult.fromCurrency} = ${(exchangeResult.exchangeRate || 0).toFixed(4)} ${exchangeResult.toCurrency}`
      await navigator.clipboard.writeText(text)
    }
  }

  const copyResult = async () => {
    if (exchangeResult) {
      const text = `${exchangeResult.originalAmount || 0} ${exchangeResult.fromCurrency} = ${(exchangeResult.convertedAmount || 0).toFixed(2)} ${exchangeResult.toCurrency}`
      await navigator.clipboard.writeText(text)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={() => onOpenChange(false)}
      />

      {/* 弹窗主体 */}
      <div className="relative w-[900px] max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden">
        {/* 渐变头部 */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">外贸国际汇率</h2>
                <p className="text-emerald-100 text-sm">专业汇率转换 · 国际参考 · 精准计算</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="text-xs text-emerald-100">每6小时更新一次</span>
              </div> */}
              <button
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 主体内容 */}
        <div className="flex h-[500px]">
          
          {/* 左侧转换区域 */}
          
          <div className="w-[400px] p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">欢迎使用 TradeHelper 国际汇率</h2> 
            </div>
            <LeftExchangeSection
              amount={amount}
              setAmount={setAmount}
              fromCurrency={fromCurrency}
              setFromCurrency={setFromCurrency}
              toCurrency={toCurrency}
              setToCurrency={setToCurrency}
              setQuickPair={setQuickPair}
              swapCurrencies={swapCurrencies}
              onRefresh={fetchExchangeRate}
            />
            
          </div>

          {/* 右侧结果区域 */}
          <div className="flex-1 p-6 bg-white overflow-y-auto">
            <RightResultsSection
              exchangeResult={exchangeResult}
              multiCurrencyData={multiCurrencyData}
              loading={loading}
              error={error}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              amount={amount}
              copyRate={copyRate}
              copyResult={copyResult}
              onRefresh={() => fetchExchangeRate(true)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 左侧转换区域组件
function LeftExchangeSection({
  amount,
  setAmount,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  setQuickPair,
  swapCurrencies,
  onRefresh
}: {
  amount: string
  setAmount: (amount: string) => void
  fromCurrency: string
  setFromCurrency: (currency: string) => void
  toCurrency: string
  setToCurrency: (currency: string) => void
  setQuickPair: (from: string, to: string) => void
  swapCurrencies: () => void
  onRefresh: () => void
}) {
  return (
    <div className="space-y-6">
      {/* 金额输入 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">转换金额</label>
            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-bold h-14 pr-20 text-right border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="0.00"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-lg font-medium text-gray-600">{fromCurrency}</span>
              </div>
            </div>
          </div>

          {/* 货币选择器 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">从</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{currency.flag}</span>
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-gray-500 text-sm">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">到</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{currency.flag}</span>
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-gray-500 text-sm">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 快捷金额 */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">快捷金额</div>
            <div className="grid grid-cols-4 gap-2">
              {['100', '500', '1000', '5000'].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    amount === value
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            
          </div>

          {/* 货币互换按钮 */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-colors group"
            >
              <ArrowUpDown className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

// 右侧结果区域组件
function RightResultsSection({
  exchangeResult,
  multiCurrencyData,
  loading,
  error,
  fromCurrency,
  toCurrency,
  amount,
  copyRate,
  copyResult,
  onRefresh
}: {
  exchangeResult: ExchangeResult | null
  multiCurrencyData: MultiCurrencyResult | null
  loading: boolean
  error: string
  fromCurrency: string
  toCurrency: string
  amount: string
  copyRate: () => void
  copyResult: () => void
  onRefresh: () => void
}) {
  return (
    <div className="space-y-6">
      {/* 缓存状态指示器 */}
      {/* {exchangeResult && (
        <CacheStatusIndicator
          isCached={exchangeResult.cached}
          isFresh={exchangeResult.fresh}
          isFallback={exchangeResult.fallback}
          cacheAge={exchangeResult.cacheAge}
          apiCallCount={exchangeResult.apiCallCount}
          nextRefresh={exchangeResult.nextRefresh}
          message={exchangeResult.message}
          loading={loading}
          onRefresh={onRefresh}
        />
      )} */}

      {/* 主要转换结果 */}
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">转换结果</div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <span className="text-lg">计算中...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 text-lg">
                {error}
              </div>
            ) : exchangeResult ? (
              <>
                {(exchangeResult.convertedAmount || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                <span className="text-2xl text-gray-600 ml-2">{toCurrency}</span>
              </>
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </div>

          {exchangeResult && !loading && !error && (
            <>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span>{amount} {fromCurrency}</span>
                <ArrowRight className="w-4 h-4" />
                <span className="font-medium text-emerald-600">
                  1 {fromCurrency} = {(exchangeResult.exchangeRate || 0).toFixed(4)} {toCurrency}
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="mt-4 flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={copyRate}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制汇率
                </Button>
                <Button variant="outline" size="sm" onClick={copyResult}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制结果
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 多货币对比 */}
      {multiCurrencyData && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            {amount} {fromCurrency} 兑换对比
          </h3>

          <div className="space-y-3">
            {(multiCurrencyData.results || []).map((item) => (
              <div
                key={item.currency}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">{item.currency}</div>
                    <div className="text-sm text-gray-500">1 {fromCurrency} = {(item.rate || 0).toFixed(4)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {parseFloat(item.convertedAmount || '0').toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{item.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 汇率信息卡片 */}
      {exchangeResult && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            汇率信息
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">数据来源</span>
              <span className="font-medium">
                {exchangeResult.fallback ? '模拟数据' : '国际汇率'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">汇率数据每隔6小时会自动刷新</span>
            </div>
            
          </div>
        </div>
      )}

    
    </div>
  )
}