interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}

function StatCard({ title, value, change, changeType = "neutral" }: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground"
  }[changeType]

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {change && (
        <p className={`text-sm mt-1 ${changeColor}`}>
          {change}
        </p>
      )}
    </div>
  )
}

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="总资产"
        value="¥0.00"
      />
      <StatCard
        title="今日收益"
        value="+¥0.00"
        change="+0.00%"
        changeType="positive"
      />
      <StatCard
        title="持仓数量"
        value="0"
      />
      <StatCard
        title="交易次数"
        value="0"
        change="本月"
        changeType="neutral"
      />
    </div>
  )
}