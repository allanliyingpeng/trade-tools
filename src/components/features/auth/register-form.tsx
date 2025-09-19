"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // 验证密码
    if (password !== confirmPassword) {
      setError("密码和确认密码不匹配")
      return
    }

    if (password.length < 6) {
      setError("密码长度至少为6位")
      return
    }

    try {
      const { data, error } = await signUp(email, password, email.split('@')[0])

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        setSuccess(true)
        // 注册成功后跳转到登录页面，保留返回参数
        const returnTo = searchParams.get('returnTo')
        const loginUrl = returnTo
          ? `/login?message=registration-success&returnTo=${encodeURIComponent(returnTo)}`
          : "/login?message=registration-success"
        setTimeout(() => {
          router.push(loginUrl)
        }, 2000)
      }
    } catch (err) {
      setError("注册失败，请重试")
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          注册成功！请检查您的邮箱并点击确认链接激活账户。
        </div>
        <p className="text-sm text-muted-foreground">
          2秒后自动跳转到登录页面...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">邮箱地址</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱地址"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码（至少6位）"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">确认密码</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "注册中..." : "创建账户"}
        </Button>
      </form>

      <div className="text-center">
        <div className="text-sm text-muted-foreground">
          已有账户？{" "}
          <Link
            href={searchParams.get('returnTo')
              ? `/login?returnTo=${encodeURIComponent(searchParams.get('returnTo') as string)}`
              : "/login"
            }
            className="text-primary hover:underline"
          >
            立即登录
          </Link>
        </div>
      </div>
    </div>
  )
}