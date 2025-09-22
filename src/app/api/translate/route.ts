import { NextRequest, NextResponse } from 'next/server'

interface TranslateRequest {
  text: string
  from: string
  to: string
}

interface TranslateResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
}

// 语言代码映射（Google Translate API 格式）
const LANGUAGE_MAP: Record<string, string> = {
  'zh': 'zh-CN',
  'en': 'en',
  'de': 'de',
  'fr': 'fr',
  'es': 'es',
  'ja': 'ja',
  'ru': 'ru',
  'ar': 'ar',
  'ko': 'ko',
  'pt': 'pt'
}

// 模拟翻译服务（实际应用中应该连接到真实的翻译 API）
const mockTranslate = async (text: string, from: string, to: string): Promise<string> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  // 模拟不同语言对的翻译结果
  const translations: Record<string, Record<string, string>> = {
    'zh-en': {
      '你好': 'Hello',
      '谢谢': 'Thank you',
      '再见': 'Goodbye',
      '工厂交货': 'Ex Works (EXW)',
      '货交承运人': 'Free Carrier (FCA)',
      '装运港船上交货': 'Free on Board (FOB)',
      '成本保险费加运费': 'Cost, Insurance and Freight (CIF)',
      '我们很高兴与您合作': 'We are pleased to cooperate with you',
      '请确认订单详情': 'Please confirm the order details',
      '货物将按时交付': 'The goods will be delivered on time',
      '质量保证期为一年': 'The quality guarantee period is one year',
      '付款条件为30天': 'Payment terms are 30 days',
      '我们提供最优惠的价格': 'We offer the most competitive prices',
      '产品符合国际标准': 'Products comply with international standards'
    },
    'en-zh': {
      'Hello': '你好',
      'Thank you': '谢谢',
      'Goodbye': '再见',
      'Ex Works': '工厂交货',
      'Free Carrier': '货交承运人',
      'Free on Board': '装运港船上交货',
      'Cost, Insurance and Freight': '成本保险费加运费',
      'We are pleased to cooperate with you': '我们很高兴与您合作',
      'Please confirm the order details': '请确认订单详情',
      'The goods will be delivered on time': '货物将按时交付',
      'Payment terms are 30 days': '付款条件为30天',
      'We offer competitive prices': '我们提供有竞争力的价格',
      'International quality standards': '国际质量标准'
    }
  }

  const langPair = `${from}-${to}`
  const translationMap = translations[langPair]

  if (translationMap) {
    // 查找精确匹配
    const exactMatch = translationMap[text]
    if (exactMatch) {
      return exactMatch
    }

    // 查找部分匹配
    for (const [key, value] of Object.entries(translationMap)) {
      if (text.includes(key)) {
        return text.replace(key, value)
      }
    }
  }

  // 如果没有预设翻译，返回带有语言标识的模拟翻译
  const languageNames: Record<string, string> = {
    'zh': '中文',
    'en': 'English',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español',
    'ja': '日本語',
    'ru': 'Русский',
    'ar': 'العربية',
    'ko': '한국어',
    'pt': 'Português'
  }

  return `[${languageNames[to] || to.toUpperCase()}] ${text}`
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json()
    const { text, from, to } = body

    // 验证输入
    if (!text || !from || !to) {
      return NextResponse.json(
        { error: '缺少必要参数：text, from, to' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: '文本长度不能超过5000字符' },
        { status: 400 }
      )
    }

    if (from === to) {
      return NextResponse.json(
        { error: '源语言和目标语言不能相同' },
        { status: 400 }
      )
    }

    // 检查语言代码是否支持
    const sourceLanguage = LANGUAGE_MAP[from]
    const targetLanguage = LANGUAGE_MAP[to]

    if (!sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: '不支持的语言代码' },
        { status: 400 }
      )
    }

    try {
      // 调用翻译服务
      const translatedText = await mockTranslate(text.trim(), from, to)

      const response: TranslateResponse = {
        translatedText,
        sourceLanguage: from,
        targetLanguage: to
      }

      return NextResponse.json(response)

    } catch (translationError) {
      console.error('Translation service error:', translationError)
      return NextResponse.json(
        { error: '翻译服务暂时不可用，请稍后重试' },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 处理 GET 请求（返回支持的语言列表）
export async function GET() {
  return NextResponse.json({
    supportedLanguages: Object.keys(LANGUAGE_MAP),
    languageMap: LANGUAGE_MAP
  })
}