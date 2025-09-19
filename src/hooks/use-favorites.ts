"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { favoritesService, UserFavoriteTerm } from '@/lib/supabase/favorites'
import { TradeTerm, tradeTerms } from '@/data/trade-terms'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<UserFavoriteTerm[]>([])
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取用户收藏列表
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setFavoriteStatus({})
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await favoritesService.getUserFavorites(user.id)

      if (error) {
        setError(error.message)
        return
      }

      if (data) {
        setFavorites(data)

        // 更新收藏状态映射
        const statusMap: Record<string, boolean> = {}
        data.forEach(fav => {
          statusMap[fav.term_id] = true
        })
        setFavoriteStatus(statusMap)
      }
    } catch (err) {
      setError('获取收藏列表失败')
    } finally {
      setLoading(false)
    }
  }, [user])

  // 添加收藏
  const addFavorite = useCallback(async (termId: string) => {
    if (!user) return false

    try {
      const { data, error } = await favoritesService.addFavorite(user.id, termId)

      if (error) {
        setError(error.message)
        return false
      }

      if (data) {
        setFavorites(prev => [data, ...prev])
        setFavoriteStatus(prev => ({ ...prev, [termId]: true }))
        return true
      }
    } catch (err) {
      setError('添加收藏失败')
    }

    return false
  }, [user])

  // 取消收藏
  const removeFavorite = useCallback(async (termId: string) => {
    if (!user) return false

    try {
      const { error } = await favoritesService.removeFavorite(user.id, termId)

      if (error) {
        setError(error.message)
        return false
      }

      setFavorites(prev => prev.filter(fav => fav.term_id !== termId))
      setFavoriteStatus(prev => ({ ...prev, [termId]: false }))
      return true
    } catch (err) {
      setError('取消收藏失败')
    }

    return false
  }, [user])

  // 切换收藏状态
  const toggleFavorite = useCallback(async (termId: string) => {
    const isFavorited = favoriteStatus[termId]

    if (isFavorited) {
      return await removeFavorite(termId)
    } else {
      return await addFavorite(termId)
    }
  }, [favoriteStatus, addFavorite, removeFavorite])

  // 检查是否已收藏
  const isFavorited = useCallback((termId: string) => {
    return favoriteStatus[termId] || false
  }, [favoriteStatus])

  // 获取收藏的术语详情
  const getFavoriteTerms = useCallback((): TradeTerm[] => {
    const favoriteTermIds = favorites.map(fav => fav.term_id)
    return tradeTerms.filter(term => favoriteTermIds.includes(term.id))
  }, [favorites])

  // 获取收藏数量
  const favoriteCount = favorites.length

  // 清除错误
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 初始化时获取收藏列表
  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return {
    favorites,
    favoriteStatus,
    favoriteCount,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    getFavoriteTerms,
    fetchFavorites,
    clearError,
    isAuthenticated: !!user
  }
}