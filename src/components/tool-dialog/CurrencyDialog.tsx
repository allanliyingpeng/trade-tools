"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDifyWorkflow } from '@/hooks/useDifyWorkflow'
import { useUsageLimits } from '@/hooks/useUsageLimits'
import { ToolDialogContent, ToolDialogSection } from './ToolDialog'
import { ArrowRight, RefreshCw, TrendingUp, TrendingDown, Loader2, AlertCircle, BarChart3, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Feature } from '@/data/features'

interface CurrencyDialogProps {
  feature: Feature
}

const currencies = [
  { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
  { code: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳' },
  { code: 'EUR', name: '欧元', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: '英镑', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: '日元', symbol: '¥', flag: '🇯🇵' },
  { code: 'KRW', name: '韩元', symbol: '₩', flag: '🇰🇷' },
  { code: 'HKD', name: '港币', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AUD', name: '澳元', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: '加元', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: '瑞士法郎', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'SEK', name: '瑞典克朗', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: '挪威克朗', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: '丹麦克朗', symbol: 'kr', flag: '🇩🇰' },
  { code: 'INR', name: '印度卢比', symbol: '₹', flag: '🇮🇳' },
  { code: 'THB', name: '泰铢', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: '马来西亚林吉特', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: '印尼盾', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'PHP', name: '菲律宾比索', symbol: '₱', flag: '🇵🇭' },
  { code: 'VND', name: '越南盾', symbol: '₫', flag: '🇻🇳' }
]

const quickAmounts = [100, 500, 1000, 5000, 10000]

export default function CurrencyDialog({ feature }: CurrencyDialogProps) {
  const [amount, setAmount] = useState('1')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('CNY')
  const [result, setResult] = useState<any>(null)
  const [rateHistory, setRateHistory] = useState<any[]>([])

  const { executeWorkflow, status, error, isLoading, resetState } = useDifyWorkflow()
  const { canExecute, limitMessage } = useUsageLimits(feature.workflowId)

  const handleConvert = async () => {
    if (!amount || !canExecute || parseFloat(amount) <= 0) return

    resetState()

    try {
      const workflowResult = await executeWorkflow(feature.workflowId!, {
        amount: parseFloat(amount),
        from_currency: fromCurrency,
        to_currency: toCurrency,
        include_history: true
      })

      if (workflowResult?.status === 'success' && workflowResult.data) {
        setResult(workflowResult.data)
        if (workflowResult.data.rate_history) {
          setRateHistory(workflowResult.data.rate_history)
        }
      }
    } catch (error) {
      console.error('Currency conversion failed:', error)
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
    setRateHistory([])
    resetState()
  }

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode)
    return `${currency?.symbol || ''}${formatNumber(amount)}`
  }

  const getRateChange = () => {
    if (!result?.rate_change) return null
    const change = result.rate_change
    const isPositive = change > 0
    return {
      value: Math.abs(change),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600'
    }
  }

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timeoutId = setTimeout(() => {
        handleConvert()
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [amount, fromCurrency, toCurrency])

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency)
  const toCurrencyData = currencies.find(c => c.code === toCurrency)
  const rateChange = getRateChange()

  return (
    <ToolDialogContent>
      <ToolDialogSection
        title="货币转换"
        description="输入金额并选择货币进行实时汇率转换"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 输入区域 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">转换金额</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="输入金额"
                className="text-lg"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">从</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">到</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">快速金额</label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="text-xs"
                  >
                    {formatNumber(quickAmount, 0)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 结果显示 */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  转换结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                {status === 'running' ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                      <p className="text-sm text-muted-foreground">查询汇率中...</p>
                    </div>
                  </div>
                ) : status === 'error' ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-6 w-6 mx-auto text-red-500" />
                      <p className="text-sm text-red-600">{error || '汇率查询失败'}</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {fromCurrencyData?.flag} {formatCurrency(parseFloat(amount), fromCurrency)}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">
                          {toCurrencyData?.flag} {formatCurrency(result.converted_amount, toCurrency)}
                        </div>
                      </div>
                      {rateChange && (
                        <div className={cn("flex items-center gap-1", rateChange.color)}>
                          <rateChange.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {rateChange.value.toFixed(4)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">汇率</span>
                        <div className="font-mono">
                          1 {fromCurrency} = {result.exchange_rate?.toFixed(6)} {toCurrency}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">更新时间</span>
                        <div className="text-xs">
                          {result.last_updated ? new Date(result.last_updated).toLocaleString('zh-CN') : '刚刚'}
                        </div>
                      </div>
                    </div>

                    {result.market_status && (
                      <Badge variant={result.market_status === 'open' ? 'default' : 'secondary'}>
                        市场 {result.market_status === 'open' ? '开盘' : '休市'}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <p className="text-sm">输入金额查看转换结果</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 汇率历史 */}
            {rateHistory.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    汇率走势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rateHistory.slice(0, 7).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{item.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{item.rate?.toFixed(6)}</span>
                          {item.change && (
                            <span className={cn(
                              "text-xs",
                              item.change > 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {item.change > 0 ? '+' : ''}{item.change.toFixed(4)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {limitMessage && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{limitMessage}</span>
            </div>
          </div>
        )}
      </ToolDialogSection>
    </ToolDialogContent>
  )
}