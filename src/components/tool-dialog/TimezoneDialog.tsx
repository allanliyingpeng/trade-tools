"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDifyWorkflow } from '@/hooks/useDifyWorkflow'
import { useUsageLimits } from '@/hooks/useUsageLimits'
import { ToolDialogContent, ToolDialogSection } from './ToolDialog'
import { Clock, Globe, Calendar, ArrowRight, Users, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Feature } from '@/data/features'

interface TimezoneDialogProps {
  feature: Feature
}

const timezones = [
  { value: 'Asia/Shanghai', label: '北京 (UTC+8)', city: '北京', flag: '🇨🇳' },
  { value: 'America/New_York', label: '纽约 (UTC-5/-4)', city: '纽约', flag: '🇺🇸' },
  { value: 'America/Los_Angeles', label: '洛杉矶 (UTC-8/-7)', city: '洛杉矶', flag: '🇺🇸' },
  { value: 'Europe/London', label: '伦敦 (UTC+0/+1)', city: '伦敦', flag: '🇬🇧' },
  { value: 'Europe/Paris', label: '巴黎 (UTC+1/+2)', city: '巴黎', flag: '🇫🇷' },
  { value: 'Europe/Berlin', label: '柏林 (UTC+1/+2)', city: '柏林', flag: '🇩🇪' },
  { value: 'Asia/Tokyo', label: '东京 (UTC+9)', city: '东京', flag: '🇯🇵' },
  { value: 'Asia/Seoul', label: '首尔 (UTC+9)', city: '首尔', flag: '🇰🇷' },
  { value: 'Asia/Singapore', label: '新加坡 (UTC+8)', city: '新加坡', flag: '🇸🇬' },
  { value: 'Asia/Dubai', label: '迪拜 (UTC+4)', city: '迪拜', flag: '🇦🇪' },
  { value: 'Australia/Sydney', label: '悉尼 (UTC+10/+11)', city: '悉尼', flag: '🇦🇺' },
  { value: 'Pacific/Auckland', label: '奥克兰 (UTC+12/+13)', city: '奥克兰', flag: '🇳🇿' },
  { value: 'America/Toronto', label: '多伦多 (UTC-5/-4)', city: '多伦多', flag: '🇨🇦' },
  { value: 'America/Sao_Paulo', label: '圣保罗 (UTC-3)', city: '圣保罗', flag: '🇧🇷' },
  { value: 'Asia/Mumbai', label: '孟买 (UTC+5:30)', city: '孟买', flag: '🇮🇳' },
  { value: 'Africa/Lagos', label: '拉各斯 (UTC+1)', city: '拉各斯', flag: '🇳🇬' },
  { value: 'Europe/Moscow', label: '莫斯科 (UTC+3)', city: '莫斯科', flag: '🇷🇺' }
]

const meetingTypes = [
  { value: 'meeting', label: '会议' },
  { value: 'call', label: '通话' },
  { value: 'presentation', label: '演示' },
  { value: 'interview', label: '面试' },
  { value: 'training', label: '培训' },
  { value: 'webinar', label: '网络研讨会' }
]

interface WorldClock {
  id: string
  timezone: string
  label: string
}

export default function TimezoneDialog({ feature }: TimezoneDialogProps) {
  const [sourceTime, setSourceTime] = useState('')
  const [sourceTimezone, setSourceTimezone] = useState('Asia/Shanghai')
  const [targetTimezones, setTargetTimezones] = useState<string[]>(['America/New_York', 'Europe/London'])
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingType, setMeetingType] = useState('meeting')
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>([
    { id: '1', timezone: 'Asia/Shanghai', label: '北京' },
    { id: '2', timezone: 'America/New_York', label: '纽约' },
    { id: '3', timezone: 'Europe/London', label: '伦敦' }
  ])
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({})
  const [conversionResult, setConversionResult] = useState<any>(null)

  const { executeWorkflow, status, error, isLoading, resetState } = useDifyWorkflow()
  const { canExecute, limitMessage } = useUsageLimits(feature.workflowId)

  // 更新实时时钟
  useEffect(() => {
    const updateClocks = () => {
      const times: Record<string, string> = {}
      worldClocks.forEach(clock => {
        const now = new Date()
        const timeInZone = new Intl.DateTimeFormat('zh-CN', {
          timeZone: clock.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now)
        times[clock.id] = timeInZone
      })
      setCurrentTimes(times)
    }

    updateClocks()
    const interval = setInterval(updateClocks, 1000)
    return () => clearInterval(interval)
  }, [worldClocks])

  const handleTimeConversion = async () => {
    if (!sourceTime || !canExecute) return

    resetState()

    try {
      const workflowResult = await executeWorkflow(feature.workflowId!, {
        source_time: sourceTime,
        source_timezone: sourceTimezone,
        target_timezones: targetTimezones,
        include_business_hours: true,
        include_recommendations: true
      })

      if (workflowResult?.status === 'success' && workflowResult.data) {
        setConversionResult(workflowResult.data)
      }
    } catch (error) {
      console.error('Timezone conversion failed:', error)
    }
  }

  const handleMeetingPlanner = async () => {
    if (!meetingDate || !meetingTime || !canExecute) return

    resetState()

    try {
      const workflowResult = await executeWorkflow(feature.workflowId!, {
        meeting_datetime: `${meetingDate}T${meetingTime}`,
        organizer_timezone: sourceTimezone,
        participant_timezones: targetTimezones,
        meeting_type: meetingType,
        suggest_optimal_time: true
      })

      if (workflowResult?.status === 'success' && workflowResult.data) {
        setConversionResult(workflowResult.data)
      }
    } catch (error) {
      console.error('Meeting planning failed:', error)
    }
  }

  const addWorldClock = () => {
    const availableTimezone = timezones.find(tz =>
      !worldClocks.some(clock => clock.timezone === tz.value)
    )

    if (availableTimezone) {
      const newClock: WorldClock = {
        id: Date.now().toString(),
        timezone: availableTimezone.value,
        label: availableTimezone.city
      }
      setWorldClocks([...worldClocks, newClock])
    }
  }

  const removeWorldClock = (id: string) => {
    if (worldClocks.length > 1) {
      setWorldClocks(worldClocks.filter(clock => clock.id !== id))
    }
  }

  const updateWorldClock = (id: string, timezone: string) => {
    const timezoneData = timezones.find(tz => tz.value === timezone)
    setWorldClocks(worldClocks.map(clock =>
      clock.id === id
        ? { ...clock, timezone, label: timezoneData?.city || timezone }
        : clock
    ))
  }

  const addTargetTimezone = () => {
    const available = timezones.find(tz => !targetTimezones.includes(tz.value))
    if (available) {
      setTargetTimezones([...targetTimezones, available.value])
    }
  }

  const removeTargetTimezone = (timezone: string) => {
    if (targetTimezones.length > 1) {
      setTargetTimezones(targetTimezones.filter(tz => tz !== timezone))
    }
  }

  const formatTimeWithStatus = (timeStr: string, timezone: string) => {
    try {
      const date = new Date(timeStr)
      const hour = date.getHours()
      let status = ''
      let statusColor = ''

      if (hour >= 9 && hour < 18) {
        status = '工作时间'
        statusColor = 'text-green-600'
      } else if (hour >= 6 && hour < 9) {
        status = '早晨'
        statusColor = 'text-yellow-600'
      } else if (hour >= 18 && hour < 22) {
        status = '晚间'
        statusColor = 'text-orange-600'
      } else {
        status = '休息时间'
        statusColor = 'text-red-600'
      }

      return { time: timeStr, status, statusColor }
    } catch {
      return { time: timeStr, status: '', statusColor: '' }
    }
  }

  return (
    <ToolDialogContent>
      <ToolDialogSection
        title="世界时钟"
        description="查看全球主要城市的当前时间"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">实时时钟</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addWorldClock}
              disabled={worldClocks.length >= 8}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加时钟
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worldClocks.map((clock) => {
              const timezoneData = timezones.find(tz => tz.value === clock.timezone)
              return (
                <Card key={clock.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{timezoneData?.flag}</span>
                        <Select
                          value={clock.timezone}
                          onValueChange={(value: string) => updateWorldClock(clock.id, value)}
                        >
                          <SelectTrigger className="w-auto border-0 p-0 h-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                <div className="flex items-center gap-2">
                                  <span>{tz.flag}</span>
                                  <span>{tz.city}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {worldClocks.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWorldClock(clock.id)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-mono font-bold">
                      {currentTimes[clock.id]?.split(' ')[1] || '--:--:--'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentTimes[clock.id]?.split(' ')[0] || '----/--/--'}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </ToolDialogSection>

      <Separator />

      <ToolDialogSection
        title="时间转换"
        description="转换特定时间到不同时区"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">源时区</label>
              <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <div className="flex items-center gap-2">
                        <span>{tz.flag}</span>
                        <span>{tz.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">日期时间</label>
              <Input
                type="datetime-local"
                value={sourceTime}
                onChange={(e) => setSourceTime(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleTimeConversion}
                disabled={!sourceTime || !canExecute || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                转换时间
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">目标时区</label>
              <Button
                variant="outline"
                size="sm"
                onClick={addTargetTimezone}
                disabled={targetTimezones.length >= 6}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加时区
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {targetTimezones.map((timezone) => {
                const timezoneData = timezones.find(tz => tz.value === timezone)
                return (
                  <div key={timezone} className="flex items-center gap-2">
                    <Select
                      value={timezone}
                      onValueChange={(value: string) => {
                        setTargetTimezones(targetTimezones.map(tz =>
                          tz === timezone ? value : tz
                        ))
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            <div className="flex items-center gap-2">
                              <span>{tz.flag}</span>
                              <span>{tz.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {targetTimezones.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeTargetTimezone(timezone)}
                        className="h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ToolDialogSection>

      <Separator />

      <ToolDialogSection
        title="会议规划"
        description="为跨时区会议找到最佳时间"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">会议日期</label>
            <Input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">会议时间</label>
            <Input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">会议类型</label>
            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meetingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleMeetingPlanner}
              disabled={!meetingDate || !meetingTime || !canExecute || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              规划会议
            </Button>
          </div>
        </div>
      </ToolDialogSection>

      {limitMessage && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{limitMessage}</span>
          </div>
        </div>
      )}

      {/* 结果显示 */}
      {(status === 'success' || status === 'error') && (
        <ToolDialogSection title="转换结果">
          {status === 'error' ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <AlertCircle className="h-6 w-6 mx-auto text-red-500" />
                <p className="text-sm text-red-600">{error || '时区转换失败'}</p>
              </div>
            </div>
          ) : conversionResult ? (
            <div className="space-y-4">
              {conversionResult.conversions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conversionResult.conversions.map((conversion: any, index: number) => {
                    const timezoneData = timezones.find(tz => tz.value === conversion.timezone)
                    const timeInfo = formatTimeWithStatus(conversion.converted_time, conversion.timezone)

                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{timezoneData?.flag}</span>
                              <span className="font-medium">{timezoneData?.city || conversion.timezone}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", timeInfo.statusColor)}
                            >
                              {timeInfo.status}
                            </Badge>
                          </div>
                          <div className="text-lg font-mono font-bold">
                            {new Date(conversion.converted_time).toLocaleString('zh-CN')}
                          </div>
                          {conversion.is_business_hours !== undefined && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {conversion.is_business_hours ? '✅ 工作时间' : '❌ 非工作时间'}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {conversionResult.optimal_times && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      推荐会议时间
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conversionResult.optimal_times.slice(0, 3).map((time: any, index: number) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                选项 {index + 1}: {new Date(time.datetime).toLocaleString('zh-CN')}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                适合度: {time.suitability_score}/100
                              </div>
                            </div>
                            <Badge variant={time.suitability_score >= 80 ? 'default' : 'secondary'}>
                              {time.suitability_score >= 80 ? '推荐' : '可选'}
                            </Badge>
                          </div>
                          {time.notes && (
                            <div className="text-sm text-muted-foreground mt-2">
                              {time.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </ToolDialogSection>
      )}
    </ToolDialogContent>
  )
}