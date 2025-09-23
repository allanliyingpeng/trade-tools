'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Calculator, RefreshCw, Download, Copy, RotateCcw, Save,
  Package, Truck, Currency, ChartBar, X, TrendingUp, Zap,
  DollarSign, Bookmark, PieChart, Target
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useExchangeRate } from '../hooks/useExchangeRate';

interface QuoteData {
  productCost: number;
  packagingCost: number;
  domesticShipping: number;
  exportCost: number;
  oceanFreight: number;
  insurance: number;
  targetMargin: number;
  commission: number;
  quantity: number;
  currency: string;
  exchangeRate: number;
  initialInvestment: number;
  expectedVolume: number;
}

interface QuoteResults {
  exw: {
    price: number;
    cost: number;
    profit: number;
    margin: number;
    commission: number;
  };
  fob: {
    price: number;
    cost: number;
    profit: number;
    margin: number;
    commission: number;
    exportCost: number;
  };
  cif: {
    price: number;
    cost: number;
    profit: number;
    margin: number;
    commission: number;
    freight: number;
    insurance: number;
  };
  basicCost: number;
  exportCost: number;
  totalQuantity: number;
  roi: {
    unitProfit: number;
    annualProfit: number;
    returnRate: number;
    paybackPeriod: number;
  };
}

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
];

interface QuotationCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 专业的稳定输入处理Hook - 解决输入中断Bug
const useStableInput = (initialValue = '0') => {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [numericValue, setNumericValue] = useState(parseFloat(initialValue) || 0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 立即更新显示值，让用户看到输入
    setDisplayValue(newValue);

    // 延迟解析数值，避免重新渲染中断输入
    setTimeout(() => {
      const parsed = parseFloat(newValue) || 0;
      setNumericValue(parsed);
    }, 0);
  }, []);

  const handleBlur = useCallback(() => {
    // 失去焦点时格式化显示并立即同步数值
    const parsed = parseFloat(displayValue) || 0;
    setNumericValue(parsed);

    if (displayValue && !isNaN(parsed)) {
      setDisplayValue(parsed.toString());
    }
  }, [displayValue]);

  const setValue = useCallback((value: string) => {
    setDisplayValue(value);
    const parsed = parseFloat(value) || 0;
    setNumericValue(parsed);
  }, []);

  return {
    displayValue,
    numericValue,
    inputRef,
    handleChange,
    handleBlur,
    setValue
  };
};

export default function QuotationCalculatorDialog({
  open,
  onOpenChange
}: QuotationCalculatorDialogProps) {
  const [currency, setCurrency] = useState('USD');
  const {
    rate: exchangeRate,
    loading: rateLoading,
    lastUpdate,
    error: rateError,
    isCached,
    updateRate
  } = useExchangeRate(currency, 'CNY');

  // 使用专业稳定输入组件
  const productCostInput = useStableInput('0');
  const packagingCostInput = useStableInput('0');
  const domesticShippingInput = useStableInput('0');
  const exportCostInput = useStableInput('0');
  const exportCostRateInput = useStableInput('5');
  const oceanFreightInput = useStableInput('0');
  const insuranceInput = useStableInput('0');
  const targetMarginInput = useStableInput('20');
  const commissionInput = useStableInput('0');
  const quantityInput = useStableInput('1');
  const initialInvestmentInput = useStableInput('0');
  const expectedVolumeInput = useStableInput('100');

  // 防止弹窗外部滚动影响，但不阻止弹窗内部滚动
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // 计算函数
  const calculateBasicCost = useCallback(() => {
    return productCostInput.numericValue +
           packagingCostInput.numericValue +
           domesticShippingInput.numericValue;
  }, [productCostInput.numericValue, packagingCostInput.numericValue, domesticShippingInput.numericValue]);

  const calculateExportCost = useCallback(() => {
    return exportCostInput.numericValue > 0
      ? exportCostInput.numericValue
      : calculateBasicCost() * (exportCostRateInput.numericValue / 100);
  }, [exportCostInput.numericValue, exportCostRateInput.numericValue, calculateBasicCost]);

  // 建议零售价计算
  const calculateSuggestedPrice = useCallback((type: 'exw' | 'fob' | 'cif'): number => {
    const basicCost = calculateBasicCost();
    const exportCost = calculateExportCost();
    const marginRate = targetMarginInput.numericValue / 100;

    switch (type) {
      case 'exw':
        return marginRate > 0 ? basicCost / (1 - marginRate) : basicCost;
      case 'fob':
        const fobCost = basicCost + exportCost;
        return marginRate > 0 ? fobCost / (1 - marginRate) : fobCost;
      case 'cif':
        const fobPrice = calculateSuggestedPrice('fob');
        return fobPrice + oceanFreightInput.numericValue + insuranceInput.numericValue;
      default:
        return 0;
    }
  }, [calculateBasicCost, calculateExportCost, targetMarginInput.numericValue, oceanFreightInput.numericValue, insuranceInput.numericValue]);

  const calculateExpectedProfit = useCallback(() => {
    const cifPrice = calculateSuggestedPrice('cif');
    const totalCost = calculateBasicCost() + calculateExportCost() +
                     oceanFreightInput.numericValue + insuranceInput.numericValue;
    return cifPrice - totalCost;
  }, [calculateSuggestedPrice, calculateBasicCost, calculateExportCost, oceanFreightInput.numericValue, insuranceInput.numericValue]);

  // 修正的计算逻辑
  const calculateQuotes = useCallback((): QuoteResults => {
    // 1. 基础成本计算
    const basicCost = calculateBasicCost();
    const exportCost = calculateExportCost();

    // 2. EXW价格计算 (包含目标利润率)
    const exwCost = basicCost;
    const exwPrice = targetMarginInput.numericValue > 0
      ? exwCost / (1 - targetMarginInput.numericValue / 100)
      : exwCost;
    const exwProfit = exwPrice - exwCost;
    const exwMargin = exwPrice > 0 ? (exwProfit / exwPrice) * 100 : 0;

    // 3. FOB价格计算
    const fobCost = exwCost + exportCost;
    const fobPrice = targetMarginInput.numericValue > 0
      ? fobCost / (1 - targetMarginInput.numericValue / 100)
      : fobCost;
    const fobProfit = fobPrice - fobCost;
    const fobMargin = fobPrice > 0 ? (fobProfit / fobPrice) * 100 : 0;

    // 4. CIF价格计算
    const cifCost = fobCost + oceanFreightInput.numericValue + insuranceInput.numericValue;
    const cifPrice = fobPrice + oceanFreightInput.numericValue + insuranceInput.numericValue;
    const cifProfit = cifPrice - cifCost;
    const cifMargin = cifPrice > 0 ? (cifProfit / cifPrice) * 100 : 0;

    // 5. 佣金计算
    const exwCommission = exwPrice * (commissionInput.numericValue / 100);
    const fobCommission = fobPrice * (commissionInput.numericValue / 100);
    const cifCommission = cifPrice * (commissionInput.numericValue / 100);

    // 6. 最终价格（包含佣金）
    const finalExwPrice = exwPrice + exwCommission;
    const finalFobPrice = fobPrice + fobCommission;
    const finalCifPrice = cifPrice + cifCommission;

    // 7. ROI计算
    const unitProfit = cifProfit;
    const annualProfit = unitProfit * expectedVolumeInput.numericValue;
    const returnRate = initialInvestmentInput.numericValue > 0
      ? (annualProfit / initialInvestmentInput.numericValue) * 100
      : 0;
    const paybackPeriod = initialInvestmentInput.numericValue > 0 && annualProfit > 0
      ? initialInvestmentInput.numericValue / annualProfit
      : Infinity;

    return {
      exw: {
        price: finalExwPrice,
        cost: exwCost,
        profit: exwProfit,
        margin: exwMargin,
        commission: exwCommission
      },
      fob: {
        price: finalFobPrice,
        cost: fobCost,
        profit: fobProfit,
        margin: fobMargin,
        commission: fobCommission,
        exportCost: exportCost
      },
      cif: {
        price: finalCifPrice,
        cost: cifCost,
        profit: cifProfit,
        margin: cifMargin,
        commission: cifCommission,
        freight: oceanFreightInput.numericValue,
        insurance: insuranceInput.numericValue
      },
      basicCost,
      exportCost,
      totalQuantity: quantityInput.numericValue,
      roi: {
        unitProfit,
        annualProfit,
        returnRate,
        paybackPeriod
      }
    };
  }, [calculateBasicCost, calculateExportCost, targetMarginInput.numericValue, oceanFreightInput.numericValue, insuranceInput.numericValue, commissionInput.numericValue, expectedVolumeInput.numericValue, initialInvestmentInput.numericValue, quantityInput.numericValue]);

  // 防抖计算结果 - 避免频繁重新渲染
  const [results, setResults] = useState(() => calculateQuotes());
  const calculateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (calculateTimeoutRef.current) {
      clearTimeout(calculateTimeoutRef.current);
    }

    calculateTimeoutRef.current = setTimeout(() => {
      setResults(calculateQuotes());
    }, 100); // 100ms防抖计算

    return () => {
      if (calculateTimeoutRef.current) {
        clearTimeout(calculateTimeoutRef.current);
      }
    };
  }, [calculateQuotes]);


  // 重置计算器
  const resetCalculator = useCallback(() => {
    productCostInput.setValue('0');
    packagingCostInput.setValue('0');
    domesticShippingInput.setValue('0');
    exportCostInput.setValue('0');
    exportCostRateInput.setValue('5');
    oceanFreightInput.setValue('0');
    insuranceInput.setValue('0');
    targetMarginInput.setValue('20');
    commissionInput.setValue('0');
    quantityInput.setValue('1');
    initialInvestmentInput.setValue('0');
    expectedVolumeInput.setValue('100');
  }, [productCostInput, packagingCostInput, domesticShippingInput, exportCostInput, exportCostRateInput, oceanFreightInput, insuranceInput, targetMarginInput, commissionInput, quantityInput, initialInvestmentInput, expectedVolumeInput]);

  // 保存模板
  const saveTemplate = () => {
    if (typeof window !== 'undefined') {
      const template = {
        productCost,
        packagingCost,
        domesticShipping,
        exportCost,
        exportCostRate,
        oceanFreight,
        insurance,
        targetMargin,
        commission,
        quantity,
        initialInvestment,
        expectedVolume,
        currency,
        timestamp: Date.now()
      };
      localStorage.setItem('quotation_template_dialog', JSON.stringify(template));
      alert('模板已保存！');
    }
  };

  // 加载模板
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quotation_template_dialog');
      if (saved) {
        try {
          const template = JSON.parse(saved);
          setProductCost(template.productCost || '0');
          setPackagingCost(template.packagingCost || '0');
          setDomesticShipping(template.domesticShipping || '0');
          setExportCost(template.exportCost || '0');
          setExportCostRate(template.exportCostRate || '5');
          setOceanFreight(template.oceanFreight || '0');
          setInsurance(template.insurance || '0');
          setTargetMargin(template.targetMargin || '20');
          setCommission(template.commission || '0');
          setQuantity(template.quantity || '1');
          setInitialInvestment(template.initialInvestment || '0');
          setExpectedVolume(template.expectedVolume || '100');
          if (template.currency) {
            setCurrency(template.currency);
          }
          // 更新解析值
          setParsedValues({
            productCost: parseFloat(template.productCost) || 0,
            packagingCost: parseFloat(template.packagingCost) || 0,
            domesticShipping: parseFloat(template.domesticShipping) || 0,
            exportCost: parseFloat(template.exportCost) || 0,
            oceanFreight: parseFloat(template.oceanFreight) || 0,
            insurance: parseFloat(template.insurance) || 0,
            targetMargin: parseFloat(template.targetMargin) || 20,
            commission: parseFloat(template.commission) || 0,
            quantity: parseFloat(template.quantity) || 1,
            initialInvestment: parseFloat(template.initialInvestment) || 0,
            expectedVolume: parseFloat(template.expectedVolume) || 100
          });
        } catch (e) {
          console.error('加载模板失败:', e);
        }
      }
    }
  }, [open]);

  // 解析所有输入值的对象
  const parsedValues = useMemo(() => ({
    productCost: productCostInput.numericValue,
    packagingCost: packagingCostInput.numericValue,
    domesticShipping: domesticShippingInput.numericValue,
    oceanFreight: oceanFreightInput.numericValue,
    insurance: insuranceInput.numericValue,
    targetMargin: targetMarginInput.numericValue,
    commission: commissionInput.numericValue,
    quantity: quantityInput.numericValue,
    initialInvestment: initialInvestmentInput.numericValue,
    expectedVolume: expectedVolumeInput.numericValue
  }), [
    productCostInput.numericValue,
    packagingCostInput.numericValue,
    domesticShippingInput.numericValue,
    oceanFreightInput.numericValue,
    insuranceInput.numericValue,
    targetMarginInput.numericValue,
    commissionInput.numericValue,
    quantityInput.numericValue,
    initialInvestmentInput.numericValue,
    expectedVolumeInput.numericValue
  ]);

  // 计算出口费用的memoized值
  const calculatedExportCost = useMemo(() => {
    return calculateExportCost();
  }, [calculateExportCost]);

  // 计算成本对象 - 用于导出和展示
  const costs = useMemo(() => ({
    productCost: parsedValues.productCost,
    packagingCost: parsedValues.packagingCost,
    domesticShipping: parsedValues.domesticShipping,
    exportCost: calculatedExportCost,
    oceanFreight: parsedValues.oceanFreight,
    insurance: parsedValues.insurance,
    targetMargin: parsedValues.targetMargin,
    commission: parsedValues.commission,
    quantity: parsedValues.quantity,
    initialInvestment: parsedValues.initialInvestment,
    expectedVolume: parsedValues.expectedVolume
  }), [parsedValues, calculatedExportCost]);

  // 导出报价单
  const exportQuote = () => {
    const quoteData = {
      currency,
      exchangeRate,
      costs,
      results,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    const dataStr = JSON.stringify(quoteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `外贸报价单_${currency}_${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 复制报价
  const copyResults = () => {
    const quoteText = `
外贸报价单 - 专业版
====================
货币: ${currency}
汇率: ${exchangeRate.toFixed(4)} CNY (更新: ${lastUpdate})

成本分析:
- 产品成本: ${currency} ${costs.productCost.toFixed(2)}
- 包装费: ${currency} ${costs.packagingCost.toFixed(2)}
- 国内运费: ${currency} ${costs.domesticShipping.toFixed(2)}
- 基础成本小计: ${currency} ${results.basicCost.toFixed(2)}

国际费用:
- 出口费用: ${currency} ${results.exportCost.toFixed(2)} (5%)
- 海运费: ${currency} ${costs.oceanFreight.toFixed(2)}
- 保险费: ${currency} ${costs.insurance.toFixed(2)}

报价结果:
┌─────────────────────────────────────────────┐
│ EXW (工厂交货)                              │
│ 价格: ${currency} ${results.exw.price.toFixed(2)} ${currency !== 'CNY' ? `(¥${(results.exw.price * exchangeRate).toFixed(2)})` : ''}│
│ 利润: ${currency} ${results.exw.profit.toFixed(2)} (${results.exw.margin.toFixed(1)}%)     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FOB (装运港船上交货)                        │
│ 价格: ${currency} ${results.fob.price.toFixed(2)} ${currency !== 'CNY' ? `(¥${(results.fob.price * exchangeRate).toFixed(2)})` : ''}│
│ 利润: ${currency} ${results.fob.profit.toFixed(2)} (${results.fob.margin.toFixed(1)}%)     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ CIF (成本保险费加运费)                      │
│ 价格: ${currency} ${results.cif.price.toFixed(2)} ${currency !== 'CNY' ? `(¥${(results.cif.price * exchangeRate).toFixed(2)})` : ''}│
│ 利润: ${currency} ${results.cif.profit.toFixed(2)} (${results.cif.margin.toFixed(1)}%)     │
└─────────────────────────────────────────────┘

${costs.commission > 0 ? `\n佣金设置: ${costs.commission}%` : ''}
目标利润率: ${costs.targetMargin}%
生成时间: ${new Date().toLocaleString('zh-CN')}
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(quoteText).then(() => {
        alert('报价单已复制到剪贴板！');
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = quoteText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('报价单已复制到剪贴板！');
    }
  };

  // 左侧输入区域 - 包含建议零售价展示
  const renderLeftInputSection = () => (
    <div className="space-y-6">
      {/* 建议零售价展示区域 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          建议零售价 (基于目标利润率 {targetMarginInput.numericValue.toFixed(1)}%)
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">EXW价格</div>
            <div className="text-lg font-bold text-blue-600">
              {currency} {calculateSuggestedPrice('exw').toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              成本: {currency} {calculateBasicCost().toFixed(2)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">FOB价格</div>
            <div className="text-lg font-bold text-green-600">
              {currency} {calculateSuggestedPrice('fob').toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              +出口: {currency} {calculateExportCost().toFixed(2)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">CIF价格</div>
            <div className="text-lg font-bold text-purple-600">
              {currency} {calculateSuggestedPrice('cif').toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              +运保: {currency} {(oceanFreightInput.numericValue + insuranceInput.numericValue).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-green-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">预期单品利润 (CIF):</span>
            <span className="font-semibold text-green-600">
              {currency} {calculateExpectedProfit().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      {/* 货币和汇率设置 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <Currency className="w-4 h-4 mr-2" />
          货币设置
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">货币</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">汇率到CNY</label>
            <div className="flex items-center space-x-2">
              <Input
                value={rateLoading ? '更新中...' : exchangeRate.toFixed(4)}
                readOnly
                className={`bg-gray-50 ${isCached ? 'border-orange-200' : 'border-gray-200'}`}
              />
              <Button size="sm" variant="outline" onClick={updateRate} disabled={rateLoading}>
                <RefreshCw className={`w-4 h-4 ${rateLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {lastUpdate && (
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs text-gray-500">{lastUpdate}</span>
                {isCached && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">缓存</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 产品成本 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <Package className="w-4 h-4 mr-2" />
          产品成本
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">产品成本</label>
              <Input
                type="text"
                inputMode="decimal"
                value={productCostInput.displayValue}
                onChange={productCostInput.handleChange}
                onBlur={productCostInput.handleBlur}
                ref={productCostInput.inputRef}
                placeholder="0.00"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">数量</label>
              <Input
                type="text"
                inputMode="numeric"
                value={quantityInput.displayValue}
                onChange={quantityInput.handleChange}
                onBlur={quantityInput.handleBlur}
                ref={quantityInput.inputRef}
                placeholder="1"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">包装费</label>
              <Input
                type="text"
                inputMode="decimal"
                value={packagingCostInput.displayValue}
                onChange={packagingCostInput.handleChange}
                onBlur={packagingCostInput.handleBlur}
                ref={packagingCostInput.inputRef}
                placeholder="0.00"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">国内运费</label>
              <Input
                type="text"
                inputMode="decimal"
                value={domesticShippingInput.displayValue}
                onChange={domesticShippingInput.handleChange}
                onBlur={domesticShippingInput.handleBlur}
                ref={domesticShippingInput.inputRef}
                placeholder="0.00"
                className="text-right"
              />
            </div>
          </div>

          {/* 新增：出口费用输入项 */}
          <div className="border-t border-gray-100 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  出口费用
                  <span className="text-xs text-gray-400 ml-1">(报关、商检等)</span>
                </label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={exportCostInput.displayValue}
                  onChange={exportCostInput.handleChange}
                  onBlur={exportCostInput.handleBlur}
                  ref={exportCostInput.inputRef}
                  placeholder="0.00"
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  或按比例 (%)
                  <span className="text-xs text-gray-400 ml-1">(基于基础成本)</span>
                </label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={exportCostRateInput.displayValue}
                  onChange={exportCostRateInput.handleChange}
                  onBlur={exportCostRateInput.handleBlur}
                  ref={exportCostRateInput.inputRef}
                  placeholder="5"
                  className="text-right"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              实际出口费用: {currency} {calculatedExportCost.toFixed(2)}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">基础成本</span>
              <span className="font-semibold text-gray-900">
                {currency} {results.basicCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 国际费用和利润设置 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <Truck className="w-4 h-4 mr-2" />
          国际费用 & 利润
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">海运费</label>
              <Input
                type="text"
                inputMode="decimal"
                value={oceanFreightInput.displayValue}
                onChange={oceanFreightInput.handleChange}
                onBlur={oceanFreightInput.handleBlur}
                ref={oceanFreightInput.inputRef}
                placeholder="0.00"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">保险费</label>
              <Input
                type="text"
                inputMode="decimal"
                value={insuranceInput.displayValue}
                onChange={insuranceInput.handleChange}
                onBlur={insuranceInput.handleBlur}
                ref={insuranceInput.inputRef}
                placeholder="0.00"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">目标利润率 (%)</label>
              <Input
                type="text"
                inputMode="decimal"
                value={targetMarginInput.displayValue}
                onChange={targetMarginInput.handleChange}
                onBlur={targetMarginInput.handleBlur}
                ref={targetMarginInput.inputRef}
                placeholder="20"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">佣金 (%)</label>
              <Input
                type="text"
                inputMode="decimal"
                value={commissionInput.displayValue}
                onChange={commissionInput.handleChange}
                onBlur={commissionInput.handleBlur}
                ref={commissionInput.inputRef}
                placeholder="0"
                className="text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 新增：ROI投资分析 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          ROI 投资分析
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                初始投资
                <span className="text-xs text-gray-400 ml-1">(开发、样品等)</span>
              </label>
              <Input
                type="text"
                inputMode="decimal"
                value={initialInvestmentInput.displayValue}
                onChange={initialInvestmentInput.handleChange}
                onBlur={initialInvestmentInput.handleBlur}
                ref={initialInvestmentInput.inputRef}
                placeholder="0.00"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                预期订单量
                <span className="text-xs text-gray-400 ml-1">(年订单数量)</span>
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={expectedVolumeInput.displayValue}
                onChange={expectedVolumeInput.handleChange}
                onBlur={expectedVolumeInput.handleBlur}
                ref={expectedVolumeInput.inputRef}
                placeholder="100"
                className="text-right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 右侧结果展示 - 全新横向高效设计
  const renderRightResultSection = () => (
    <div className="space-y-4">
      {/* 实时汇率显示 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">实时汇率</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-orange-600">{exchangeRate.toFixed(4)}</span>
            <span className="text-sm text-gray-500"> CNY → {currency}</span>
            <Button size="sm" variant="ghost" onClick={updateRate} disabled={rateLoading}>
              <RefreshCw className={`w-4 h-4 ${rateLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* 贸易术语对比 - 横向网格布局 */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          报价结果对比
        </h3>

        {/* 表格式横向布局 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">贸易术语</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">（{currency}）建议零售价</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">成本</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">利润</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">利润率</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">（RMB）折算人民币</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">EXW</span>
                    <span className="font-medium">工厂交货</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-bold text-blue-600">
                  {results.exw.price.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right">{results.exw.cost.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-green-600 font-medium">
                  {results.exw.profit.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right text-green-600 font-medium">
                  {results.exw.margin.toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-right text-gray-600">
                  ¥{(results.exw.price * exchangeRate).toFixed(2)}
                </td>
              </tr>

              {/* FOB 行 */}
              <tr className="hover:bg-green-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">FOB</span>
                    <span className="text-sm font-medium text-gray-900">装运港船上交货</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-lg font-bold text-green-600">
                    {results.fob.price.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-600">
                  {results.fob.cost.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-sm text-green-600">
                  {results.fob.profit.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                    {results.fob.margin.toFixed(1)}%
                  </span>
                </td>
                {currency !== 'CNY' && (
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    ¥{(results.fob.price * exchangeRate).toFixed(2)}
                  </td>
                )}
              </tr>

              {/* CIF 行 */}
              <tr className="hover:bg-purple-50/50 transition-colors bg-purple-50/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-medium">CIF</span>
                    <span className="text-sm font-medium text-gray-900">成本保险费加运费</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-lg font-bold text-purple-600">
                    {results.cif.price.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-600">
                  {results.cif.cost.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-sm text-green-600">
                  {results.cif.profit.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                    {results.cif.margin.toFixed(1)}%
                  </span>
                </td>
                {currency !== 'CNY' && (
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    ¥{(results.cif.price * exchangeRate).toFixed(2)}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 佣金显示 */}
        {costs.commission > 0 && (
          <div className="bg-orange-50 px-4 py-3 border-t border-orange-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-800 font-medium">
                含佣金 ({costs.commission.toFixed(1)}%)
              </span>
              <div className="text-orange-600 space-x-4">
                <span>EXW: {currency} {results.exw.commission.toFixed(2)}</span>
                <span>FOB: {currency} {results.fob.commission.toFixed(2)}</span>
                <span>CIF: {currency} {results.cif.commission.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 详细成本结构分析表格 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <ChartBar className="w-4 h-4 mr-2" />
            成本结构分析
            <span className="ml-2 text-xs text-gray-500">(基于 CIF 价格)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">成本项目</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">金额 ({currency})</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">占比</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">可视化</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  name: '产品成本',
                  value: costs.productCost,
                  color: 'bg-blue-500',
                  textColor: 'text-blue-600'
                },
                {
                  name: '包装费用',
                  value: costs.packagingCost,
                  color: 'bg-green-500',
                  textColor: 'text-green-600'
                },
                {
                  name: '国内运费',
                  value: costs.domesticShipping,
                  color: 'bg-yellow-500',
                  textColor: 'text-yellow-600'
                },
                {
                  name: '出口费用',
                  value: results.exportCost,
                  color: 'bg-orange-500',
                  textColor: 'text-orange-600'
                },
                {
                  name: '海运费',
                  value: costs.oceanFreight,
                  color: 'bg-cyan-500',
                  textColor: 'text-cyan-600'
                },
                {
                  name: '保险费',
                  value: costs.insurance,
                  color: 'bg-purple-500',
                  textColor: 'text-purple-600'
                }
              ].map((item, index) => {
                const percentage = results.cif.price > 0 ? (item.value / results.cif.price * 100) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${item.textColor}`}>
                        {item.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium">
                      {item.value.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px] ml-auto">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* 利润行 */}
              <tr className="bg-green-50 border-t-2 border-green-200">
                <td className="py-3 px-4">
                  <span className="text-sm font-bold text-green-700">总利润</span>
                </td>
                <td className="py-3 px-4 text-right text-sm font-bold text-green-600">
                  {results.cif.profit.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold">
                    {results.cif.margin.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px] ml-auto">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${Math.min(results.cif.margin, 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI 投资分析结果 */}
      {costs.initialInvestment > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
            ROI 投资回收分析
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500 mb-1">单笔订单利润</div>
              <div className="text-lg font-bold text-green-600">
                {currency} {(results.cif.profit * parsedValues.quantity).toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500 mb-1">投资回收周期</div>
              <div className="text-lg font-bold text-indigo-600">
                {results.cif.profit > 0
                  ? Math.ceil(costs.initialInvestment / (results.cif.profit * parsedValues.quantity)).toLocaleString()
                  : '∞'
                } 笔订单
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500 mb-1">ROI 回报率</div>
              <div className="text-lg font-bold text-purple-600">
                {costs.initialInvestment > 0
                  ? ((results.cif.profit * parsedValues.quantity / costs.initialInvestment) * 100).toFixed(1)
                  : '0'
                }%
              </div>
              <div className="text-xs text-gray-400">每笔订单</div>
            </div>
          </div>

          {costs.expectedVolume > 0 && (
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-xs text-gray-500 mb-1">年度预期利润</div>
                  <div className="text-xl font-bold text-green-600">
                    {currency} {(results.cif.profit * parsedValues.quantity * costs.expectedVolume).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">
                    基于 {costs.expectedVolume.toLocaleString()} 笔订单
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-xs text-gray-500 mb-1">年度 ROI</div>
                  <div className="text-xl font-bold text-purple-600">
                    {costs.initialInvestment > 0
                      ? ((results.cif.profit * parsedValues.quantity * costs.expectedVolume / costs.initialInvestment) * 100).toFixed(1)
                      : '0'
                    }%
                  </div>
                  <div className="text-xs text-gray-400">投资回报率</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="
            fixed z-50
            top-1/2 left-1/2
            transform -translate-x-1/2 -translate-y-1/2
            w-[95vw] max-w-7xl
            h-[90vh] max-h-[700px]
            bg-white rounded-xl shadow-2xl
            border-0 p-0 m-0
            overflow-hidden
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
            duration-200
          "
        >
        {/* 弹窗头部 */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <DialogPrimitive.Title className="text-xl font-semibold">外贸报价计算器 - 专业版</DialogPrimitive.Title>
                <p className="text-blue-100 text-sm">精确计算 EXW / FOB / CIF 贸易术语报价</p>
              </div>
            </div>
            <DialogPrimitive.Close className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </DialogPrimitive.Close>
          </div>
        </div>

        {/* 主体内容 - 修复背景 */}
        <div className="flex h-[calc(100%-140px)] bg-gray-50">
          {/* 左侧输入区 */}
          <div className="w-[450px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              {renderLeftInputSection()}
            </div>
          </div>

          {/* 右侧结果区 - 白色背景 */}
          <div className="flex-1 bg-white overflow-y-auto">
            <div className="p-6">
              {renderRightResultSection()}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetCalculator}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button variant="outline" onClick={saveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              保存模板
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button onClick={exportQuote}>
              <Download className="w-4 h-4 mr-2" />
              导出报价单
            </Button>
            <Button variant="secondary" onClick={copyResults}>
              <Copy className="w-4 h-4 mr-2" />
              复制结果
            </Button>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}