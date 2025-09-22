export interface SimpleTradeTerm {
  id: number
  code: string
  chinese: string
  english: string
  category: 'E' | 'F' | 'C' | 'D'
  description?: string
}

export const TRADE_TERMS: SimpleTradeTerm[] = [
  // E组 - 出发
  { id: 1, code: "EXW", chinese: "工厂交货", english: "Ex Works", category: "E", description: "卖方在指定地点交货，买方承担所有费用和风险" },

  // F组 - 主要运费未付
  { id: 2, code: "FCA", chinese: "货交承运人", english: "Free Carrier", category: "F", description: "卖方将货物交给承运人，主要运费由买方承担" },
  { id: 8, code: "FAS", chinese: "装运港船边交货", english: "Free Alongside Ship", category: "F", description: "卖方在指定装运港将货物交到船边" },
  { id: 9, code: "FOB", chinese: "装运港船上交货", english: "Free on Board", category: "F", description: "卖方在指定装运港将货物装上船" },

  // C组 - 主要运费已付
  { id: 3, code: "CPT", chinese: "运费付至", english: "Carriage Paid To", category: "C", description: "卖方支付货物运至指定目的地的运费" },
  { id: 4, code: "CIP", chinese: "运费保险费付至", english: "Carriage and Insurance Paid To", category: "C", description: "卖方支付运费和保险费至指定目的地" },
  { id: 10, code: "CFR", chinese: "成本加运费", english: "Cost and Freight", category: "C", description: "卖方支付货物运至指定目的港的费用和运费" },
  { id: 11, code: "CIF", chinese: "成本保险费加运费", english: "Cost, Insurance and Freight", category: "C", description: "卖方支付成本、保险费和运费至指定目的港" },

  // D组 - 到达
  { id: 5, code: "DPU", chinese: "卸货地交货", english: "Delivered at Place Unloaded", category: "D", description: "卖方在指定目的地卸货后交货" },
  { id: 6, code: "DAP", chinese: "目的地交货", english: "Delivered at Place", category: "D", description: "卖方在指定目的地交货，不负责卸货" },
  { id: 7, code: "DDP", chinese: "完税后交货", english: "Delivered Duty Paid", category: "D", description: "卖方在指定目的地完成进口清关后交货" },

  // 其他常用术语
  { id: 12, code: "L/C", chinese: "信用证", english: "Letter of Credit", category: "F", description: "银行开出的有条件付款承诺" },
  { id: 13, code: "T/T", chinese: "电汇", english: "Telegraphic Transfer", category: "F", description: "银行间电子汇款方式" },
  { id: 14, code: "D/P", chinese: "付款交单", english: "Documents against Payment", category: "F", description: "买方付款后获得货运单据" },
  { id: 15, code: "D/A", chinese: "承兑交单", english: "Documents against Acceptance", category: "F", description: "买方承兑汇票后获得货运单据" },
  { id: 16, code: "B/L", chinese: "提单", english: "Bill of Lading", category: "F", description: "货物运输和交付的法律凭证" },
  { id: 17, code: "AWB", chinese: "空运单", english: "Air Waybill", category: "F", description: "航空货物运输单据" },
  { id: 18, code: "C/O", chinese: "原产地证", english: "Certificate of Origin", category: "F", description: "证明货物原产地的官方文件" },
  { id: 19, code: "COD", chinese: "货到付款", english: "Cash on Delivery", category: "F", description: "货物送达时现金付款的交易方式" },
  { id: 20, code: "FCL", chinese: "整箱", english: "Full Container Load", category: "F", description: "整个集装箱装载" },
  { id: 21, code: "LCL", chinese: "拼箱", english: "Less than Container Load", category: "F", description: "不足整箱的拼装货物" },
  { id: 22, code: "TEU", chinese: "标准箱", english: "Twenty-foot Equivalent Unit", category: "F", description: "20英尺标准集装箱单位" },
  { id: 23, code: "FEU", chinese: "40尺箱", english: "Forty-foot Equivalent Unit", category: "F", description: "40英尺集装箱单位" },
  { id: 24, code: "ETD", chinese: "预计离港", english: "Estimated Time of Departure", category: "F", description: "预计离港时间" },
  { id: 25, code: "ETA", chinese: "预计到港", english: "Estimated Time of Arrival", category: "F", description: "预计到达时间" },
]

export const QUICK_TAGS = ["FOB", "CIF", "EXW", "CPT", "FCA", "DDP", "DAP"]

export function searchTerms(query: string): SimpleTradeTerm[] {
  if (!query.trim()) return TRADE_TERMS

  const normalizedQuery = query.toLowerCase().trim()

  return TRADE_TERMS.filter(term =>
    term.code.toLowerCase().includes(normalizedQuery) ||
    term.chinese.includes(normalizedQuery) ||
    term.english.toLowerCase().includes(normalizedQuery)
  )
}

export function filterByCategory(category: string): SimpleTradeTerm[] {
  if (category === 'all') return TRADE_TERMS
  return TRADE_TERMS.filter(term => term.category === category)
}