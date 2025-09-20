"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Languages,
  DollarSign,
  Calculator,
  Book,
  Clock,
  ChevronUp,
  Mail,
  MessageCircle,
  Linkedin,
  Shield,
  Lock,
  Globe,
  QrCode,
  X
} from "lucide-react"

export function Footer() {
  const [showWechatQR, setShowWechatQR] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const productLinks = [
    { href: "/translate", label: "智能翻译", icon: Languages },
    { href: "/exchange", label: "实时汇率", icon: DollarSign },
    { href: "/quote", label: "报价计算器", icon: Calculator },
    { href: "/glossary", label: "术语速查", icon: Book },
    { href: "/timezone", label: "时区转换", icon: Clock },
  ]

  const aboutLinks = [
    { href: "/about", label: "公司介绍" },
    { href: "/terms", label: "服务条款" },
    { href: "/privacy", label: "隐私政策" },
    { href: "/pricing", label: "定价方案" },
  ]

  const helpLinks = [
    { href: "/tutorial", label: "使用教程" },
    { href: "/faq", label: "常见问题" },
    { href: "/feedback", label: "意见反馈" },
    { href: "/changelog", label: "更新日志" },
    { href: "/api-docs", label: "API文档", badge: "即将推出" },
  ]

  const contactInfo = [
    { type: "email", label: "客服邮箱", value: "support@example.com", icon: Mail },
    { type: "email", label: "商务合作", value: "business@example.com", icon: Mail },
    { type: "text", label: "工作时间", value: "周一至周五 9:00-18:00" },
    { type: "text", label: "响应时间", value: "24小时内回复" },
  ]

  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* 主要内容区域 */}
      <div className="w-full py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo和标语 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">外贸工具箱</span>
            </div>
            <p className="text-lg text-gray-400 max-w-2xl">
              专业的外贸工具解决方案，集成智能翻译、实时汇率、报价计算等核心功能，
              为外贸从业者提供高效便捷的一站式服务。
            </p>
          </div>

          {/* 4列链接区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* 产品功能 */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">产品功能</h3>
              <ul className="space-y-3">
                {productLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* 关于我们 */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">关于我们</h3>
              <ul className="space-y-3">
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 帮助中心 */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">帮助中心</h3>
              <ul className="space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 联系我们 */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">联系我们</h3>
              <ul className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <li key={index}>
                    {contact.type === "email" ? (
                      <a
                        href={`mailto:${contact.value}`}
                        className="flex items-start gap-2 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {contact.icon && <contact.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <div>
                          <div className="text-sm text-gray-400">{contact.label}</div>
                          <div>{contact.value}</div>
                        </div>
                      </a>
                    ) : (
                      <div className="text-gray-300">
                        <div className="text-sm text-gray-400">{contact.label}</div>
                        <div>{contact.value}</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 社交媒体区域 */}
          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white font-medium mb-4">关注我们</h4>
                <div className="flex items-center gap-4">
                  {/* 微信公众号 */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-white hover:bg-gray-800"
                      onClick={() => setShowWechatQR(!showWechatQR)}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      微信公众号
                    </Button>
                    {showWechatQR && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-900 font-medium">扫码关注</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-500"
                            onClick={() => setShowWechatQR(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                          <QrCode className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="text-xs text-gray-600 mt-2 text-center">二维码即将推出</div>
                      </div>
                    )}
                  </div>

                  {/* 企业微信 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    企业微信
                  </Button>

                  {/* LinkedIn */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <Linkedin className="h-5 w-5 mr-2" />
                    LinkedIn
                  </Button>

                  {/* Email */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                    asChild
                  >
                    <a href="mailto:support@example.com">
                      <Mail className="h-5 w-5 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* 信任徽章 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span>数据安全</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="h-4 w-4" />
                  <span>隐私保护</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Globe className="h-4 w-4" />
                  <span>中文 | English</span>
                </div>
              </div>
            </div>
          </div>

          {/* 底部版权信息 */}
          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © 2024 外贸工具箱. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                隐私政策
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 返回顶部按钮 */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 rounded-full p-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg z-50"
        size="sm"
      >
        <ChevronUp className="h-5 w-5" />
        <span className="sr-only">返回顶部</span>
      </Button>
    </footer>
  )
}