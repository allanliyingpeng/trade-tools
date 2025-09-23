import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

// 语言代码映射和语言名称
const LANGUAGE_MAP: Record<string, { code: string; name: string; nativeName: string }> = {
  'zh': { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  'en': { code: 'en', name: 'English', nativeName: 'English' },
  'de': { code: 'de', name: 'German', nativeName: 'Deutsch' },
  'fr': { code: 'fr', name: 'French', nativeName: 'Français' },
  'es': { code: 'es', name: 'Spanish', nativeName: 'Español' },
  'ja': { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  'ru': { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  'ar': { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  'ko': { code: 'ko', name: 'Korean', nativeName: '한국어' },
  'pt': { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
}

// 初始化Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// 缓存最近的翻译结果以提高响应速度
const translationCache = new Map<string, { result: string; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

// 简单的备用翻译服务（基于基础词典）
const fallbackTranslate = (text: string, from: string, to: string): string => {
  // 基础词典映射
  const basicDict: Record<string, Record<string, string>> = {
    'zh-en': {
      '你好': 'Hello',
      '谢谢': 'Thank you',
      '再见': 'Goodbye',
      '是': 'Yes',
      '不': 'No',
      '价格': 'Price',
      '质量': 'Quality',
      '订单': 'Order',
      '交货': 'Delivery',
      '付款': 'Payment',
      '合同': 'Contract',
      '产品': 'Product',
      '服务': 'Service'
    },
    'en-zh': {
      'hello': '你好',
      'thank you': '谢谢',
      'goodbye': '再见',
      'yes': '是',
      'no': '不',
      'price': '价格',
      'quality': '质量',
      'order': '订单',
      'delivery': '交货',
      'payment': '付款',
      'contract': '合同',
      'product': '产品',
      'service': '服务'
    }
  }

  const dictKey = `${from}-${to}`
  const dict = basicDict[dictKey]

  if (!dict) {
    return `[翻译服务暂时不可用] ${text}`
  }

  // 查找完全匹配
  const lowerText = text.toLowerCase().trim()
  if (dict[lowerText]) {
    return dict[lowerText]
  }

  // 查找部分匹配
  for (const [key, value] of Object.entries(dict)) {
    if (lowerText.includes(key)) {
      return text.replace(new RegExp(key, 'gi'), value)
    }
  }

  return `[需要人工翻译] ${text}`
}

// 使用Gemini AI进行翻译
const translateWithGemini = async (text: string, from: string, to: string): Promise<string> => {
  // 生成缓存键
  const cacheKey = `${from}-${to}-${text.substring(0, 100)}`
  const cached = translationCache.get(cacheKey)

  // 检查缓存
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Translation cache hit')
    return cached.result
  }

  const maxRetries = 3 // 增加重试次数
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 检查API密钥
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
      }

      // 获取语言的完整名称
      const sourceLanguage = LANGUAGE_MAP[from]?.nativeName || from
      const targetLanguage = LANGUAGE_MAP[to]?.nativeName || to

      // 使用Gemini 1.5 Flash模型（优化配置）
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1, // 降低随机性提高稳定性
          maxOutputTokens: 2000, // 增加输出长度限制
          topP: 0.8,
          topK: 40,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE'
          }
        ]
      })

      // 构建简洁高效的翻译提示词
      const prompt = `Translate from ${sourceLanguage} to ${targetLanguage}:

"${text}"

Return only the translation, no explanations.`

      // 设置请求超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Translation timeout')), 15000) // 15秒超时
      })

      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ])

      const response = await result.response
      const translatedText = response.text().trim()

      // 清理可能的引号或多余格式
      const cleanedText = translatedText.replace(/^["']|["']$/g, '')

      // 存储到缓存
      translationCache.set(cacheKey, {
        result: cleanedText,
        timestamp: Date.now()
      })

      // 清理过期缓存
      if (translationCache.size > 100) {
        const now = Date.now()
        for (const [key, value] of translationCache.entries()) {
          if (now - value.timestamp > CACHE_DURATION) {
            translationCache.delete(key)
          }
        }
      }

      return cleanedText

    } catch (error) {
      console.error(`Gemini translation error (attempt ${attempt}):`, error)
      lastError = error as Error

      // 检查错误类型
      if (error && typeof error === 'object' && 'status' in error) {
        const statusError = error as { status: number }

        if (statusError.status === 503) {
          console.log(`Model overloaded, attempt ${attempt}/${maxRetries}`)
          if (attempt < maxRetries) {
            // 指数退避策略
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000) // 最多8秒
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        } else if (statusError.status === 429) {
          console.log(`Rate limited, attempt ${attempt}/${maxRetries}`)
          if (attempt < maxRetries) {
            // 限流时等待更长时间
            await new Promise(resolve => setTimeout(resolve, 5000 * attempt))
            continue
          }
          throw new Error('API quota exceeded')
        } else if (statusError.status === 400) {
          throw new Error('Invalid request parameters')
        }
      }

      // 如果是超时错误，直接重试
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log(`Request timeout, attempt ${attempt}/${maxRetries}`)
        if (attempt < maxRetries) {
          continue
        }
      }

      // 如果是最后一次尝试或非重试错误，抛出错误
      if (attempt === maxRetries) {
        break
      }
    }
  }

  // 所有重试都失败了
  if (lastError) {
    if (lastError.message.includes('overloaded')) {
      throw new Error('Translation service is temporarily overloaded, please try again later')
    } else if (lastError.message.includes('timeout')) {
      throw new Error('Translation request timeout, please try again')
    } else if (lastError.message.includes('quota')) {
      throw new Error('API quota exceeded, please try again later')
    }
  }

  throw new Error('Translation service temporarily unavailable')
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json()
    const { text, from, to } = body

    console.log('Translation request:', { text: text?.substring(0, 50) + '...', from, to })

    // 验证输入
    if (!text || !from || !to) {
      console.log('Missing parameters:', { hasText: !!text, hasFrom: !!from, hasTo: !!to })
      return NextResponse.json(
        { error: '缺少必要参数：text, from, to' },
        { status: 400 }
      )
    }

    // 检查文本是否只是空白字符
    if (!text.trim()) {
      console.log('Empty text after trim')
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      console.log('Text too long:', text.length)
      return NextResponse.json(
        { error: '文本长度不能超过5000字符' },
        { status: 400 }
      )
    }

    if (from === to) {
      console.log('Same language:', { from, to })
      return NextResponse.json(
        { error: '源语言和目标语言不能相同' },
        { status: 400 }
      )
    }

    // 检查语言代码是否支持
    const sourceLanguage = LANGUAGE_MAP[from]
    const targetLanguage = LANGUAGE_MAP[to]

    if (!sourceLanguage || !targetLanguage) {
      console.log('Unsupported language:', { from, to, supportedLangs: Object.keys(LANGUAGE_MAP) })
      return NextResponse.json(
        { error: `不支持的语言代码。支持的语言: ${Object.keys(LANGUAGE_MAP).join(', ')}` },
        { status: 400 }
      )
    }

    try {
      // 调用Gemini翻译服务
      console.log('Calling Gemini translation...')
      let translatedText: string
      let translationMethod = 'Gemini AI'

      try {
        translatedText = await translateWithGemini(text.trim(), from, to)
        console.log('Gemini translation successful:', { originalLength: text.length, translatedLength: translatedText.length })
      } catch (geminiError) {
        console.warn('Gemini translation failed, using fallback:', geminiError)
        translatedText = fallbackTranslate(text.trim(), from, to)
        translationMethod = 'Fallback Dictionary'
      }

      const response: TranslateResponse = {
        translatedText,
        sourceLanguage: from,
        targetLanguage: to
      }

      // 添加翻译方法信息到响应头
      const jsonResponse = NextResponse.json(response)
      jsonResponse.headers.set('X-Translation-Method', translationMethod)
      return jsonResponse

    } catch (translationError) {
      console.error('Translation service error:', translationError)

      // 更详细的错误信息
      let errorMessage = '翻译服务暂时不可用，请稍后重试'
      let statusCode = 503

      if (translationError instanceof Error) {
        if (translationError.message.includes('API key')) {
          errorMessage = 'API配置错误'
          statusCode = 500
        } else if (translationError.message.includes('quota') || translationError.message.includes('exceeded')) {
          errorMessage = 'API配额已用完，请稍后重试'
          statusCode = 429
        } else if (translationError.message.includes('timeout')) {
          errorMessage = '翻译请求超时，请重试'
          statusCode = 504
        } else if (translationError.message.includes('overloaded')) {
          errorMessage = '翻译服务繁忙，请稍后重试'
          statusCode = 503
        } else if (translationError.message.includes('Invalid request')) {
          errorMessage = '请求参数错误'
          statusCode = 400
        } else if (translationError.message.includes('需要人工翻译')) {
          errorMessage = '该文本需要人工翻译，建议使用专业翻译服务'
          statusCode = 202
        }
      }

      return NextResponse.json(
        { error: errorMessage, details: translationError instanceof Error ? translationError.message : 'Unknown error' },
        { status: statusCode }
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
    languageMap: LANGUAGE_MAP,
    model: 'Gemini 1.5 Flash',
    features: {
      cache: true,
      fallback: true,
      timeout: '15s',
      maxRetries: 3
    }
  })
}