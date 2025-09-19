"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/components/providers/auth-provider"
import { TrendingUp, Menu, X } from "lucide-react"

const navigationItems = [
  { href: "#features", label: "功能" },
  { href: "#pricing", label: "定价" },
  { href: "#about", label: "关于" },
]

export function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMobile()
  const { user, loading } = useAuth()

  const NavigationItems = () => (
    <nav className="flex items-center space-x-6">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">控制台</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">进入应用</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="ghost">
          <Link href="/login">登录</Link>
        </Button>
        <Button asChild>
          <Link href="/register">注册</Link>
        </Button>
      </div>
    )
  }

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span className="font-bold">外贸工具箱</span>
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
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span className="font-bold">外贸工具箱</span>
          </Link>
          <NavigationItems />
        </div>
        <AuthButtons />
      </div>
    </header>
  )
}