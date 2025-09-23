'use client';

import { useState } from 'react';
import QuotationCalculatorDialog from '../../components/QuotationCalculatorDialog';
import { Button } from '../../components/ui/button';
import { Calculator } from 'lucide-react';

export default function QuotationCalculatorPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">外贸报价计算器</h1>
          <p className="text-lg text-gray-600 mb-8">专业的外贸报价计算器，支持 EXW、FOB、CIF 贸易术语报价计算</p>
          <Button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-lg"
          >
            <Calculator className="w-5 h-5" />
            开始计算报价
          </Button>
        </div>
      </div>
      <QuotationCalculatorDialog open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}