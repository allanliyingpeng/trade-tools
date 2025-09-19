import { LoginForm } from "@/components/features/auth/login-form"
import { TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            欢迎回来
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            登录您的交易助手账户
          </p>
        </div>
        <div className="rounded-lg bg-card p-6 shadow-lg border">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}