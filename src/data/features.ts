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
}

export const features: Feature[] = [
  {
    id: 'translator',
    title: '智能翻译',
    description: '基于腾讯TMT的专业外贸翻译，支持批量翻译和历史记录',
    icon: Languages,
    href: '/translator',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'exchange',
    title: '实时汇率',
    description: '接入ECB央行数据，支持150+货币实时转换',
    icon: TrendingUp,
    href: '/exchange-rates',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'quotation',
    title: '报价计算器',
    description: '智能计算FOB/CIF/EXW价格，一键生成专业报价单',
    icon: Calculator,
    href: '/quotation',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'glossary',
    title: '术语速查',
    description: '收录Incoterms 2020等500+专业术语，支持中英对照',
    icon: BookOpen,
    href: '/glossary',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'timezone',
    title: '时区转换',
    description: '全球时钟和会议规划器，跨时区协作更轻松',
    icon: Globe,
    href: '/timezone',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500'
  }
]