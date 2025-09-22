"use client"

import React, { useState, useEffect, useCallback } from 'react'
import {
  X,
  ArrowLeftRight,
  Languages,
  Copy,
  Loader2,
  RotateCcw,
  Clipboard,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ModernTranslateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

const LANGUAGES: Language[] = [
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
]

const QUICK_PAIRS = [
  { from: 'zh', to: 'en', label: '中→英' },
  { from: 'en', to: 'zh', label: '英→中' },
  { from: 'zh', to: 'de', label: '中→德' },
]

export default function ModernTranslateDialog({ open, onOpenChange }: ModernTranslateDialogProps) {
  const [sourceLang, setSourceLang] = useState('zh')
  const [targetLang, setTargetLang] = useState('en')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 防抖翻译
  const [debouncedText, setDebouncedText] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(inputText)
    }, 500)
    return () => clearTimeout(timer)
  }, [inputText])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === 'Escape') {
        onOpenChange(false)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        translateText()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, inputText])

  const switchLanguages = () => {
    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)

    // 如果有翻译结果，将结果作为新的输入
    if (result) {
      setInputText(result)
      setResult('')
    }
  }

  const setQuickTranslate = (from: string, to: string) => {
    setSourceLang(from)
    setTargetLang(to)
  }

  const translateText = useCallback(async () => {
    if (!inputText.trim() || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          from: sourceLang,
          to: targetLang,
        }),
      })

      if (!response.ok) {
        throw new Error('翻译服务暂时不可用')
      }

      const data = await response.json()
      setResult(data.translatedText)

      // 保存到历史记录
      saveToHistory(inputText, data.translatedText, sourceLang, targetLang)
    } catch (error) {
      console.error('Translation failed:', error)
      setError(error instanceof Error ? error.message : '翻译失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }, [inputText, sourceLang, targetLang, isLoading])

  const saveToHistory = (input: string, output: string, from: string, to: string) => {
    try {
      const history = JSON.parse(localStorage.getItem('translation-history') || '[]')
      const newEntry = {
        id: Date.now(),
        input,
        output,
        from,
        to,
        timestamp: new Date().toISOString(),
      }
      const updatedHistory = [newEntry, ...history.slice(0, 19)] // 保持最多20条记录
      localStorage.setItem('translation-history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Failed to save translation history:', error)
    }
  }

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result)
      // 这里可以添加 toast 提示
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const clearInput = () => {
    setInputText('')
    setResult('')
    setError('')
  }

  const pasteText = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
    } catch (error) {
      console.error('Paste failed:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= 5000) {
      setInputText(text)
      setError('')
    }
  }

  const getLanguageDisplay = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code)
    return lang ? `${lang.flag} ${lang.nativeName}` : code
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
      <div className="relative w-[800px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* 头部区域 */}
        <div className="h-15 px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          {/* 左侧标题 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">智能翻译</h2>
          </div>

          {/* 中间语言切换器 */}
          <div className="flex items-center space-x-3">
            {/* 源语言选择 */}
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="w-32 h-8 text-sm border border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 语言互换按钮 */}
            <button
              onClick={switchLanguages}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors group"
              title="切换语言方向"
            >
              <ArrowLeftRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* 目标语言选择 */}
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="w-32 h-8 text-sm border border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 快捷语言按钮组 */}
            <div className="flex items-center space-x-1 border-l border-gray-200 pl-3">
              {QUICK_PAIRS.map((pair) => (
                <button
                  key={`${pair.from}-${pair.to}`}
                  onClick={() => setQuickTranslate(pair.from, pair.to)}
                  className={cn(
                    "px-2 py-1 text-xs rounded transition-colors",
                    sourceLang === pair.from && targetLang === pair.to
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-blue-50 hover:text-blue-700"
                  )}
                  title={`${pair.from === 'zh' ? '中文' : pair.from === 'en' ? '英语' : '德语'}翻译为${pair.to === 'zh' ? '中文' : pair.to === 'en' ? '英语' : '德语'}`}
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 主要翻译区域 */}
        <div className="flex-1 p-6 grid grid-cols-2 gap-6 overflow-hidden">
          {/* 左侧 - 输入区域 */}
          <div className="flex flex-col h-full">
            {/* 区域标题 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">原文</span>
              <span className="text-xs text-gray-400">{inputText.length}/5000</span>
            </div>

            {/* 文本输入框 */}
            <textarea
              placeholder={`请输入要翻译的文本...

支持：
• 外贸术语翻译
• 商务邮件翻译
• 合同条款翻译`}
              className="flex-1 resize-none border border-gray-200 rounded-lg p-4
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         text-sm leading-relaxed transition-colors"
              value={inputText}
              onChange={handleInputChange}
            />

            {/* 底部工具栏 */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button
                  onClick={clearInput}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  清空
                </button>
                <button
                  onClick={pasteText}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <Clipboard className="w-3 h-3" />
                  粘贴
                </button>
              </div>

              <button
                onClick={translateText}
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                           hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                           flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>翻译中...</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    <span>翻译</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 右侧 - 结果区域 */}
          <div className="flex flex-col h-full">
            {/* 区域标题 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">译文</span>
              {result && (
                <button
                  onClick={copyResult}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>复制</span>
                </button>
              )}
            </div>

            {/* 翻译结果显示 */}
            <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 mx-auto mb-2 text-blue-600 animate-spin" />
                    <p className="text-sm text-gray-500">Gemini正在翻译中...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 text-orange-500">⚠️</div>
                    <p className="text-sm text-gray-600">{error}</p>
                    <button
                      onClick={translateText}
                      className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                    >
                      重试
                    </button>
                  </div>
                </div>
              ) : result ? (
                <div className="text-sm leading-relaxed text-gray-900 h-full overflow-y-auto custom-scrollbar">
                  {result}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="text-gray-400">
                    <Languages className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">翻译结果将显示在这里</p>
                    <p className="text-xs mt-1">支持外贸专业术语翻译</p>
                    <p className="text-xs mt-1 text-gray-300">快捷键：Ctrl+Enter</p>
                  </div>
                </div>
              )}
            </div>

            {/* 结果区域工具栏 */}
            {result && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">
                    由 Gemini 翻译
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={translateText}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    重新翻译
                  </button>
                  <button
                    onClick={copyResult}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    复制全部
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}