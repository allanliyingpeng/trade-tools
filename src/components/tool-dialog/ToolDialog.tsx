"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UsageCounter } from '@/components/UsageCounter'
import { useMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import type { Feature } from '@/data/features'
import { X } from 'lucide-react'

interface ToolDialogProps {
  feature: Feature
  trigger: React.ReactNode
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ToolDialog({
  feature,
  trigger,
  children,
  open,
  onOpenChange
}: ToolDialogProps) {
  const isMobile = useMobile()
  const Icon = feature.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-3xl w-full max-h-[80vh] overflow-hidden",
          isMobile && "h-full max-h-full rounded-none border-0"
        )}
      >
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br",
                  feature.gradient
                )}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {feature.title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange?.(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* 使用次数显示 */}
          <div className="flex justify-between items-center">
            <UsageCounter
              workflowId={feature.workflowId}
              variant="compact"
            />
            <div className="text-xs text-muted-foreground">
              支持快捷键 ESC 关闭
            </div>
          </div>
        </DialogHeader>

        <div className={cn(
          "flex-1 overflow-y-auto",
          isMobile ? "px-1" : "px-2"
        )}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ToolDialogContentProps {
  className?: string
  children: React.ReactNode
}

export function ToolDialogContent({
  className,
  children
}: ToolDialogContentProps) {
  return (
    <div className={cn("space-y-6 py-4", className)}>
      {children}
    </div>
  )
}

interface ToolDialogSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ToolDialogSection({
  title,
  description,
  children,
  className
}: ToolDialogSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}