import { supabase } from './client'
import type { UserSettings, UsageStats, ProfileFormData } from '@/types/profile'

export class ProfileService {
  // 获取用户设置
  static async getUserSettings(userId: string): Promise<{ data: UserSettings | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 更新用户设置
  static async updateUserSettings(
    userId: string,
    settings: Partial<ProfileFormData>
  ): Promise<{ data: UserSettings | null; error: any }> {
    try {
      const updateData = {
        ...settings,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 创建用户设置（注册时使用）
  static async createUserSettings(
    userId: string,
    settings: Partial<ProfileFormData> = {}
  ): Promise<{ data: UserSettings | null; error: any }> {
    try {
      const defaultSettings = {
        user_id: userId,
        display_name: null,
        company_name: null,
        avatar_url: null,
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        currency: 'CNY',
        default_source_lang: 'zh-CN',
        favorite_currencies: ['USD', 'EUR', 'CNY'],
        email_notifications: true,
        ...settings,
      }

      const { data, error } = await supabase
        .from('user_settings')
        .insert(defaultSettings)
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 获取使用统计
  static async getUsageStats(userId: string): Promise<{ data: UsageStats | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('usage_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 创建使用统计记录（注册时使用）
  static async createUsageStats(userId: string): Promise<{ data: UsageStats | null; error: any }> {
    try {
      const defaultStats = {
        user_id: userId,
        translation_count: 0,
        exchange_rate_queries: 0,
        quotation_calculations: 0,
        glossary_searches: 0,
        timezone_conversions: 0,
        total_sessions: 0,
        last_active_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('usage_stats')
        .insert(defaultStats)
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 更新使用统计
  static async updateUsageStats(
    userId: string,
    updates: Partial<Omit<UsageStats, 'id' | 'user_id' | 'created_at'>>
  ): Promise<{ data: UsageStats | null; error: any }> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('usage_stats')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 增加特定功能的使用次数
  static async incrementUsageCount(
    userId: string,
    feature: 'translation' | 'exchange_rate' | 'quotation' | 'glossary' | 'timezone'
  ): Promise<{ data: UsageStats | null; error: any }> {
    try {
      // 首先获取当前统计数据
      const { data: currentStats, error: fetchError } = await this.getUsageStats(userId)

      if (fetchError || !currentStats) {
        return { data: null, error: fetchError || 'Stats not found' }
      }

      // 构建更新数据
      const fieldMap = {
        translation: 'translation_count',
        exchange_rate: 'exchange_rate_queries',
        quotation: 'quotation_calculations',
        glossary: 'glossary_searches',
        timezone: 'timezone_conversions',
      }

      const fieldName = fieldMap[feature]
      const updateData = {
        [fieldName]: currentStats[fieldName as keyof UsageStats] as number + 1,
        last_active_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('usage_stats')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 增加会话数
  static async incrementSessionCount(userId: string): Promise<{ data: UsageStats | null; error: any }> {
    try {
      const { data: currentStats, error: fetchError } = await this.getUsageStats(userId)

      if (fetchError || !currentStats) {
        return { data: null, error: fetchError || 'Stats not found' }
      }

      const updateData = {
        total_sessions: currentStats.total_sessions + 1,
        last_active_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('usage_stats')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 上传头像
  static async uploadAvatar(userId: string, file: File): Promise<{ data: string | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        return { data: null, error: uploadError }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // 更新用户设置中的头像URL
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        return { data: null, error: updateError }
      }

      return { data: publicUrl, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // 删除头像
  static async removeAvatar(userId: string): Promise<{ data: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      return { data: !error, error }
    } catch (err) {
      return { data: false, error: err }
    }
  }
}