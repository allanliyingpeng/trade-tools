export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            重置密码
          </h2>
        </div>
        <div className="rounded-md bg-card p-6 shadow-md">
          <p className="text-center text-muted-foreground">忘记密码页面</p>
        </div>
      </div>
    </div>
  )
}