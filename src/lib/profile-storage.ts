import type { UserSettings, ProfileFormData } from '@/types/profile'

// 临时的本地存储解决方案
export class LocalProfileStorage {
  private static STORAGE_KEY = 'trade_tools_profile'

  // 获取用户设置
  static getUserSettings(userId: string): UserSettings | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('获取本地设置失败:', error)
      return null
    }
  }

  // 保存用户设置
  static saveUserSettings(userId: string, formData: ProfileFormData): UserSettings {
    try {
      const settings: UserSettings = {
        id: `local_${userId}`,
        user_id: userId,
        display_name: formData.display_name || null,
        company_name: formData.company_name || null,
        avatar_url: null,
        language: formData.language,
        timezone: formData.timezone,
        currency: formData.currency,
        default_source_lang: formData.default_source_lang,
        favorite_currencies: formData.favorite_currencies,
        email_notifications: formData.email_notifications,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(settings))
      return settings
    } catch (error) {
      console.error('保存本地设置失败:', error)
      throw error
    }
  }

  // 创建默认设置
  static createDefaultSettings(userId: string): UserSettings {
    const defaultFormData: ProfileFormData = {
      display_name: '',
      company_name: '',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      currency: 'CNY',
      default_source_lang: 'zh-CN',
      favorite_currencies: ['USD', 'EUR', 'CNY'],
      email_notifications: true,
    }

    return this.saveUserSettings(userId, defaultFormData)
  }
}