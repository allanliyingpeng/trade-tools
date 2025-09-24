"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { ToolDialog } from "@/components/tool-dialog/ToolDialog"
import { cn } from "@/lib/utils"
import type { Feature } from "@/data/features"

// 动态导入对话框组件
import dynamic from 'next/dynamic'

const ModernTranslateDialog = dynamic(() => import('@/components/tool-dialog/ModernTranslateDialog'), {
  loading: () => <div className="p-4 text-center">加载中...</div>
})

const CurrencyExchangeDialog = dynamic(() => import('@/components/tool-dialog/CurrencyExchangeDialog'), {
  loading: () => <div className="p-4 text-center">加载中...</div>
})

const QuotationCalculatorDialog = dynamic(() => import('@/components/QuotationCalculatorDialog'), {
  loading: () => <div className="p-4 text-center">加载中...</div>
})

const ModernTermDialog = dynamic(() => import('@/components/tool-dialog/ModernTermDialog'), {
  loading: () => <div className="p-4 text-center">加载中...</div>
})

const TimezoneDialog = dynamic(() => import('@/components/tool-dialog/TimezoneDialog').then(mod => ({ default: mod.TimezoneDialog })), {
  loading: () => <div className="p-4 text-center">加载中...</div>
})

interface FeatureCardProps {
  feature: Feature
  useDialog?: boolean
}

export function FeatureCard({ feature, useDialog = true }: FeatureCardProps) {
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [modernTermOpen, setModernTermOpen] = useState(false)
  const [modernTranslateOpen, setModernTranslateOpen] = useState(false)
  const [quotationCalculatorOpen, setQuotationCalculatorOpen] = useState(false)
  const [currencyExchangeOpen, setCurrencyExchangeOpen] = useState(false)
  const [timezoneOpen, setTimezoneOpen] = useState(false)
  const Icon = feature.icon

  const handleClick = () => {
    if (!user) {
      // 如果未登录，跳转到登录页面并携带返回参数
      return `/login?returnTo=${encodeURIComponent(feature.href)}`
    }

    if (useDialog) {
      if (feature.dialogType === 'term') {
        // 对于术语查询，直接渲染 ModernTermDialog
        setModernTermOpen(true)
        return
      }
      if (feature.dialogType === 'translate') {
        // 对于翻译功能，直接渲染 ModernTranslateDialog
        setModernTranslateOpen(true)
        return
      }
      if (feature.dialogType === 'quote') {
        // 对于报价计算器，直接渲染 QuotationCalculatorDialog
        setQuotationCalculatorOpen(true)
        return
      }
      if (feature.dialogType === 'currency') {
        // 对于汇率功能，直接渲染 CurrencyExchangeDialog
        setCurrencyExchangeOpen(true)
        return
      }
      if (feature.dialogType === 'timezone') {
        // 对于时区功能，直接渲染 TimezoneDialog
        setTimezoneOpen(true)
        return
      }
      setDialogOpen(true)
      return
    }

    return feature.href
  }

  const renderDialogContent = () => {
    if (!user) return null

    switch (feature.dialogType) {
      case 'translate':
        return null // ModernTranslateDialog 管理自己的显示状态
      case 'currency':
        return null // CurrencyExchangeDialog 管理自己的显示状态
      case 'quote':
        return null // QuotationCalculatorDialog 管理自己的显示状态
      case 'term':
        return null // ModernTermDialog 管理自己的显示状态
      case 'timezone':
        return null // TimezoneDialog 管理自己的显示状态
      default:
        return <div className="p-4 text-center">功能开发中...</div>
    }
  }

  const cardContent = (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full h-full flex flex-col">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
          feature.gradient
        )}
      />

      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br",
              feature.gradient
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative flex-1 flex flex-col justify-between">
        <CardDescription className="text-sm leading-relaxed mb-6">
          {feature.description}
        </CardDescription>

        <Button
          className="w-full group-hover:bg-primary/90 mt-auto"
          onClick={user && useDialog ? handleClick : undefined}
          asChild={!user || !useDialog}
        >
          {!user || !useDialog ? (
            <Link href={typeof handleClick() === 'string' ? handleClick() as string : feature.href}>
              开始使用
            </Link>
          ) : (
            <span>开始使用</span>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  if (!user || !useDialog) {
    return cardContent
  }

  return (
    <>
      {feature.dialogType === 'term' ? (
        <>
          {cardContent}
          <ModernTermDialog
            open={modernTermOpen}
            onOpenChange={setModernTermOpen}
          />
        </>
      ) : feature.dialogType === 'translate' ? (
        <>
          {cardContent}
          <ModernTranslateDialog
            open={modernTranslateOpen}
            onOpenChange={setModernTranslateOpen}
          />
        </>
      ) : feature.dialogType === 'quote' ? (
        <>
          {cardContent}
          <QuotationCalculatorDialog
            open={quotationCalculatorOpen}
            onOpenChange={setQuotationCalculatorOpen}
          />
        </>
      ) : feature.dialogType === 'currency' ? (
        <>
          {cardContent}
          <CurrencyExchangeDialog
            open={currencyExchangeOpen}
            onOpenChange={setCurrencyExchangeOpen}
          />
        </>
      ) : feature.dialogType === 'timezone' ? (
        <>
          {cardContent}
          <TimezoneDialog
            open={timezoneOpen}
            onOpenChange={setTimezoneOpen}
          />
        </>
      ) : (
        <ToolDialog
          feature={feature}
          trigger={cardContent}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          {renderDialogContent()}
        </ToolDialog>
      )}
    </>
  )
}