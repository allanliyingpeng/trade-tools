export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
        <p className="text-muted-foreground">欢迎回到交易助手</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold">总资产</h3>
          <p className="text-2xl font-bold">¥0.00</p>
        </div>
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold">今日收益</h3>
          <p className="text-2xl font-bold text-green-600">+¥0.00</p>
        </div>
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold">持仓数量</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold">交易次数</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}