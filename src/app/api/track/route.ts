import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { trackingNumber } = await request.json()

    if (!trackingNumber) {
      return NextResponse.json(
        { error: '请输入快递单号' },
        { status: 400 }
      )
    }

    // 从环境变量获取密钥
    const customer = process.env.KUAIDI100_CUSTOMER
    const key = process.env.KUAIDI100_KEY

    if (!customer || !key) {
      console.error('Missing KUAIDI100 credentials')
      return NextResponse.json(
        { error: '服务配置错误，请联系管理员' },
        { status: 500 }
      )
    }

    // 构建param对象
    const param = {
      com: 'auto',
      num: trackingNumber,
      resultv2: '4'
    }

    // 转换为JSON字符串
    const paramJSON = JSON.stringify(param)

    // 按照快递100要求的顺序生成签名: paramJSON + key + customer
    const signString = paramJSON + key + customer
    const sign = crypto.createHash('md5').update(signString).digest('hex').toUpperCase()

    console.log('Tracking request:', {
      trackingNumber,
      paramJSON,
      signString,
      sign
    })

    // 调用快递100 API
    const response = await fetch('https://poll.kuaidi100.com/poll/query.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        customer,
        sign,
        param: paramJSON
      })
    })

    const data = await response.json()
    console.log('Kuaidi100 response:', data)

    // 检查快递100的返回结果
    if (!response.ok) {
      return NextResponse.json(
        { error: '查询服务暂时不可用，请稍后重试' },
        { status: 500 }
      )
    }

    // 快递100返回的数据格式：
    // 成功: { message: "ok", nu: "单号", ischeck: "1", condition: "状态", com: "公司", status: "200", state: "状态码", data: [...] }
    // 失败: { message: "错误信息", status: "非200" }

    if (data.status !== '200') {
      return NextResponse.json({
        success: false,
        error: data.message || '未查询到物流信息，请检查单号是否正确'
      })
    }

    // 返回成功结果
    return NextResponse.json({
      success: true,
      data: {
        trackingNumber: data.nu,
        company: data.com,
        state: data.state,
        condition: data.condition,
        ischeck: data.ischeck,
        tracks: data.data || []
      }
    })

  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { error: '查询失败，请稍后重试' },
      { status: 500 }
    )
  }
}