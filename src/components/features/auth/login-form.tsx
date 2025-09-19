"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, loading, user } = useAuth()

  // Redirect to dashboard or return URL when user becomes authenticated
  useEffect(() => {
    if (user && !loading) {
      const returnTo = searchParams.get('returnTo')
      router.push(returnTo && returnTo.startsWith('/') ? returnTo : "/dashboard")
    }
  }, [user, loading, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // The AuthProvider will handle the redirect via auth state change
        // Just refresh to update the server-side session
        router.refresh()
      }
    } catch (err) {
      setError("登录失败，请重试")
    }
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
            placeholder="请输入密码"
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "登录中..." : "登录"}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          忘记密码？
        </Link>
        <div className="text-sm text-muted-foreground">
          还没有账户？{" "}
          <Link
            href={searchParams.get('returnTo')
              ? `/register?returnTo=${encodeURIComponent(searchParams.get('returnTo') as string)}`
              : "/register"
            }
            className="text-primary hover:underline"
          >
            立即注册
          </Link>
        </div>
      </div>
    </div>
  )
}