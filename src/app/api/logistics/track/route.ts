import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 快递100 API配置
const API_BASE_URL = 'https://poll.kuaidi100.com/poll/query.do';
const AUTO_DETECT_URL = 'https://www.kuaidi100.com/autonumber/autoComNum';

// 支持的快递公司映射
const CARRIER_MAP: Record<string, string> = {
  'sf': 'shunfeng',
  'ems': 'ems',
  'yuantong': 'yuantong',
  'shentong': 'shentong',
  'zhongtong': 'zhongtong',
  'yunda': 'yunda',
  'dhl': 'dhl',
  'fedex': 'fedex',
  'ups': 'ups',
  'tnt': 'tnt',
  'jd': 'jd',
  'zto': 'zhongtong',
  'sto': 'shentong',
  'yt': 'yuantong',
  'yd': 'yunda'
};

// 快递公司中文名称映射
const CARRIER_NAMES: Record<string, string> = {
  'shunfeng': '顺丰速运',
  'ems': 'EMS',
  'yuantong': '圆通速递',
  'shentong': '申通快递',
  'zhongtong': '中通快递',
  'yunda': '韵达速递',
  'dhl': 'DHL',
  'fedex': 'FedEx',
  'ups': 'UPS',
  'tnt': 'TNT',
  'jd': '京东物流'
};

// 生成签名
function generateSign(params: string, key: string, customer: string): string {
  const signStr = params + key + customer;
  return crypto.createHash('md5').update(signStr, 'utf8').digest('hex').toUpperCase();
}

// 自动检测快递公司
async function autoDetectCarrier(trackingNumber: string): Promise<string | null> {
  try {
    const response = await fetch(`${AUTO_DETECT_URL}?text=${encodeURIComponent(trackingNumber)}`);
    const data = await response.json();

    if (data && data.length > 0 && data[0].comCode) {
      return data[0].comCode;
    }
  } catch (error) {
    console.error('自动识别快递公司失败:', error);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { trackingNumber, carrier } = await request.json();

    if (!trackingNumber?.trim()) {
      return NextResponse.json({
        success: false,
        error: '请提供运单号'
      }, { status: 400 });
    }

    // 获取环境变量
    const apiKey = process.env.LOGISTICS_API_KEY;
    const customer = process.env.LOGISTICS_CUSTOMER_ID;

    if (!apiKey || !customer) {
      return NextResponse.json({
        success: false,
        error: '服务配置错误，请联系管理员'
      }, { status: 500 });
    }

    let finalCarrier = carrier;

    // 如果是自动识别，先检测快递公司
    if (carrier === 'auto' || !carrier) {
      const detectedCarrier = await autoDetectCarrier(trackingNumber);
      if (detectedCarrier) {
        finalCarrier = detectedCarrier;
      } else {
        return NextResponse.json({
          success: false,
          error: '无法识别快递公司，请手动选择'
        }, { status: 400 });
      }
    }

    // 映射快递公司代码
    const carrierCode = CARRIER_MAP[finalCarrier] || finalCarrier;

    // 构建查询参数
    const params = JSON.stringify({
      com: carrierCode,
      num: trackingNumber,
      phone: '', // 手机号后四位，可选
      from: '',  // 出发地，可选
      to: '',    // 目的地，可选
      resultv2: '1', // 返回详细信息
      show: '0', // 返回类型
      order: 'desc' // 排序方式
    });

    // 生成签名
    const sign = generateSign(params, apiKey, customer);

    // 构建请求数据
    const formData = new URLSearchParams();
    formData.append('customer', customer);
    formData.append('sign', sign);
    formData.append('param', params);

    console.log('物流查询请求:', {
      carrier: carrierCode,
      trackingNumber: trackingNumber.substring(0, 4) + '***',
      customer: customer.substring(0, 8) + '***'
    });

    // 调用快递100 API
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'TradingTools/1.0'
      },
      body: formData.toString()
    });

    const result = await response.json();

    console.log('物流查询响应:', {
      status: response.status,
      success: !!result.message,
      state: result.state
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    // 检查返回结果
    if (result.message !== 'ok') {
      return NextResponse.json({
        success: false,
        error: result.message || '查询失败',
        code: result.returnCode || 'UNKNOWN_ERROR'
      }, { status: 400 });
    }

    // 处理物流状态
    const stateMapping: Record<string, { text: string; color: string }> = {
      '0': { text: '在途中', color: 'blue' },
      '1': { text: '已揽收', color: 'green' },
      '2': { text: '疑难件', color: 'red' },
      '3': { text: '已签收', color: 'green' },
      '4': { text: '退签', color: 'orange' },
      '5': { text: '派送中', color: 'blue' },
      '6': { text: '退回', color: 'red' }
    };

    const currentState = stateMapping[result.state] || { text: '未知状态', color: 'gray' };

    // 格式化追踪信息
    const trackingInfo = {
      trackingNumber,
      carrier: carrierCode,
      carrierName: CARRIER_NAMES[carrierCode] || carrierCode.toUpperCase(),
      status: currentState.text,
      statusColor: currentState.color,
      state: result.state,
      ischeck: result.ischeck === '1', // 是否已签收
      com: result.com,
      nu: result.nu,
      condition: result.condition, // 快件状态
      data: result.data?.map((item: any) => ({
        time: item.ftime,
        location: item.areaName || '未知',
        status: item.context,
        areaCode: item.areaCode,
        areaName: item.areaName,
        statusCode: item.status
      })) || []
    };

    return NextResponse.json({
      success: true,
      data: trackingInfo,
      message: '查询成功'
    });

  } catch (error: any) {
    console.error('物流查询失败:', error);

    return NextResponse.json({
      success: false,
      error: error.message || '查询失败，请稍后重试'
    }, { status: 500 });
  }
}

// 获取支持的快递公司列表
export async function GET() {
  const carriers = Object.entries(CARRIER_NAMES).map(([code, name]) => ({
    code,
    name,
    supported: true
  }));

  return NextResponse.json({
    success: true,
    data: {
      carriers,
      autoDetect: true
    },
    message: '获取快递公司列表成功'
  });
}