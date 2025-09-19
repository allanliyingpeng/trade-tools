"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileService } from "@/lib/supabase/profile"
import { useAuth } from "@/components/providers/auth-provider"
import { UsageStats, StatsDisplayItem } from "@/types/profile"
import {
  Languages,
  TrendingUp,
  Calculator,
  BookOpen,
  Globe,
  Users,
  Activity,
  Loader2
} from "lucide-react"

export function UsageStatsDisplay() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [error, setError] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadUsageStats()
    }
  }, [user])

  const loadUsageStats = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await ProfileService.getUsageStats(user.id)

      if (error) {
        // 如果没有统计记录，创建默认统计
        if (error.code === 'PGRST116') {
          const { data: newStats, error: createError } = await ProfileService.createUsageStats(user.id)
          if (createError) {
            setError('创建使用统计失败')
            return
          }
          setStats(newStats)
        } else {
          setError('加载使用统计失败')
        }
      } else {
        setStats(data)
      }
    } catch (err) {
      setError('加载使用统计失败')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatsItems = (stats: UsageStats): StatsDisplayItem[] => {
    return [
      {
        label: '智能翻译',
        value: stats.translation_count,
        icon: Languages,
        color: 'text-blue-600',
      },
      {
        label: '汇率查询',
        value: stats.exchange_rate_queries,
        icon: TrendingUp,
        color: 'text-green-600',
      },
      {
        label: '报价计算',
        value: stats.quotation_calculations,
        icon: Calculator,
        color: 'text-purple-600',
      },
      {
        label: '术语搜索',
        value: stats.glossary_searches,
        icon: BookOpen,
        color: 'text-orange-600',
      },
      {
        label: '时区转换',
        value: stats.timezone_conversions,
        icon: Globe,
        color: 'text-indigo-600',
      },
      {
        label: '总会话数',
        value: stats.total_sessions,
        icon: Users,
        color: 'text-pink-600',
      },
    ]
  }

  const formatLastActive = (lastActiveAt: string | null) => {
    if (!lastActiveAt) return '从未使用'

    const date = new Date(lastActiveAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} 天前`
    } else if (diffHours > 0) {
      return `${diffHours} 小时前`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} 分钟前`
    } else {
      return '刚刚'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>使用统计</CardTitle>
          <CardDescription>查看您的功能使用情况</CardDescription>
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>使用统计</CardTitle>
          <CardDescription>查看您的功能使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const statsItems = getStatsItems(stats)
  const totalUsage = statsItems.reduce((sum, item) => sum + item.value, 0) - stats.total_sessions

  return (
    <div className="space-y-6">
      {/* 总览卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            使用概览
          </CardTitle>
          <CardDescription>您的平台使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalUsage}</div>
              <div className="text-sm text-muted-foreground">总使用次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total_sessions}</div>
              <div className="text-sm text-muted-foreground">总会话数</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">上次活跃</div>
              <div className="text-sm">{formatLastActive(stats.last_active_at)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 功能使用统计 */}
      <Card>
        <CardHeader>
          <CardTitle>功能使用统计</CardTitle>
          <CardDescription>各项功能的详细使用数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 使用趋势说明 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>统计数据会实时更新，帮助您了解使用习惯</p>
            <p className="mt-1">数据创建时间：{new Date(stats.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}