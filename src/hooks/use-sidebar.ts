"use client"

import { useState, useEffect } from 'react'
import { useMobile } from './use-mobile'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  // Close sidebar when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [isMobile])

  const toggle = () => setIsOpen(!isOpen)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    toggle,
    open,
    close,
    isMobile,
  }
}