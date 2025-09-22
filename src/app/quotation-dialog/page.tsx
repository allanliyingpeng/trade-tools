'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Calculator, FileText, TrendingUp } from 'lucide-react';
import QuotationCalculatorDialog from '../../components/QuotationCalculatorDialog';

export default function QuotationDialogPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-12">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            外贸报价计算器 - 弹窗版
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专业的外贸报价计算工具，支持 EXW、FOB、CIF 贸易术语，
            实时汇率更新，精确利润分析，弹窗式设计更便于使用。
          </p>
        </div>

        {/* 功能特色 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">修正算法逻辑</h3>
            <p className="text-gray-600">
              采用反推算法确保利润率准确，EXW、FOB、CIF 价格计算更加科学合理，
              支持佣金计算和成本结构分析。
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">弹窗式设计</h3>
            <p className="text-gray-600">
              1100x700px 弹窗布局，左右分栏设计，响应式适配移动端，
              现代化UI界面，支持 ESC 键关闭和遮罩点击关闭。
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">实时汇率</h3>
            <p className="text-gray-600">
              双重缓存机制（客户端10分钟+服务端30分钟），
              支持15种国际货币，智能降级到模拟数据，确保高可用性。
            </p>
          </div>
        </div>

        {/* 算法改进说明 */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">算法逻辑改进</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">❌ 旧版本问题</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 利润率计算不准确</li>
                <li>• 成本加成方式导致目标利润率偏差</li>
                <li>• FOB和CIF价格关系不合理</li>
                <li>• 佣金计算逻辑混乱</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-green-600">✅ 新版本改进</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 反推算法确保精确利润率</li>
                <li>• 价格 = 成本 ÷ (1 - 利润率%)</li>
                <li>• 贸易术语层级递进关系清晰</li>
                <li>• 佣金独立计算，支持百分比设置</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 计算公式说明 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">核心计算公式</h2>
          <div className="bg-white rounded-lg p-6 font-mono text-sm">
            <div className="space-y-3 text-gray-800">
              <div><span className="text-blue-600 font-semibold">基础成本</span> = 产品成本 + 包装费 + 国内运费</div>
              <div><span className="text-blue-600 font-semibold">出口费用</span> = 基础成本 × 5%</div>
              <div className="border-t pt-3 mt-3">
                <div><span className="text-green-600 font-semibold">EXW价格</span> = 基础成本 ÷ (1 - 目标利润率%)</div>
                <div><span className="text-green-600 font-semibold">FOB价格</span> = (基础成本 + 出口费用) ÷ (1 - 目标利润率%)</div>
                <div><span className="text-green-600 font-semibold">CIF价格</span> = FOB价格 + 海运费 + 保险费</div>
              </div>
              <div className="border-t pt-3 mt-3">
                <div><span className="text-orange-600 font-semibold">最终价格</span> = 基础价格 + 佣金 (基础价格 × 佣金%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 启动按钮 */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Calculator className="w-6 h-6 mr-3" />
            打开报价计算器
          </Button>
          <p className="text-gray-500 mt-4">
            点击打开专业版外贸报价计算器弹窗
          </p>
        </div>
      </div>

      {/* 报价计算器弹窗 */}
      <QuotationCalculatorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}