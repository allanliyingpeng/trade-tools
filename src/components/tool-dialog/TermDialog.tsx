"use client"

import React, { useState } from 'react'
import ModernTermDialog from './ModernTermDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { termsDatabase, searchTerms, getTermsByCategory } from '@/data/terms-database'
import { ToolDialogContent, ToolDialogSection } from './ToolDialog'
import { Search, BookOpen, Star, Copy, ExternalLink, Loader2, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Feature } from '@/data/features'

interface TermDialogProps {
  feature: Feature
}

const categories = [
  { code: 'all', name: '全部' },
  { code: 'incoterms', name: 'Incoterms' },
  { code: 'payment', name: '付款条件' },
  { code: 'shipping', name: '运输条款' },
  { code: 'insurance', name: '保险条款' },
  { code: 'customs', name: '海关清关' },
  { code: 'quality', name: '质量标准' },
  { code: 'contract', name: '合同条款' },
  { code: 'finance', name: '贸易金融' },
  { code: 'documents', name: '贸易单据' }
]

const languages = [
  { code: 'zh-cn', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'both', name: '中英对照' }
]

const popularTerms = [
  'FOB', 'CIF', 'EXW', 'L/C', 'T/T', 'D/P', 'D/A', 'B/L', 'AWB', 'COD'
]

export default function TermDialog({}: TermDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [language, setLanguage] = useState('both')
  const [results, setResults] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('term-favorites')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('term-search-history')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(false)

  // 初始化时加载默认数据
  React.useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true)
        const defaultResults = termsDatabase.slice(0, 20)
        setResults(defaultResults)
      } finally {
        setIsLoading(false)
      }
    }
    initializeData()
  }, [])

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery

    setIsLoading(true)

    try {
      let filteredResults = []

      if (searchTerm.trim()) {
        filteredResults = searchTerms(searchTerm, {
          category: category !== 'all' ? category : undefined,
          language: language === 'en' ? 'en' : language === 'zh-cn' ? 'zh' : 'both'
        })
      } else if (category !== 'all') {
        filteredResults = getTermsByCategory(category)
      } else {
        filteredResults = termsDatabase.slice(0, 20)
      }

      if (searchTerm.trim()) {
        addToHistory(searchTerm)
      }

      setResults(filteredResults)
    } catch (error) {
      console.error('Term search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term)
    addToHistory(term)
    handleSearch(term)
  }

  const handleCopyTerm = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const toggleFavorite = (termId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(termId)
        ? prev.filter(id => id !== termId)
        : [...prev, termId]

      if (typeof window !== 'undefined') {
        localStorage.setItem('term-favorites', JSON.stringify(newFavorites))
      }
      return newFavorites
    })
  }

  const addToHistory = (term: string) => {
    if (!term.trim()) return

    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, 10)

      if (typeof window !== 'undefined') {
        localStorage.setItem('term-search-history', JSON.stringify(newHistory))
      }
      return newHistory
    })
  }

  const renderTermCard = (term: any, index: number) => (
    <div
      key={term.id || index}
      className="group flex items-center py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
      onClick={() => handleQuickSearch(term.term)}
    >
      {/* 术语标签 */}
      <div className="flex-shrink-0 mr-4">
        <Badge
          variant="secondary"
          className={cn(
            "text-xs font-mono px-2 py-1",
            term.category === 'incoterms' && "bg-blue-100 text-blue-800",
            term.category === 'payment' && "bg-green-100 text-green-800",
            term.category === 'shipping' && "bg-purple-100 text-purple-800",
            term.category === 'insurance' && "bg-orange-100 text-orange-800",
            !['incoterms', 'payment', 'shipping', 'insurance'].includes(term.category) && "bg-gray-100 text-gray-800"
          )}
        >
          {term.abbreviation || term.term.substring(0, 3).toUpperCase()}
        </Badge>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900">{term.term}</span>
          {(term.englishTerm || term.english_term) && (
            <span className="text-sm text-gray-600 italic">
              {term.englishTerm || term.english_term}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">
          {(term.definition || term.chinese_definition || '').substring(0, 80)}
          {(term.definition || term.chinese_definition || '').length > 80 ? '...' : ''}
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(term.id || index.toString())
          }}
          className="h-8 w-8 text-gray-400 hover:text-yellow-500"
        >
          <Star
            className={cn(
              "h-4 w-4",
              favorites.includes(term.id || index.toString())
                ? "fill-yellow-400 text-yellow-500"
                : "text-gray-400"
            )}
          />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* 简洁标题 */}
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">外贸术语</h2>
      </div>

      {/* 搜索区域 */}
      <div className="px-6 pb-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索术语、缩写或关键词"
            className="pl-12 h-12 text-base border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-lg bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
          <Button
            onClick={() => handleSearch()}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* 快捷标签 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCategory('all')
              handleSearch()
            }}
            className="h-7 px-3 text-sm rounded-full"
          >
            全部
          </Button>
          {categories.slice(1, 5).map((cat) => (
            <Button
              key={cat.code}
              variant={category === cat.code ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCategory(cat.code)
                handleSearch()
              }}
              className="h-7 px-3 text-sm rounded-full"
            >
              {cat.name}
            </Button>
          ))}
          {popularTerms.slice(0, 4).map((term) => (
            <Button
              key={term}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSearch(term)}
              className="h-7 px-3 text-sm rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {term}
            </Button>
          ))}
        </div>

        {/* 简化的搜索历史 */}
        {searchHistory.length > 0 && (
          <div className="text-sm text-gray-500">
            搜索历史: {searchHistory.slice(0, 5).join(' · ')}
          </div>
        )}
      </div>

      {/* 结果区域 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-sm text-gray-500">正在搜索术语...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-800">
                    找到 {results.length} 个相关术语
                  </span>
                </div>
                {favorites.length > 0 && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Star className="h-3 w-3 mr-1" />
                    已收藏 {favorites.length} 个
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((term, index) => renderTermCard(term, index))}
              </div>

              {results.length > 20 && (
                <div className="text-center py-4 border-t">
                  <p className="text-sm text-gray-500">
                    显示前 20 个结果，请缩小搜索范围查看更多
                  </p>
                </div>
              )}
            </div>
          ) : searchQuery || category !== 'all' ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">未找到相关术语</h3>
              <p className="text-sm text-gray-500 mb-4">请尝试修改搜索关键词或选择其他分类</p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setCategory('all')
                  handleSearch()
                }}
                variant="outline"
                size="sm"
              >
                查看全部术语
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 热门分类 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.slice(1, 9).map((cat) => (
                  <Button
                    key={cat.code}
                    variant="outline"
                    onClick={() => {
                      setCategory(cat.code)
                      setSearchQuery('')
                      handleSearch()
                    }}
                    className="h-16 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Filter className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-medium">{cat.name}</span>
                  </Button>
                ))}
              </div>

              {/* 热门术语 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-600" />
                  热门术语
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {popularTerms.map((term) => (
                    <Button
                      key={term}
                      variant="ghost"
                      onClick={() => handleQuickSearch(term)}
                      className="h-12 justify-center hover:bg-orange-50 hover:text-orange-700 border border-transparent hover:border-orange-200 transition-all duration-200 font-medium"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 功能介绍 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">功能亮点</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">智能搜索</h4>
                      <p className="text-xs text-gray-600">支持中英文模糊搜索、缩写查询</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">详细解释</h4>
                      <p className="text-xs text-gray-600">包含定义、示例和参考资料</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">本地收藏</h4>
                      <p className="text-xs text-gray-600">保存常用术语，随时查阅</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}