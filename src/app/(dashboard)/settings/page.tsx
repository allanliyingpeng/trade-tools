export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground">配置您的应用偏好</p>
      </div>
      <div className="rounded-lg bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">应用设置</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">深色模式</label>
              <p className="text-sm text-muted-foreground">切换应用主题</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">通知</label>
              <p className="text-sm text-muted-foreground">接收交易提醒</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}