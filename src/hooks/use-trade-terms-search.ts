"use client"

import { useState, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import { TradeTerm, TradeTermCategory, tradeTerms } from '@/data/trade-terms'

interface UseTradeTermsSearchProps {
  initialCategory?: TradeTermCategory | 'all' | 'favorites'
}

export function useTradeTermsSearch({ initialCategory = 'all' }: UseTradeTermsSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TradeTermCategory | 'all' | 'favorites'>(initialCategory)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Fuse.js配置
  const fuse = useMemo(() => {
    return new Fuse(tradeTerms, {
      keys: [
        { name: 'code', weight: 0.3 },
        { name: 'name_en', weight: 0.25 },
        { name: 'name_zh', weight: 0.25 },
        { name: 'description_en', weight: 0.1 },
        { name: 'description_zh', weight: 0.1 }
      ],
      threshold: 0.4, // 模糊匹配阈值
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
    })
  }, [])

  // 防抖处理
  const debounceTimeout = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (query: string, delay: number = 300) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setDebouncedQuery(query)
      }, delay)
    }
  }, [])

  // 更新搜索查询
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
    debounceTimeout(query)
  }, [debounceTimeout])

  // 过滤后的术语列表
  const filteredTerms = useMemo(() => {
    let results: TradeTerm[] = []

    // 首先按分类过滤
    if (selectedCategory === 'all') {
      results = tradeTerms
    } else if (selectedCategory === 'favorites') {
      // 收藏功能将在组件中处理
      results = []
    } else {
      results = tradeTerms.filter(term => term.category === selectedCategory)
    }

    // 然后按搜索查询过滤
    if (debouncedQuery.trim()) {
      const searchResults = fuse.search(debouncedQuery)
      const searchTermIds = new Set(searchResults.map(result => result.item.id))
      results = results.filter(term => searchTermIds.has(term.id))
    }

    return results
  }, [selectedCategory, debouncedQuery, fuse])

  // 搜索结果高亮 - 返回处理过的文本片段
  const getHighlightedTextParts = useCallback((text: string, query: string) => {
    if (!query.trim()) return [{ text, isMatch: false }]

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === query.toLowerCase()
    }))
  }, [])

  // 获取搜索匹配信息
  const getSearchMatches = useCallback((term: TradeTerm) => {
    if (!debouncedQuery.trim()) return null

    const result = fuse.search(debouncedQuery).find(r => r.item.id === term.id)
    return result ? {
      score: result.score,
      matches: result.matches
    } : null
  }, [debouncedQuery, fuse])

  return {
    searchQuery,
    debouncedQuery,
    selectedCategory,
    filteredTerms,
    updateSearchQuery,
    setSelectedCategory,
    getHighlightedTextParts,
    getSearchMatches,
    hasActiveSearch: debouncedQuery.trim().length > 0,
    resultCount: filteredTerms.length
  }
}