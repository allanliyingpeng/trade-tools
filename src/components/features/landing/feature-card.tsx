"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  feature: {
    id: string
    title: string
    description: string
    icon: LucideIcon
    href: string
    color: string
    gradient: string
  }
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const { user } = useAuth()
  const Icon = feature.icon

  const handleClick = () => {
    if (!user) {
      // 如果未登录，跳转到登录页面并携带返回参数
      return `/login?returnTo=${encodeURIComponent(feature.href)}`
    }
    return feature.href
  }

  const linkHref = user ? feature.href : handleClick()

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
          feature.gradient
        )}
      />

      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br",
              feature.gradient
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <CardDescription className="mb-4 text-sm leading-relaxed">
          {feature.description}
        </CardDescription>

        <Button asChild className="w-full group-hover:bg-primary/90">
          <Link href={linkHref}>
            开始使用
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}