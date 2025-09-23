import { useState, useEffect } from 'react';

interface ExchangeRateData {
  rate: number;
  loading: boolean;
  lastUpdate: string;
  error: string | null;
  isCached: boolean;
  updateRate: () => void;
}

export const useExchangeRate = (fromCurrency: string, toCurrency: string = 'CNY'): ExchangeRateData => {
  const [rate, setRate] = useState<number>(7.2);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);

  const getCacheKey = (from: string, to: string) => `exchange_rate_${from}_${to}`;
  const CLIENT_CACHE_DURATION = 10 * 60 * 1000; // 客户端缓存10分钟

  const updateRate = async (forceUpdate = false) => {
    const cacheKey = getCacheKey(fromCurrency, toCurrency);
    const now = Date.now();

    // 检查客户端缓存
    if (!forceUpdate && typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          if (now - cachedData.timestamp < CLIENT_CACHE_DURATION) {
            console.log(`客户端缓存命中: ${fromCurrency}->${toCurrency}`);
            setRate(cachedData.rate);
            setLastUpdate(cachedData.lastUpdate);
            setIsCached(true);
            setError(null);
            return; // 使用客户端缓存，无需API调用
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`请求汇率API: ${fromCurrency}->${toCurrency}`);
      const response = await fetch(
        `/api/exchange-rate?from=${fromCurrency}&to=${toCurrency}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRate(data.rate);
        const updateTime = data.lastUpdate ? new Date(data.lastUpdate).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN');
        setLastUpdate(updateTime);
        setIsCached(data.cached || false);

        // 更新客户端缓存
        if (typeof window !== 'undefined') {
          const cacheData = {
            rate: data.rate,
            lastUpdate: updateTime,
            timestamp: now
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        }

      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || '汇率更新失败');
      console.error('汇率更新错误:', err);

      // 尝试使用过期的客户端缓存
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            setRate(cachedData.rate);
            setLastUpdate(cachedData.lastUpdate + ' (缓存)');
            setIsCached(true);
            setError('网络错误，使用缓存数据');
          } catch (e) {
            // 缓存也无效
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取汇率（可能使用缓存）
  useEffect(() => {
    updateRate();
  }, [fromCurrency, toCurrency]);

  // 手动强制更新
  const forceUpdate = () => updateRate(true);

  return {
    rate,
    loading,
    lastUpdate,
    error,
    isCached,
    updateRate: forceUpdate
  };
};