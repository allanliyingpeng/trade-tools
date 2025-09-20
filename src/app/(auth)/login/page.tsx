import { LoginForm } from "@/components/features/auth/login-form"
import { TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="w-full py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <TrendingUp className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              欢迎回来
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground">
              登录您的外贸工具箱账户
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="rounded-lg bg-card p-8 shadow-lg border">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}