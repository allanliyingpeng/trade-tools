"use client"

import { LandingHeader } from "@/components/features/landing/landing-header"
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
      <LandingHeader />

      {/* Hero Section */}
      <section className="container py-12 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            外贸工具箱
            <span className="block text-primary mt-2">让外贸更简单</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            集成智能翻译、实时汇率、报价计算、术语速查、时区转换等专业工具，
            为外贸从业者提供一站式解决方案，提升工作效率。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
              </div>
            ) : user ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  进入控制台
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
      </section>

      {/* Features Section */}
      <section id="features" className="container py-12 md:py-24">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            强大的功能工具
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            专为外贸行业设计的专业工具集，让您的工作更加高效便捷
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-12 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              为什么选择我们
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              专业、可靠、高效的外贸工具解决方案
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">专业可靠</h3>
              <p className="text-muted-foreground">
                集成权威数据源，确保信息准确性和专业性
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">简单易用</h3>
              <p className="text-muted-foreground">
                直观的界面设计，无需复杂学习即可快速上手
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">高效便捷</h3>
              <p className="text-muted-foreground">
                一站式解决方案，大幅提升外贸工作效率
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            准备开始了吗？
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            立即注册，免费使用所有功能工具
          </p>
          <div className="mt-8">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-md bg-muted mx-auto" />
            ) : user ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  进入控制台
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
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 外贸工具箱. 专业的外贸工具解决方案.
          </div>
        </div>
      </footer>
    </div>
  )
}
