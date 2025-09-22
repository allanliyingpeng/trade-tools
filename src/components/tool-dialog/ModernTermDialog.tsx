"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Search, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TRADE_TERMS, QUICK_TAGS, searchTerms, SimpleTradeTerm } from '@/data/trade-terms-simple'

interface ModernTermDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ModernTermDialog({ open, onOpenChange }: ModernTermDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string>('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // 防抖搜索
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // 过滤结果
  const filteredTerms = useMemo(() => {
    let results = searchTerms(debouncedQuery)

    if (activeTag) {
      results = results.filter(term => term.code === activeTag)
    }

    return results.slice(0, 100) // 限制结果数量
  }, [debouncedQuery, activeTag])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'Escape':
          onOpenChange(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredTerms.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0) {
            handleTermClick(filteredTerms[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, filteredTerms, onOpenChange])

  const toggleFavorite = (termId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev =>
      prev.includes(termId)
        ? prev.filter(id => id !== termId)
        : [...prev, termId]
    )
  }

  const handleTermClick = (term: SimpleTradeTerm) => {
    // 这里可以添加显示详细信息的逻辑
    console.log('Selected term:', term)
  }

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag('')
    } else {
      setActiveTag(tag)
      setSearchQuery('')
    }
  }

  const resetSearch = () => {
    setSearchQuery('')
    setActiveTag('')
    setSelectedIndex(-1)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={() => onOpenChange(false)}
      />

      {/* 弹窗主体 */}
      <div className="relative w-[600px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* 头部区域 - 固定高度60px */}
        <div className="h-15 px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">外贸术语</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 搜索区域 - 固定高度80px */}
        <div className="px-6 py-4 border-b border-gray-100 space-y-3 flex-shrink-0">
          {/* 搜索框 */}
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setActiveTag('')
                setSelectedIndex(-1)
              }}
              placeholder="搜索术语名称、缩写..."
              className="h-10 pr-10 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => {
                if (searchQuery) {
                  setDebouncedQuery(searchQuery)
                }
              }}
            >
              <Search className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          {/* 快捷标签 */}
          <div className="flex gap-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={cn(
                  "px-3 py-1 rounded-full border text-sm transition-colors",
                  activeTag === tag
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {tag}
              </button>
            ))}
            {(searchQuery || activeTag) && (
              <button
                onClick={resetSearch}
                className="px-3 py-1 rounded-full border text-sm text-gray-500 border-gray-200 hover:bg-gray-50"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {/* 结果区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredTerms.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">未找到相关术语</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTerms.map((term, index) => (
                <div
                  key={term.id}
                  onClick={() => handleTermClick(term)}
                  className={cn(
                    "flex items-center px-6 py-2.5 hover:bg-gray-50 cursor-pointer group transition-colors",
                    selectedIndex === index && "bg-blue-50"
                  )}
                >
                  {/* 术语缩写 */}
                  <div className="w-16 flex-shrink-0">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      term.category === 'E' && "bg-green-100 text-green-800",
                      term.category === 'F' && "bg-blue-100 text-blue-800",
                      term.category === 'C' && "bg-purple-100 text-purple-800",
                      term.category === 'D' && "bg-orange-100 text-orange-800"
                    )}>
                      {term.code}
                    </span>
                  </div>

                  {/* 中文名称 */}
                  <div className="w-32 flex-shrink-0 px-3">
                    <span className="text-sm font-medium text-gray-900">
                      {term.chinese}
                    </span>
                  </div>

                  {/* 英文名称 */}
                  <div className="flex-1 px-3">
                    <span className="text-sm text-gray-600">
                      {term.english}
                    </span>
                  </div>

                  {/* 操作区域 */}
                  <div className="w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleFavorite(term.id, e)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          favorites.includes(term.id)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400"
                        )}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部状态栏 */}
        {filteredTerms.length > 0 && (
          <div className="px-6 py-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>{filteredTerms.length} 个结果</span>
            {favorites.length > 0 && (
              <span>{favorites.length} 个收藏</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}