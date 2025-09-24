'use client'

import React, { useState, useEffect } from 'react'
import { format, toZonedTime } from 'date-fns-tz'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog' // 假设您使用 shadcn/ui
import {
  Clock,
  Globe,
  Calendar,
  X,
  Search,
  Users
} from 'lucide-react'
import { TRADE_TIMEZONES, REGION_LABELS, type TradeTimezone, getAllRegions } from '@/lib/timezone-data' // 假设数据在单独文件中

// --- 子组件定义 ---

// 左侧控制面板
const LeftControlPanel = ({
  selectedTimezones,
  onTimezoneToggle,
  mode,
  onModeChange
}: any) => {
  const [searchTerm, setSearchTerm] = useState('')
  const isMaxSelected = selectedTimezones.length >= 6

  const filteredTimezones = TRADE_TIMEZONES.filter(
    tz =>
      tz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tz.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedTimezones = getAllRegions().reduce((acc, region) => {
    acc[region] = filteredTimezones.filter(tz => tz.region === region)
    return acc
  }, {} as Record<string, TradeTimezone[]>)

  return (
    <div className="p-3 bg-muted/30 border-b lg:border-b-0 lg:border-r border-border flex flex-col space-y-4 h-full min-h-0">
      {/* 模式切换 */}
      <div className="p-1 bg-muted rounded-lg grid grid-cols-2 gap-1">
        <button
          onClick={() => onModeChange('clocks')}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
            mode === 'clocks'
              ? 'bg-background text-primary shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4" /> 实时时钟
        </button>
        <button
          onClick={() => onModeChange('meeting')}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
            mode === 'meeting'
              ? 'bg-background text-primary shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" /> 会议安排
        </button>
      </div>

      {/* 搜索与选择 */}
      <div className="bg-background border rounded-lg p-4 shadow-sm flex-1 flex flex-col min-h-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="搜索国家或城市..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-foreground">选择时区</h3>
          <span className={`text-sm font-medium ${isMaxSelected ? 'text-destructive' : 'text-muted-foreground'}`}>
            {selectedTimezones.length}/6
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
          {Object.entries(groupedTimezones).map(([region, timezones]) => {
            if (timezones.length === 0) return null
            return (
              <div key={region}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide my-2 px-2">
                  {REGION_LABELS[region as keyof typeof REGION_LABELS]}
                </div>
                {timezones.map(tz => (
                  <label
                    key={tz.id}
                    className={`flex items-center p-3 rounded-md cursor-pointer transition-colors border border-transparent ${
                      isMaxSelected && !selectedTimezones.includes(tz.timezone)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-accent hover:border-border'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTimezones.includes(tz.timezone)}
                      disabled={isMaxSelected && !selectedTimezones.includes(tz.timezone)}
                      onChange={() => onTimezoneToggle(tz.timezone)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring focus:ring-2"
                    />
                    <span className="ml-3 text-2xl">{tz.flag}</span>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-foreground">{tz.name}</p>
                      <p className="text-xs text-muted-foreground">{tz.city}</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{tz.utcOffset}</span>
                  </label>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 右侧时钟卡片
const ClockCard = ({ timezone, currentTime }: { timezone: string; currentTime: Date }) => {
  const tzData = TRADE_TIMEZONES.find(tz => tz.timezone === timezone)
  if (!tzData) return null

  const zonedTime = toZonedTime(currentTime, timezone)
  const currentHour = zonedTime.getHours()
  const { start, end } = tzData.businessHours
  const isWorking = currentHour >= start && currentHour < end && zonedTime.getDay() > 0 && zonedTime.getDay() < 6

  return (
    <div className="bg-background border border-border rounded-xl p-4 w-full transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{tzData.flag}</span>
          <div>
            <p className="font-bold text-lg text-gray-900">{tzData.name}</p>
            <p className="text-sm text-gray-500">{tzData.city}</p>
          </div>
        </div>
        <div className={`px-2 py-1 text-xs font-bold rounded-full ${
            isWorking ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
        }`}>
            {isWorking ? '工作中' : '休息中'}
        </div>
      </div>
      <div className="text-center my-4">
        <p className="text-4xl font-bold font-mono text-gray-900">
          {format(zonedTime, 'HH:mm:ss', { timeZone: timezone })}
        </p>
        <p className="text-sm text-gray-600">
          {format(zonedTime, 'yyyy年MM月dd日, EEEE', { timeZone: timezone })}
        </p>
      </div>
      {/* 工作时间进度条 */}
      <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
              <span>{String(start).padStart(2, '0')}:00</span>
              <span>{String(end).padStart(2, '0')}:00</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 relative">
              <div className="absolute bg-green-500 h-2.5 rounded-full"
                  style={{
                      left: `${(start / 24) * 100}%`,
                      width: `${((end - start) / 24) * 100}%`
                  }}
              />
              <div className="absolute h-2.5 w-1 bg-gray-800 rounded-full"
                  style={{ left: `calc(${(currentHour / 24) * 100}% - 2px)` }}
              />
          </div>
      </div>
    </div>
  )
}

// 右侧显示区域
const RightDisplayPanel = ({ selectedTimezones, currentTime, mode }: any) => {
  if (mode === 'clocks') {
    return (
      <div className="p-3 bg-background overflow-y-auto">
        {selectedTimezones.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center h-full text-muted-foreground">
            <Globe className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground">请从左侧选择时区</h3>
            <p className="text-muted-foreground">最多可添加6个时区进行实时对比</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 h-full content-start">
            {selectedTimezones.map((tz: string) => (
              <ClockCard key={tz} timezone={tz} currentTime={currentTime} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (mode === 'meeting') {
      return (
        <div className="p-3 bg-background overflow-y-auto">
           <div className="text-center flex flex-col items-center justify-center h-full text-muted-foreground">
            <Calendar className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground">会议安排功能</h3>
            <p className="text-muted-foreground">选择多个时区后，这里将为您推荐最佳会议时间。</p>
            <p className="text-xs mt-2 text-muted-foreground/80">(该功能正在开发中)</p>
          </div>
        </div>
      )
  }

  return null
}

// 主弹窗组件
export const TimezoneDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['Asia/Shanghai', 'America/New_York'])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mode, setMode] = useState<'clocks' | 'meeting'>('clocks')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTimezoneToggle = (timezone: string) => {
    setSelectedTimezones(prev =>
      prev.includes(timezone)
        ? prev.filter(tz => tz !== timezone)
        : [...prev, timezone]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85vw] w-full sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl h-[85vh] sm:h-[92vh] p-0 flex flex-col overflow-hidden" showCloseButton={false}>
        <DialogHeader className="px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white flex-shrink-0 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">外贸时区助手</DialogTitle>
                <p className="text-sm text-blue-100">全球时间协调与会议安排</p>
              </div>
            </div>
            <DialogClose asChild>
              <button className="self-end sm:self-auto p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20">
                <X className="w-5 h-5" />
                <span className="sr-only">关闭</span>
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[450px_1fr]">
          <LeftControlPanel
            selectedTimezones={selectedTimezones}
            onTimezoneToggle={handleTimezoneToggle}
            mode={mode}
            onModeChange={setMode}
          />
          <RightDisplayPanel
            selectedTimezones={selectedTimezones}
            currentTime={currentTime}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}