"use client"

import { useState, useEffect } from 'react'
import { ProfileService } from '@/lib/supabase/profile'
import { UserSettings, UsageStats } from '@/types/profile'
import { useAuth } from '@/components/providers/auth-provider'

export function useProfile() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // 并行加载用户设置和使用统计
      const [settingsResult, statsResult] = await Promise.all([
        ProfileService.getUserSettings(user.id),
        ProfileService.getUsageStats(user.id)
      ])

      // 处理用户设置
      if (settingsResult.error) {
        if (settingsResult.error.code === 'PGRST116') {
          // 如果没有设置记录，创建默认设置
          const { data: newSettings, error: createError } = await ProfileService.createUserSettings(user.id)
          if (createError) {
            setError('创建用户设置失败')
          } else {
            setUserSettings(newSettings)
          }
        } else {
          setError('加载用户设置失败')
        }
      } else {
        setUserSettings(settingsResult.data)
      }

      // 处理使用统计
      if (statsResult.error) {
        if (statsResult.error.code === 'PGRST116') {
          // 如果没有统计记录，创建默认统计
          const { data: newStats, error: createError } = await ProfileService.createUsageStats(user.id)
          if (createError) {
            setError('创建使用统计失败')
          } else {
            setUsageStats(newStats)
          }
        } else {
          setError('加载使用统计失败')
        }
      } else {
        setUsageStats(statsResult.data)
      }
    } catch (err) {
      setError('加载个人资料失败')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return { success: false, error: '用户未登录' }

    try {
      // 转换为 ProfileFormData 格式
      const formData = {
        display_name: updates.display_name || '',
        language: updates.language || 'zh-CN',
        timezone: updates.timezone || 'Asia/Shanghai',
        currency: updates.currency || 'CNY',
        favorite_currencies: updates.favorite_currencies || ['USD', 'EUR', 'CNY'],
        email_notifications: updates.email_notifications ?? true,
      }

      const { data, error } = await ProfileService.updateUserSettings(user.id, formData)

      if (error) {
        return { success: false, error: '更新设置失败' }
      }

      if (data) {
        setUserSettings(data)
        return { success: true, data }
      }

      return { success: false, error: '更新失败' }
    } catch (err) {
      return { success: false, error: '更新设置失败' }
    }
  }

  const incrementUsageCount = async (
    feature: 'translation' | 'exchange_rate' | 'quotation' | 'glossary' | 'timezone'
  ) => {
    if (!user) return

    try {
      const { data } = await ProfileService.incrementUsageCount(user.id, feature)
      if (data) {
        setUsageStats(data)
      }
    } catch (err) {
      // 静默处理错误，不影响用户体验
      console.error('Failed to increment usage count:', err)
    }
  }

  const incrementSessionCount = async () => {
    if (!user) return

    try {
      const { data } = await ProfileService.incrementSessionCount(user.id)
      if (data) {
        setUsageStats(data)
      }
    } catch (err) {
      // 静默处理错误，不影响用户体验
      console.error('Failed to increment session count:', err)
    }
  }

  return {
    userSettings,
    usageStats,
    isLoading,
    error,
    updateSettings,
    incrementUsageCount,
    incrementSessionCount,
    reload: loadProfile,
  }
}