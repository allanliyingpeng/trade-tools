"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarUpload } from "./avatar-upload"
import { ProfileService } from "@/lib/supabase/profile"
import { useAuth } from "@/components/providers/auth-provider"
import {
  ProfileFormData,
  UserSettings,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  CURRENCY_OPTIONS
} from "@/types/profile"
import { Save, Loader2 } from "lucide-react"

interface ProfileSettingsFormProps {
  onSettingsUpdate?: (settings: UserSettings) => void
}

export function ProfileSettingsForm({ onSettingsUpdate }: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: '',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
    favorite_currencies: ['USD', 'EUR', 'CNY'],
    email_notifications: true,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await ProfileService.getUserSettings(user.id)

      if (error) {
        // 如果没有设置记录，创建默认设置
        if (error.code === 'PGRST116') {
          const { data: newSettings, error: createError } = await ProfileService.createUserSettings(user.id)
          if (createError) {
            setError('创建用户设置失败')
            return
          }
          if (newSettings) {
            setSettings(newSettings)
            setFormData({
              display_name: newSettings.display_name || '',
              language: newSettings.language,
              timezone: newSettings.timezone,
              currency: newSettings.currency,
              favorite_currencies: newSettings.favorite_currencies,
              email_notifications: newSettings.email_notifications,
            })
          }
        } else {
          setError('加载用户设置失败')
        }
      } else if (data) {
        setSettings(data)
        setFormData({
          display_name: data.display_name || '',
          language: data.language,
          timezone: data.timezone,
          currency: data.currency,
          favorite_currencies: data.favorite_currencies,
          email_notifications: data.email_notifications,
        })
      }
    } catch (err) {
      setError('加载用户设置失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await ProfileService.updateUserSettings(user.id, formData)

      if (error) {
        setError('保存设置失败，请重试')
      } else if (data) {
        setSettings(data)
        setSuccess('设置保存成功')
        onSettingsUpdate?.(data)

        // 3秒后清除成功消息
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError('保存设置失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAvatarUpdate = (url: string | null) => {
    if (settings) {
      setSettings({
        ...settings,
        avatar_url: url
      })
    }
  }

  const handleFavoriteCurrenciesChange = (value: string) => {
    const currencies = value.split(',').map(c => c.trim()).filter(c => c.length > 0)
    handleInputChange('favorite_currencies', currencies)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>个人设置</CardTitle>
          <CardDescription>管理您的个人信息和偏好设置</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">加载中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>个人设置</CardTitle>
        <CardDescription>管理您的个人信息和偏好设置</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 头像设置 */}
          <div className="flex flex-col items-center">
            <AvatarUpload
              avatarUrl={settings?.avatar_url}
              displayName={formData.display_name || user?.email}
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>

          {/* 显示名称 */}
          <div className="space-y-2">
            <Label htmlFor="display_name">显示名称</Label>
            <Input
              id="display_name"
              type="text"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="请输入显示名称"
            />
          </div>

          {/* 语言设置 */}
          <div className="space-y-2">
            <Label htmlFor="language">语言</Label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {LANGUAGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 时区设置 */}
          <div className="space-y-2">
            <Label htmlFor="timezone">时区</Label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIMEZONE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 默认货币 */}
          <div className="space-y-2">
            <Label htmlFor="currency">默认货币</Label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {CURRENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 常用货币 */}
          <div className="space-y-2">
            <Label htmlFor="favorite_currencies">常用货币</Label>
            <Input
              id="favorite_currencies"
              type="text"
              value={formData.favorite_currencies.join(', ')}
              onChange={(e) => handleFavoriteCurrenciesChange(e.target.value)}
              placeholder="例如: USD, EUR, CNY"
            />
            <p className="text-xs text-muted-foreground">
              多个货币请用逗号分隔
            </p>
          </div>

          {/* 邮件通知 */}
          <div className="flex items-center space-x-2">
            <input
              id="email_notifications"
              type="checkbox"
              checked={formData.email_notifications}
              onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="email_notifications">接收邮件通知</Label>
          </div>

          {/* 错误和成功消息 */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}

          {/* 保存按钮 */}
          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}