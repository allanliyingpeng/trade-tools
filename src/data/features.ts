import {
  Languages,
  TrendingUp,
  Calculator,
  BookOpen,
  Globe,
  LucideIcon
} from "lucide-react"

export interface Feature {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  gradient: string
  workflowId?: string
  dialogType: 'translate' | 'currency' | 'quote' | 'term' | 'timezone'
  defaultInputs?: Record<string, any>
}

export const features: Feature[] = [
  {
    id: 'translator',
    title: '智能翻译',
    description: '基于AI的专业外贸翻译，支持批量翻译和历史记录，支持多国语言互译，快速准确',
    icon: Languages,
    href: '/translator',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    dialogType: 'translate',
    workflowId: 'trade-translator',
    defaultInputs: {
      source_lang: 'auto',
      target_lang: 'en',
      domain: 'trade'
    }
  },
  {
    id: 'exchange',
    title: '实时汇率',
    description: '智能汇率查询和计算，支持常用国家货币互转，参考国际汇率标准自动更新',
    icon: TrendingUp,
    href: '/exchange-rates',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    dialogType: 'currency',
    workflowId: 'currency-converter',
    defaultInputs: {
      from_currency: 'USD',
      to_currency: 'CNY',
      amount: 1
    }
  },
  {
    id: 'quotation',
    title: '报价计算器',
    description: '管理产品成本，国际费用，ROI投资分析，智能计算FOB/CIF/EXW价格，生成专业报价单',
    icon: Calculator,
    href: '/quotation',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    dialogType: 'quote',
    workflowId: 'quote-calculator',
    defaultInputs: {
      incoterm: 'FOB',
      currency: 'USD'
    }
  },
  {
    id: 'glossary',
    title: '术语速查',
    description: '收录Incoterms 常用专业术语，智能查询和解释，目前正在持续收录中，解决外贸人术语痛点',
    icon: BookOpen,
    href: '/glossary',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    dialogType: 'term',
    workflowId: 'term-lookup',
    defaultInputs: {
      category: 'all',
      language: 'zh-cn'
    }
  },
  {
    id: 'timezone',
    title: '时区转换',
    description: '全球时钟和会议规划器，跨时区协作更轻松',
    icon: Globe,
    href: '/timezone',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    dialogType: 'timezone',
    workflowId: 'timezone-converter',
    defaultInputs: {
      from_timezone: 'Asia/Shanghai',
      to_timezone: 'America/New_York'
    }
  }
]