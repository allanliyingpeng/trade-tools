"use client"

import React, { useState } from 'react'
import ModernTermDialog from './ModernTermDialog'
import type { Feature } from '@/data/features'

interface TermDialogProps {
  feature: Feature
}

export default function TermDialog({}: TermDialogProps) {
  const [isModernDialogOpen, setIsModernDialogOpen] = useState(false)

  // 监听外部控制
  React.useEffect(() => {
    setIsModernDialogOpen(true)
  }, [])

  return (
    <>
      <ModernTermDialog
        open={isModernDialogOpen}
        onOpenChange={setIsModernDialogOpen}
      />
    </>
  )
}