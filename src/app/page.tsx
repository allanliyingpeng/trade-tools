"use client"

import { FeatureCard } from "@/components/features/landing/feature-card"
import { features } from "@/data/features"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <div className="w-full py-16 md:py-28 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              外贸工具箱
              <span className="block text-primary mt-4 lg:mt-6">让外贸更简单</span>
            </h1>
            <p className="mt-10 text-lg sm:text-xl lg:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
              集成智能翻译、实时汇率、报价计算、术语速查、时区转换等专业工具，
              为外贸从业者提供一站式解决方案，提升工作效率。
            </p>
            <div className="mt-16 flex items-center justify-center gap-6 flex-wrap">
        {loading ? (
          <div className="flex items-center space-x-4">
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        ) : user ? (
          <Button asChild size="lg">
            <Link href="/dashboard">
              个人中心
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/register">
                免费开始
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">登录</Link>
            </Button>
          </>
        )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full py-16 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              强大的功能工具
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              专为外贸行业设计的专业工具集，让您的工作更加高效便捷
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {features.map((feature) => (
                <div key={feature.id} className="w-full max-w-[380px] min-h-[280px] flex">
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full py-16 md:py-28 lg:py-32 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          为什么选择我们
        </h2>
        <p className="mt-6 text-xl text-muted-foreground">
          专业、可靠、高效的外贸工具解决方案
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">专业可靠</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              集成权威数据源，确保信息准确性和专业性
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">简单易用</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              直观的界面设计，无需复杂学习即可快速上手
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">高效便捷</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              一站式解决方案，大幅提升外贸工作效率
            </p>
          </div>
        </div>
      </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-16 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            准备开始了吗？
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            立即注册，免费使用所有功能工具
          </p>
          <div className="mt-12">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-md bg-muted mx-auto" />
            ) : user ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  个人中心
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/register">
                  免费注册
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          </div>
        </div>
      </div>

    </div>
  )
}