import { useState, useEffect, useCallback } from 'react';

interface ExchangeRateData {
  success: boolean;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  convertedAmount: number;
  originalAmount: number;
  lastUpdate: string;
  nextUpdate?: string;
  cached: boolean;
  fresh: boolean;
  fallback?: boolean;
  cacheAge?: number;
  apiCallCount?: number;
  nextRefresh?: string;
  message: string;
  error?: string;
}

interface UseExchangeRateReturn {
  data: ExchangeRateData | null;
  loading: boolean;
  error: string | null;
  refreshRate: () => void;
  isCached: boolean;
  isFresh: boolean;
  isFallback: boolean;
  cacheAge: number;
  apiCallCount: number;
  nextRefresh?: string;
  message: string;
}

export const useExchangeRate = (from: string, to: string, amount: string): UseExchangeRateReturn => {
  const [data, setData] = useState<ExchangeRateData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchRate = useCallback(async (forceRefresh = false) => {
    if (!from || !to || !amount) return;

    // 防抖：避免重复请求（1秒内的重复请求直接忽略）
    const now = Date.now();
    if (!forceRefresh && now - lastFetch < 1000) {
      return;
    }

    setLoading(true);
    setError(null);
    setLastFetch(now);

    try {
      const url = `/api/exchange-rate?from=${from}&to=${to}&amount=${amount}${forceRefresh ? '&fresh=true' : ''}`;

      console.log(`🔍 前端请求汇率: ${from}→${to}, 强制刷新: ${forceRefresh}`);

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setData(result);
        console.log(`✅ 前端获取成功: ${from}→${to}, 缓存: ${result.cached}, 新鲜: ${result.fresh}`);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('❌ 前端请求失败:', err);
    } finally {
      setLoading(false);
    }
  }, [from, to, amount, lastFetch]);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchRate();
  }, [from, to, amount]); // 移除 fetchRate 依赖，避免循环

  // 手动刷新（强制获取最新数据）
  const refreshRate = useCallback(() => {
    fetchRate(true);
  }, [fetchRate]);

  return {
    data,
    loading,
    error,
    refreshRate,
    // 缓存状态指示器
    isCached: data?.cached || false,
    isFresh: data?.fresh || false,
    isFallback: data?.fallback || false,
    cacheAge: data?.cacheAge || 0,
    apiCallCount: data?.apiCallCount || 0,
    nextRefresh: data?.nextRefresh,
    message: data?.message || ''
  };
};