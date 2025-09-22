"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDifyWorkflow } from '@/hooks/useDifyWorkflow'
import { useUsageLimits } from '@/hooks/useUsageLimits'
import { ToolDialogContent, ToolDialogSection } from './ToolDialog'
import { ArrowRight, Copy, RotateCcw, Languages, Loader2, CheckCircle, AlertCircle, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Feature } from '@/data/features'

interface TranslateDialogProps {
  feature: Feature
}

const languages = [
  { code: 'auto', name: '自动检测' },
  { code: 'zh-cn', name: '简体中文' },
  { code: 'zh-tw', name: '繁体中文' },
  { code: 'en', name: '英语' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'es', name: '西班牙语' },
  { code: 'it', name: '意大利语' },
  { code: 'ru', name: '俄语' },
  { code: 'ar', name: '阿拉伯语' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'th', name: '泰语' },
  { code: 'vi', name: '越南语' }
]

const domains = [
  { code: 'general', name: '通用' },
  { code: 'trade', name: '外贸' },
  { code: 'business', name: '商务' },
  { code: 'finance', name: '金融' },
  { code: 'legal', name: '法律' },
  { code: 'medical', name: '医疗' },
  { code: 'tech', name: '科技' }
]

export default function TranslateDialog({ feature }: TranslateDialogProps) {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [domain, setDomain] = useState('trade')
  const [detectedLang, setDetectedLang] = useState('')

  const { executeWorkflow, status, result, error, isLoading, resetState } = useDifyWorkflow()
  const { canExecute, limitMessage } = useUsageLimits(feature.workflowId)

  const handleTranslate = async () => {
    if (!sourceText.trim() || !canExecute) return

    resetState()

    try {
      const workflowResult = await executeWorkflow(feature.workflowId!, {
        text: sourceText,
        source_lang: sourceLang,
        target_lang: targetLang,
        domain: domain
      })

      if (workflowResult?.status === 'success' && workflowResult.data) {
        setTranslatedText(workflowResult.data.translated_text || '')
        setDetectedLang(workflowResult.data.detected_language || '')
      }
    } catch (error) {
      console.error('Translation failed:', error)
    }
  }

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return

    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText('')
    resetState()
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleClear = () => {
    setSourceText('')
    setTranslatedText('')
    setDetectedLang('')
    resetState()
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Languages className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <ToolDialogContent>
      <ToolDialogSection
        title="语言设置"
        description="选择源语言和目标语言"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">源语言</label>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapLanguages}
              disabled={sourceLang === 'auto'}
              className="h-10 w-10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">目标语言</label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">专业领域</label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {domains.map((d) => (
                <SelectItem key={d.code} value={d.code}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ToolDialogSection>

      <Separator />

      <ToolDialogSection
        title="文本翻译"
        description="输入要翻译的文本内容"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">原文</label>
              <div className="flex items-center gap-2">
                {detectedLang && (
                  <Badge variant="secondary" className="text-xs">
                    检测到: {languages.find(l => l.code === detectedLang)?.name || detectedLang}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {sourceText.length}/5000
                </span>
              </div>
            </div>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="请输入要翻译的文本..."
              className="min-h-[200px] resize-none"
              maxLength={5000}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!sourceText}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                清空
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(sourceText)}
                disabled={!sourceText}
              >
                <Copy className="h-4 w-4 mr-2" />
                复制
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">译文</label>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-xs text-muted-foreground">
                  {translatedText.length} 字符
                </span>
              </div>
            </div>
            <Card className="min-h-[200px]">
              <CardContent className="p-4">
                {status === 'running' ? (
                  <div className="flex items-center justify-center h-[168px]">
                    <div className="text-center space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                      <p className="text-sm text-muted-foreground">翻译中...</p>
                    </div>
                  </div>
                ) : status === 'error' ? (
                  <div className="flex items-center justify-center h-[168px]">
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-6 w-6 mx-auto text-red-500" />
                      <p className="text-sm text-red-600">{error || '翻译失败'}</p>
                    </div>
                  </div>
                ) : translatedText ? (
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {translatedText}
                    </p>
                    {result?.usage && (
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        <span>用时: {result.usage.time}ms</span>
                        <span className="ml-4">Token: {result.usage.tokens}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[168px] text-muted-foreground">
                    <p className="text-sm">翻译结果将显示在这里</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(translatedText)}
                disabled={!translatedText}
              >
                <Copy className="h-4 w-4 mr-2" />
                复制译文
              </Button>
            </div>
          </div>
        </div>

        {limitMessage && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{limitMessage}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || !canExecute || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-2" />
            )}
            {isLoading ? '翻译中...' : '开始翻译'}
          </Button>
        </div>
      </ToolDialogSection>
    </ToolDialogContent>
  )
}