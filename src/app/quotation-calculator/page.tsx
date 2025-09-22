import QuotationCalculator from '../../components/QuotationCalculator';

export const metadata = {
  title: '外贸报价计算器 - 专业版 | 外贸工具箱',
  description: '专业的外贸报价计算器，支持 EXW、FOB、CIF 贸易术语报价计算，实时汇率更新，成本结构分析。',
  keywords: '外贸报价,EXW,FOB,CIF,贸易术语,汇率计算,成本分析'
};

export default function QuotationCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <QuotationCalculator />
    </div>
  );
}