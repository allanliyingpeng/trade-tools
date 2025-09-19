"use client"

import { Navigation } from "@/components/features/navigation/navigation"
import { useMobile } from "@/hooks/use-mobile"

// Force dynamic rendering to avoid SSR issues with auth
export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}