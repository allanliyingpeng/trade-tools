"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  TrendingUp,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  Book
} from "lucide-react"

const navigationItems = [
  {
    href: "/dashboard",
    label: "仪表板",
    icon: LayoutDashboard,
  },
  {
    href: "/glossary",
    label: "术语速查",
    icon: Book,
  },
  {
    href: "/trading",
    label: "交易",
    icon: TrendingUp,
  },
  {
    href: "/profile",
    label: "个人资料",
    icon: User,
  },
  {
    href: "/settings",
    label: "设置",
    icon: Settings,
  },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const { user, signOut, loading } = useAuth()

  const NavigationItems = () => (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const UserSection = () => (
    <div className="mt-auto space-y-2">
      <div className="px-3 py-2">
        <p className="text-sm font-medium">交易助手</p>
        <p className="text-xs text-muted-foreground">
          {user?.email || "用户@example.com"}
        </p>
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        onClick={handleLogout}
        disabled={loading}
      >
        <LogOut className="h-4 w-4" />
        {loading ? "退出中..." : "退出登录"}
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span className="font-semibold">交易助手</span>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                {/* Mobile Menu Header */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="font-semibold">交易助手</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <NavigationItems />
                </div>

                {/* Mobile User Section */}
                <div className="border-t p-4">
                  <UserSection />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Desktop Header */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <TrendingUp className="h-6 w-6" />
          <span className="font-semibold">交易助手</span>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <NavigationItems />
        </div>

        {/* Desktop User Section */}
        <div className="border-t p-4">
          <UserSection />
        </div>
      </div>
    </aside>
  )
}