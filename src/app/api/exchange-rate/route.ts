import { NextResponse } from 'next/server';

// 全局缓存存储 (服务端内存缓存)
const rateCache = new Map<string, {
  rate: number;
  timestamp: number;
  lastUpdate: string;
}>();

const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存

// 支持的货币列表
const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY',
  'HKD', 'SGD', 'KRW', 'INR', 'BRL', 'MXN', 'RUB'
]

// 模拟汇率数据作为后备
const MOCK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  'USD': { 'CNY': 7.2456, 'EUR': 0.8542, 'GBP': 0.7834, 'JPY': 149.32 },
  'EUR': { 'USD': 1.1706, 'CNY': 8.4821, 'GBP': 0.9172, 'JPY': 174.82 },
  'GBP': { 'USD': 1.2762, 'CNY': 9.2487, 'EUR': 1.0902, 'JPY': 190.64 },
  'JPY': { 'USD': 0.0067, 'CNY': 0.0485, 'EUR': 0.0057, 'GBP': 0.0052 }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || 'USD';
  const to = searchParams.get('to') || 'CNY';
  const cacheKey = `${from}_${to}`;
  const now = Date.now();

  // 验证货币代码
  if (!SUPPORTED_CURRENCIES.includes(from) || !SUPPORTED_CURRENCIES.includes(to)) {
    return Response.json({
      success: false,
      error: `不支持的货币代码: ${from} 或 ${to}`
    }, { status: 400 });
  }

  // 如果是相同货币，返回1
  if (from === to) {
    return Response.json({
      success: true,
      rate: 1,
      baseCurrency: from,
      targetCurrency: to,
      lastUpdate: new Date().toISOString(),
      cached: false
    });
  }

  // 检查服务端缓存
  const cachedData = rateCache.get(cacheKey);
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    console.log(`汇率缓存命中: ${cacheKey}`);
    return Response.json({
      success: true,
      rate: cachedData.rate,
      baseCurrency: from,
      targetCurrency: to,
      lastUpdate: cachedData.lastUpdate,
      cached: true
    });
  }

  try {
    console.log(`调用汇率API: ${cacheKey}`);
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (apiKey && apiKey !== 'your_api_key_here') {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`,
        { next: { revalidate: 1800 } }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.result === 'success') {
          // 更新服务端缓存
          rateCache.set(cacheKey, {
            rate: data.conversion_rate,
            timestamp: now,
            lastUpdate: data.time_last_update_utc
          });

          // 清理过期缓存
          for (const [key, value] of rateCache.entries()) {
            if (now - value.timestamp > CACHE_DURATION) {
              rateCache.delete(key);
            }
          }

          return Response.json({
            success: true,
            rate: data.conversion_rate,
            baseCurrency: from,
            targetCurrency: to,
            lastUpdate: data.time_last_update_utc,
            cached: false
          });
        }
      }
    }

    // API失败，使用模拟数据作为后备
    console.warn('使用模拟汇率数据作为后备');
    const rate = MOCK_EXCHANGE_RATES[from]?.[to] || (1 / (MOCK_EXCHANGE_RATES[to]?.[from] || 1));
    const fluctuation = 0.995 + (Math.random() * 0.01);
    const adjustedRate = rate * fluctuation;

    return Response.json({
      success: true,
      rate: adjustedRate,
      baseCurrency: from,
      targetCurrency: to,
      lastUpdate: new Date().toISOString(),
      cached: false,
      fallback: true
    });

  } catch (error: any) {
    // 如果API调用失败，尝试返回过期缓存
    if (cachedData) {
      console.log(`API失败，使用过期缓存: ${cacheKey}`);
      return Response.json({
        success: true,
        rate: cachedData.rate,
        baseCurrency: from,
        targetCurrency: to,
        lastUpdate: cachedData.lastUpdate,
        cached: true,
        expired: true
      });
    }

    console.error('汇率API错误:', error);
    return Response.json({
      success: false,
      error: error.message || '无法获取汇率数据'
    }, { status: 500 });
  }
}

// 获取所有支持的货币列表
export async function POST() {
  const currencies = [
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

  return NextResponse.json({
    success: true,
    currencies,
    totalCount: currencies.length
  })
}