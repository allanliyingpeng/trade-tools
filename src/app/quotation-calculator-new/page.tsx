'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Calculator } from 'lucide-react';
import QuotationCalculatorDialog from '../../components/QuotationCalculatorDialog';

export default function QuotationCalculatorNewPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            外贸报价计算器 - 弹窗版
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            采用修正算法的专业外贸报价计算工具，弹窗式设计，
            支持 EXW、FOB、CIF 贸易术语精确计算，实时汇率更新。
          </p>

          <div className="bg-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mb-8">
            <h2 className="text-xl font-semibold mb-4">🚀 算法升级亮点</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-medium text-green-600 mb-2">✅ 修正后的计算逻辑</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 反推算法确保精确利润率</li>
                  <li>• 价格 = 成本 ÷ (1 - 利润率%)</li>
                  <li>• 贸易术语层级关系清晰</li>
                  <li>• 佣金独立计算</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-600 mb-2">🎨 弹窗式设计</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 1100x700px 专业布局</li>
                  <li>• 左右分栏，信息结构清晰</li>
                  <li>• 响应式移动端适配</li>
                  <li>• 支持ESC键和遮罩关闭</li>
                </ul>
              </div>
            </div>
          </div>

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

      <QuotationCalculatorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}