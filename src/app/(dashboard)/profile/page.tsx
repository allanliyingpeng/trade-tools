"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettingsForm } from "@/components/features/profile/profile-settings-form"
import { UsageStatsDisplay } from "@/components/features/profile/usage-stats"
import { useAuth } from "@/components/providers/auth-provider"
import { UserSettings } from "@/types/profile"
import { User, BarChart3, Shield, Bell } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const { user, loading } = useAuth()

  const handleSettingsUpdate = (settings: UserSettings) => {
    setUserSettings(settings)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full py-16 md:py-20 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">个人中心</h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground">管理您的个人信息和账户设置</p>
            </div>
          </div>
        </div>
        <div className="w-full py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full py-16 md:py-20 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">个人中心</h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground">请先登录以访问个人中心</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="w-full py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">个人中心</h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground">
              欢迎回来，{userSettings?.display_name || user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">个人信息</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">使用统计</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">安全设置</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">通知设置</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettingsForm onSettingsUpdate={handleSettingsUpdate} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <UsageStatsDisplay />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">安全设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">邮箱地址</h4>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  已验证
                </span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">密码</h4>
                  <p className="text-sm text-muted-foreground">上次更新时间未知</p>
                </div>
                <button className="text-sm text-primary hover:underline">
                  修改密码
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">两步验证</h4>
                  <p className="text-sm text-muted-foreground">为您的账户添加额外安全保护</p>
                </div>
                <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  未启用
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">通知设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">邮件通知</h4>
                  <p className="text-sm text-muted-foreground">接收重要更新和安全提醒</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={userSettings?.email_notifications}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">桌面通知</h4>
                  <p className="text-sm text-muted-foreground">在浏览器中显示通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">功能更新通知</h4>
                  <p className="text-sm text-muted-foreground">了解新功能和改进</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}