import { RegisterForm } from "@/components/features/auth/register-form"
import { TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
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
              创建账户
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground">
              开始您的外贸工具箱之旅
            </p>
          </div>
        </div>
      </div>

      {/* Register Form Section */}
      <div className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="rounded-lg bg-card p-8 shadow-lg border">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}