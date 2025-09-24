import { NextRequest, NextResponse } from 'next/server'
import ExchangeRateCache from '@/lib/exchange-rate-cache'

const rateCache = ExchangeRateCache.getInstance()

// 支持的货币信息
const SUPPORTED_CURRENCY_INFO = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' }
]

// 模拟汇率数据作为后备
const MOCK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  'USD': { 'CNY': 7.2456, 'EUR': 0.8542, 'GBP': 0.7834, 'JPY': 149.32 },
  'EUR': { 'USD': 1.1706, 'CNY': 8.4821, 'GBP': 0.9172, 'JPY': 174.82 },
  'GBP': { 'USD': 1.2762, 'CNY': 9.2487, 'EUR': 1.0902, 'JPY': 190.64 },
  'JPY': { 'USD': 0.0067, 'CNY': 0.0485, 'EUR': 0.0057, 'GBP': 0.0052 }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')?.toUpperCase() || 'USD'
  const to = searchParams.get('to')?.toUpperCase() || 'CNY'
  const amount = parseFloat(searchParams.get('amount') || '1')
  const forceRefresh = searchParams.get('fresh') === 'true'

  console.log(`📊 汇率请求: ${from}→${to}, 金额: ${amount}, 强制刷新: ${forceRefresh}`)

  // 如果是相同货币，直接返回
  if (from === to) {
    return NextResponse.json({
      success: true,
      fromCurrency: from,
      toCurrency: to,
      exchangeRate: 1,
      convertedAmount: amount,
      originalAmount: amount,
      lastUpdate: new Date().toISOString(),
      cached: false,
      fresh: true,
      message: '相同货币转换'
    })
  }

  // 检查缓存（除非强制刷新）
  if (!forceRefresh) {
    const cachedData = rateCache.get(from, to)

    if (cachedData) {
      const convertedAmount = amount * cachedData.rates.conversion_rate

      console.log(`✅ 缓存命中: ${from}→${to} (${cachedData.cacheAge}分钟前)`)

      // 如果数据过期，异步更新（用户无感知）
      if (cachedData.status === 'stale') {
        console.log(`🔄 异步更新开始: ${from}→${to}`)
        updateCacheAsync(from, to).catch(console.error)
      }

      return NextResponse.json({
        success: true,
        fromCurrency: from,
        toCurrency: to,
        exchangeRate: cachedData.rates.conversion_rate,
        convertedAmount: convertedAmount,
        originalAmount: amount,
        lastUpdate: cachedData.lastAPICall,
        nextUpdate: cachedData.rates.time_next_update_utc || new Date(cachedData.timestamp + 6 * 60 * 60 * 1000).toISOString(),
        cached: true,
        fresh: cachedData.status === 'fresh',
        cacheAge: cachedData.cacheAge,
        apiCallCount: cachedData.apiCallCount,
        nextRefresh: new Date(cachedData.timestamp + 6 * 60 * 60 * 1000).toISOString(),
        message: cachedData.status === 'stale' ? '数据更新中，使用缓存' : '使用缓存数据'
      })
    }
  }

  // 缓存未命中或强制刷新，调用API
  try {
    console.log(`🌐 API调用: ${from}→${to}`)
    const apiKey = process.env.EXCHANGE_RATE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('API密钥未配置')
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/1`,
      {
        headers: {
          'User-Agent': 'TradingTools/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`ExchangeRate API错误: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.result !== 'success') {
      throw new Error(data['error-type'] || `API返回错误: ${data.result}`)
    }

    // 更新缓存
    rateCache.set(from, to, data)

    const convertedAmount = amount * data.conversion_rate

    console.log(`✅ API调用成功: ${from}→${to}, 汇率: ${data.conversion_rate}`)

    return NextResponse.json({
      success: true,
      fromCurrency: from,
      toCurrency: to,
      exchangeRate: data.conversion_rate,
      convertedAmount: convertedAmount,
      originalAmount: amount,
      lastUpdate: data.time_last_update_utc,
      nextUpdate: data.time_next_update_utc,
      cached: false,
      fresh: true,
      message: '获取最新汇率成功'
    })

  } catch (error: any) {
    console.error(`❌ API调用失败: ${from}→${to}:`, error)

    // API失败，尝试使用降级缓存
    const fallbackData = rateCache.get(from, to)

    if (fallbackData) {
      const convertedAmount = amount * fallbackData.rates.conversion_rate

      console.log(`💾 使用降级缓存: ${from}→${to}`)

      return NextResponse.json({
        success: true,
        fromCurrency: from,
        toCurrency: to,
        exchangeRate: fallbackData.rates.conversion_rate,
        convertedAmount: convertedAmount,
        originalAmount: amount,
        lastUpdate: fallbackData.lastAPICall,
        nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        cached: true,
        fallback: true,
        cacheAge: fallbackData.cacheAge,
        error: 'API暂时不可用，使用缓存数据',
        message: 'API异常，使用历史数据'
      })
    }

    // 如果没有缓存，尝试使用模拟数据
    const mockRate = MOCK_EXCHANGE_RATES[from]?.[to] || (1 / (MOCK_EXCHANGE_RATES[to]?.[from] || 1))
    if (mockRate) {
      const fluctuation = 0.995 + (Math.random() * 0.01)
      const adjustedRate = mockRate * fluctuation
      const convertedAmount = amount * adjustedRate

      return NextResponse.json({
        success: true,
        fromCurrency: from,
        toCurrency: to,
        exchangeRate: adjustedRate,
        convertedAmount: convertedAmount,
        originalAmount: amount,
        lastUpdate: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        cached: false,
        fallback: true,
        mockData: true,
        message: '使用模拟数据（API不可用）'
      })
    }

    // 完全没有数据
    return NextResponse.json({
      success: false,
      error: `无法获取 ${from} 到 ${to} 的汇率数据: ${error.message}`,
      fromCurrency: from,
      toCurrency: to
    }, { status: 500 })
  }
}

// 异步更新缓存函数
async function updateCacheAsync(from: string, to: string): Promise<void> {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') return

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/1`
    )

    if (response.ok) {
      const data = await response.json()
      if (data.result === 'success') {
        rateCache.set(from, to, data)
        console.log(`✅ 异步更新成功: ${from}→${to}`)
      }
    }
  } catch (error) {
    console.error(`❌ 异步更新失败: ${from}→${to}:`, error)
  }
}

// 获取多货币汇率对比和管理缓存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 获取缓存统计信息
    if (body.action === 'stats') {
      const stats = rateCache.getStats()
      return NextResponse.json({
        success: true,
        stats,
        message: '缓存统计信息'
      })
    }

    // 清空缓存（调试用）
    if (body.action === 'clear') {
      rateCache.clear()
      return NextResponse.json({
        success: true,
        message: '缓存已清空'
      })
    }

    // 多货币汇率查询
    const { baseCurrency, targetCurrencies, amount } = body

    if (!baseCurrency || !targetCurrencies || !amount) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数：baseCurrency, targetCurrencies, amount'
      }, { status: 400 })
    }

    const results = []
    let cachedCount = 0
    let freshCount = 0

    for (const targetCurrency of targetCurrencies) {
      try {
        // 检查缓存
        const cachedData = rateCache.get(baseCurrency, targetCurrency)
        let rate = null
        let isCached = false
        let isFresh = false

        if (cachedData) {
          rate = cachedData.rates.conversion_rate
          isCached = true
          isFresh = cachedData.status === 'fresh'
          cachedCount++
          if (isFresh) freshCount++

          // 如果缓存过期，异步更新
          if (cachedData.status === 'stale') {
            updateCacheAsync(baseCurrency, targetCurrency).catch(console.error)
          }
        } else {
          // 缓存未命中，调用API
          try {
            const apiKey = process.env.EXCHANGE_RATE_API_KEY
            if (apiKey && apiKey !== 'your_api_key_here') {
              const response = await fetch(
                `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}/1`
              )

              if (response.ok) {
                const data = await response.json()
                if (data.result === 'success') {
                  rate = data.conversion_rate
                  rateCache.set(baseCurrency, targetCurrency, data)
                  freshCount++
                }
              }
            }
          } catch (error) {
            console.error(`Failed to fetch rate for ${baseCurrency}→${targetCurrency}:`, error)
          }
        }

        // 如果API失败，使用模拟数据
        if (!rate) {
          rate = MOCK_EXCHANGE_RATES[baseCurrency]?.[targetCurrency] ||
                 (1 / (MOCK_EXCHANGE_RATES[targetCurrency]?.[baseCurrency] || 1))
          const fluctuation = 0.995 + (Math.random() * 0.01)
          rate = rate * fluctuation
        }

        if (rate) {
          const currencyInfo = SUPPORTED_CURRENCY_INFO.find(c => c.code === targetCurrency)
          results.push({
            currency: targetCurrency,
            rate: rate,
            convertedAmount: (amount * rate).toFixed(2),
            flag: currencyInfo?.flag || '🏳️',
            cached: isCached,
            fresh: isFresh
          })
        }
      } catch (error) {
        console.error(`Error processing ${baseCurrency}→${targetCurrency}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      baseCurrency,
      results,
      lastUpdate: new Date().toISOString(),
      cacheStats: {
        totalCached: cachedCount,
        totalFresh: freshCount,
        cacheHitRate: targetCurrencies.length > 0 ? (cachedCount / targetCurrencies.length * 100).toFixed(1) + '%' : '0%'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// 获取所有支持的货币列表
export async function PATCH() {
  const currencies = SUPPORTED_CURRENCY_INFO

  return NextResponse.json({
    success: true,
    currencies,
    totalCount: currencies.length,
    cacheStats: rateCache.getStats()
  })
}