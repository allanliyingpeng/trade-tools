"use client"

import { useState, useEffect } from 'react'
import { databaseService } from '@/lib/supabase/database'
import { useAuth } from './use-auth'
import type { Trade } from '@/types/database'

export function useTrading() {
  const { user } = useAuth()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchTrades()
    }
  }, [user])

  const fetchTrades = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await databaseService.getTrades(user.id)
      if (error) throw error
      setTrades(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades')
    } finally {
      setLoading(false)
    }
  }

  const createTrade = async (tradeData: any) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await databaseService.createTrade({
        ...tradeData,
        user_id: user.id,
      })
      if (error) throw error

      // Add to local state
      if (data) {
        setTrades(prev => [data, ...prev])
      }

      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create trade'
      return { data: null, error }
    }
  }

  const updateTrade = async (tradeId: string, updates: any) => {
    try {
      const { data, error } = await databaseService.updateTrade(tradeId, updates)
      if (error) throw error

      // Update local state
      if (data) {
        setTrades(prev => prev.map(trade =>
          trade.id === tradeId ? data : trade
        ))
      }

      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update trade'
      return { data: null, error }
    }
  }

  const deleteTrade = async (tradeId: string) => {
    try {
      const { error } = await databaseService.deleteTrade(tradeId)
      if (error) throw error

      // Remove from local state
      setTrades(prev => prev.filter(trade => trade.id !== tradeId))

      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete trade'
      return { error }
    }
  }

  return {
    trades,
    loading,
    error,
    createTrade,
    updateTrade,
    deleteTrade,
    refetch: fetchTrades,
  }
}