"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/components/providers/auth-provider"
import {
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  Languages,
  DollarSign,
  Calculator,
  Book,
  Clock,
  User,
  LogOut
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const featureItems = [
  { href: "/translate", label: "智能翻译", icon: Languages },
  { href: "/exchange", label: "实时汇率", icon: DollarSign },
  { href: "/quote", label: "报价计算", icon: Calculator },
  { href: "/glossary", label: "术语速查", icon: Book },
  { href: "/timezone", label: "时区转换", icon: Clock },
]

const navigationItems = [
  { href: "#pricing", label: "定价" },
  { href: "#about", label: "关于" },
]

export function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMobile()
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const NavigationItems = () => (
    <nav className="flex items-center space-x-8">
      {/* 产品功能下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1.5 text-base font-medium text-muted-foreground hover:text-foreground">
            产品功能
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {featureItems.map((item) => {
            const Icon = item.icon
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="flex items-center gap-1.5 w-full">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 其他导航项 */}
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )

  const AuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="h-9 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-16 animate-pulse rounded-md bg-muted" />
        </div>
      )
    }

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="default">
            <Link href="/dashboard">
              <User className="h-5 w-5 mr-1.5" />
              个人中心
            </Link>
          </Button>
          <Button variant="ghost" size="default" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-1.5" />
            退出
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="default">
          <Link href="/login">登录</Link>
        </Button>
        <Button asChild size="default">
          <Link href="/register">注册</Link>
        </Button>
      </div>
    )
  }

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-18 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7" />
            <span className="font-bold text-lg">外贸工具箱</span>
          </Link>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center justify-between border-b px-4">
                  <span className="font-semibold">菜单</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-3">
                    {/* 功能列表 */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">产品功能</h3>
                      {featureItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-1.5 py-2 text-sm font-medium transition-colors hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>

                    {/* 其他导航项 */}
                    <div className="space-y-2 pt-4 border-t">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>

                <div className="border-t p-4">
                  <AuthButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center justify-between px-16">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7" />
            <span className="font-bold text-xl">外贸工具箱</span>
          </Link>
          <NavigationItems />
        </div>
        <AuthButtons />
      </div>
    </header>
  )
}