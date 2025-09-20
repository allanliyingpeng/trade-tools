"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Crown, Wallet, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user } = useAuth()

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long'
    }).format(date)
  }

  // 模拟注册时间（实际项目中应该从用户数据获取）
  const joinDate = new Date('2024-03-01')

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="w-full flex items-center justify-center py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">个人中心</h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground">管理您的账户信息和套餐</p>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:gap-12 lg:grid-cols-3">

              {/* User Profile Card */}
              <div className="lg:col-span-2">
                <Card className="h-full bg-gradient-to-br from-background to-muted/20 border-2">
                  <CardHeader className="pb-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <User className="h-7 w-7 text-primary" />
                        </div>
                        个人资料
                      </CardTitle>
                      <Badge variant="outline" className="text-sm font-medium">
                        <Crown className="h-4 w-4 mr-2" />
                        免费版用户
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            {user?.email ? getInitials(user.email) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold">{user?.email || '用户@example.com'}</h3>
                          <p className="text-muted-foreground">外贸工具箱用户</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-muted-foreground">注册时间</p>
                              <p className="font-medium">{formatDate(joinDate)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Crown className="h-5 w-5 text-amber-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">会员等级</p>
                              <p className="font-medium">免费版</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/profile" className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              编辑个人信息
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Card */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5" />
                      今日数据
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">1,234</div>
                        <div className="text-sm text-muted-foreground">今日翻译字数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">56</div>
                        <div className="text-sm text-muted-foreground">功能使用次数</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                      <Wallet className="h-5 w-5" />
                      账户状态
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">良好</div>
                      <div className="text-sm text-green-600/80">服务正常运行</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="w-full py-12 md:py-16 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Crown className="h-5 w-5" />
                <span className="font-medium">套餐升级</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">选择适合您的套餐</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                升级到专业版，享受无限制的翻译服务和高级功能
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Free Plan */}
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">免费版</h3>
                    <Badge variant="secondary" className="font-medium">
                      当前套餐
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold">¥0</div>
                    <p className="text-muted-foreground">永久免费使用</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>每月1万字翻译额度</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>基础汇率查询</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>术语速查功能</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                      <span className="text-muted-foreground">高级报价计算</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="relative overflow-hidden border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
                  推荐
                </div>
                <CardHeader className="pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">专业版</h3>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        专业版
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      ¥19.9
                      <span className="text-lg font-normal text-muted-foreground">/月</span>
                    </div>
                    <p className="text-muted-foreground">解锁全部高级功能</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>无限翻译额度</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>实时汇率推送</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>高级报价计算器</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>专属客服支持</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>数据导出功能</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" disabled>
                    <Crown className="h-5 w-5 mr-2" />
                    即将开放
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>

      {/* Statistics & Analytics Section */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">使用统计</h2>
              <p className="text-lg text-muted-foreground">查看您的使用情况和数据分析</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Translation Stats */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">1,234</div>
                      <div className="text-sm text-blue-600/70">本月翻译字数</div>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '12.34%'}}></div>
                  </div>
                  <div className="text-xs text-blue-600/70 mt-2">12.34% of 10,000 字限额</div>
                </CardContent>
              </Card>

              {/* Query Stats */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">56</div>
                      <div className="text-sm text-green-600/70">本月查询次数</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-green-600/70">汇率: 32</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-green-600/70">术语: 24</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Balance */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-amber-100">
                      <Wallet className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600">¥0.00</div>
                      <div className="text-sm text-amber-600/70">账户余额</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-amber-200 text-amber-600 hover:bg-amber-50" disabled>
                    充值 - 即将开放
                  </Button>
                </CardContent>
              </Card>

              {/* Active Days */}
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-purple-100">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">15</div>
                      <div className="text-sm text-purple-600/70">本月活跃天数</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-purple-600/70">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>连续使用 7 天</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Chart Placeholder */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6" />
                  使用趋势分析
                </CardTitle>
                <CardDescription>
                  过去 30 天的使用情况变化
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">数据图表即将上线</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}