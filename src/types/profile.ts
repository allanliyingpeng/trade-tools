// 用户设置类型定义
export interface UserSettings {
  id: string
  user_id: string
  display_name: string | null
  company_name: string | null
  avatar_url: string | null
  language: string
  timezone: string
  currency: string
  default_source_lang: string
  favorite_currencies: string[]
  email_notifications: boolean
  created_at: string
  updated_at: string
}

// 使用统计类型定义
export interface UsageStats {
  id: string
  user_id: string
  translation_count: number
  exchange_rate_queries: number
  quotation_calculations: number
  glossary_searches: number
  timezone_conversions: number
  total_sessions: number
  last_active_at: string | null
  created_at: string
  updated_at: string
}

// 个人中心相关的表单类型
export interface ProfileFormData {
  display_name: string
  company_name: string
  language: string
  timezone: string
  currency: string
  default_source_lang: string
  favorite_currencies: string[]
  email_notifications: boolean
}

// 统计数据显示类型
export interface StatsDisplayItem {
  label: string
  value: number
  icon: React.ComponentType<any>
  color: string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
}

// 语言选项
export const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '中文简体' },
  { value: 'zh-TW', label: '中文繁体' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
] as const

// 时区选项
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
  { value: 'Asia/Hong_Kong', label: '香港时间 (UTC+8)' },
  { value: 'Asia/Taipei', label: '台北时间 (UTC+8)' },
  { value: 'Asia/Tokyo', label: '东京时间 (UTC+9)' },
  { value: 'Asia/Seoul', label: '首尔时间 (UTC+9)' },
  { value: 'America/New_York', label: '纽约时间 (UTC-5)' },
  { value: 'America/Los_Angeles', label: '洛杉矶时间 (UTC-8)' },
  { value: 'Europe/London', label: '伦敦时间 (UTC+0)' },
  { value: 'Europe/Paris', label: '巴黎时间 (UTC+1)' },
  { value: 'UTC', label: '协调世界时 (UTC+0)' },
] as const

// 货币选项
export const CURRENCY_OPTIONS = [
  { value: 'CNY', label: '人民币 (¥)' },
  { value: 'USD', label: '美元 ($)' },
  { value: 'EUR', label: '欧元 (€)' },
  { value: 'JPY', label: '日元 (¥)' },
  { value: 'KRW', label: '韩元 (₩)' },
  { value: 'GBP', label: '英镑 (£)' },
  { value: 'HKD', label: '港币 (HK$)' },
  { value: 'TWD', label: '新台币 (NT$)' },
  { value: 'SGD', label: '新加坡元 (S$)' },
  { value: 'CAD', label: '加拿大元 (C$)' },
  { value: 'AUD', label: '澳元 (A$)' },
  { value: 'CHF', label: '瑞士法郎 (CHF)' },
] as const