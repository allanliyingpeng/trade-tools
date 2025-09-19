"use client"

import { useState } from 'react'
import { Search, Heart, Copy, Book } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { HighlightedText } from '@/components/ui/highlighted-text'
import { useTradeTermsSearch } from '@/hooks/use-trade-terms-search'
import { useFavorites } from '@/hooks/use-favorites'
import { TradeTerm, TradeTermCategory, categoryLabels, getCategoryCount, getAllCategories, tradeTerms } from '@/data/trade-terms'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function GlossaryPage() {
  const [selectedTerm, setSelectedTerm] = useState<TradeTerm | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    searchQuery,
    selectedCategory,
    filteredTerms,
    updateSearchQuery,
    setSelectedCategory,
    hasActiveSearch,
    resultCount
  } = useTradeTermsSearch()

  const {
    favoriteCount,
    loading: favoritesLoading,
    isFavorited,
    toggleFavorite,
    getFavoriteTerms,
    isAuthenticated
  } = useFavorites()

  const handleTermClick = (term: TradeTerm) => {
    setSelectedTerm(term)
    setIsDialogOpen(true)
  }

  const handleCopyTerm = async (term: TradeTerm) => {
    const text = `${term.code} - ${term.name_zh} (${term.name_en})\n\n${term.description_zh}\n\n${term.description_en}`

    try {
      await navigator.clipboard.writeText(text)
      // TODO: 添加成功提示
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent, termId: string) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      // TODO: 显示登录提示
      return
    }
    await toggleFavorite(termId)
  }

  const getDisplayTerms = () => {
    if (selectedCategory === 'favorites') {
      const favoriteTerms = getFavoriteTerms()
      if (hasActiveSearch) {
        return favoriteTerms.filter(term =>
          filteredTerms.some(filtered => filtered.id === term.id)
        )
      }
      return favoriteTerms
    }
    return filteredTerms
  }

  const displayTerms = getDisplayTerms()

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <Book className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">外贸术语速查</h1>
          <p className="text-muted-foreground">快速查找和学习外贸术语定义</p>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="搜索术语..."
          value={searchQuery}
          onChange={(e) => updateSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 分类标签页 */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            全部
            <Badge variant="secondary" className="ml-1">
              {tradeTerms.length}
            </Badge>
          </TabsTrigger>
          {getAllCategories().map((category) => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-2">
              {categoryLabels[category].zh}
              <Badge variant="secondary" className="ml-1">
                {getCategoryCount(category)}
              </Badge>
            </TabsTrigger>
          ))}
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            我的收藏
            <Badge variant="secondary" className="ml-1">
              {favoriteCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* 搜索结果提示 */}
        {hasActiveSearch && (
          <div className="mt-4 text-sm text-muted-foreground">
            找到 {resultCount} 个相关术语
          </div>
        )}

        {/* 术语列表 */}
        <TabsContent value={selectedCategory} className="mt-6">
          {favoritesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : displayTerms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {selectedCategory === 'favorites'
                  ? '您还没有收藏任何术语'
                  : hasActiveSearch
                  ? '没有找到相关术语'
                  : '暂无数据'
                }
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayTerms.map((term) => (
                <Card
                  key={term.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 relative group"
                  onClick={() => handleTermClick(term)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-primary">
                          <HighlightedText text={term.code} query={hasActiveSearch ? searchQuery : ''} />
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <div className="font-medium">
                            <HighlightedText text={term.name_zh} query={hasActiveSearch ? searchQuery : ''} />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <HighlightedText text={term.name_en} query={hasActiveSearch ? searchQuery : ''} />
                          </div>
                        </CardDescription>
                      </div>
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "opacity-0 group-hover:opacity-100 transition-opacity",
                            isFavorited(term.id) && "opacity-100"
                          )}
                          onClick={(e) => handleFavoriteClick(e, term.id)}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              isFavorited(term.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground hover:text-red-500"
                            )}
                          />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {categoryLabels[term.category].zh}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        点击查看详情
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 术语详情弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {selectedTerm && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">{selectedTerm.code}</span>
                  <Badge variant="outline">
                    {categoryLabels[selectedTerm.category].zh}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-base">
                  <div className="font-medium text-foreground">{selectedTerm.name_zh}</div>
                  <div className="text-muted-foreground">{selectedTerm.name_en}</div>
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-6 pr-4">
                  {/* 中文描述 */}
                  <div>
                    <h4 className="font-semibold mb-2">中文解释</h4>
                    <p className="text-sm leading-relaxed">{selectedTerm.description_zh}</p>
                  </div>

                  {/* 英文描述 */}
                  <div>
                    <h4 className="font-semibold mb-2">English Description</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {selectedTerm.description_en}
                    </p>
                  </div>

                  {/* 责任划分 */}
                  {selectedTerm.responsibilities_zh && selectedTerm.responsibilities_zh.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">主要责任</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h5 className="text-sm font-medium mb-2">中文</h5>
                          <ul className="text-sm space-y-1">
                            {selectedTerm.responsibilities_zh.map((resp, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">English</h5>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {selectedTerm.responsibilities_en?.map((resp, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyTerm(selectedTerm)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  复制
                </Button>
                {isAuthenticated && (
                  <Button
                    variant={isFavorited(selectedTerm.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFavorite(selectedTerm.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isFavorited(selectedTerm.id) && "fill-current"
                      )}
                    />
                    {isFavorited(selectedTerm.id) ? '已收藏' : '收藏'}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}