// 全局缓存存储 - 所有用户共享
interface CacheItem {
  rates: any;
  timestamp: number;
  lastAPICall: string;
  apiCallCount: number;
  isExpired?: boolean;
  cacheAge?: number;
  status?: 'fresh' | 'stale';
}

class ExchangeRateCache {
  private static instance: ExchangeRateCache;
  private cache = new Map<string, CacheItem>();

  // 缓存配置
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6小时主缓存
  private readonly FALLBACK_DURATION = 24 * 60 * 60 * 1000; // 24小时降级缓存
  private readonly MAX_CACHE_SIZE = 100; // 最大缓存条目数

  public static getInstance(): ExchangeRateCache {
    if (!ExchangeRateCache.instance) {
      ExchangeRateCache.instance = new ExchangeRateCache();
    }
    return ExchangeRateCache.instance;
  }

  // 生成缓存键
  private getCacheKey(from: string, to: string): string {
    return `${from.toUpperCase()}_${to.toUpperCase()}`;
  }

  // 检查缓存是否有效
  public isValid(from: string, to: string): boolean {
    const key = this.getCacheKey(from, to);
    const item = this.cache.get(key);

    if (!item) return false;

    const now = Date.now();
    return (now - item.timestamp) < this.CACHE_DURATION;
  }

  // 获取缓存数据
  public get(from: string, to: string): CacheItem | null {
    const key = this.getCacheKey(from, to);
    const item = this.cache.get(key);

    if (!item) return null;

    const now = Date.now();
    const age = now - item.timestamp;

    // 检查是否在降级期内
    if (age < this.FALLBACK_DURATION) {
      return {
        ...item,
        isExpired: age >= this.CACHE_DURATION,
        cacheAge: Math.round(age / 1000 / 60), // 分钟
        status: age < this.CACHE_DURATION ? 'fresh' : 'stale'
      };
    }

    // 完全过期，删除缓存
    this.cache.delete(key);
    return null;
  }

  // 设置缓存
  public set(from: string, to: string, data: any): void {
    const key = this.getCacheKey(from, to);
    const now = Date.now();

    // 获取之前的API调用次数
    const existing = this.cache.get(key);
    const apiCallCount = (existing?.apiCallCount || 0) + 1;

    this.cache.set(key, {
      rates: data,
      timestamp: now,
      lastAPICall: data.time_last_update_utc || new Date().toISOString(),
      apiCallCount
    });

    console.log(`💾 缓存更新: ${key} (第${apiCallCount}次API调用)`);

    // 清理过期缓存
    this.cleanup();
  }

  // 清理过期缓存，防止内存泄露
  private cleanup(): void {
    if (this.cache.size <= this.MAX_CACHE_SIZE) return;

    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.FALLBACK_DURATION) {
        toDelete.push(key);
      }
    }

    toDelete.forEach(key => {
      this.cache.delete(key);
      console.log(`🗑️ 清理过期缓存: ${key}`);
    });

    // 如果还是太多，删除最旧的缓存
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp);

      const deleteCount = this.cache.size - this.MAX_CACHE_SIZE;
      for (let i = 0; i < deleteCount; i++) {
        this.cache.delete(entries[i][0]);
        console.log(`🗑️ 清理旧缓存: ${entries[i][0]}`);
      }
    }
  }

  // 获取缓存统计信息
  public getStats(): object {
    const now = Date.now();
    const stats = {
      totalCached: this.cache.size,
      fresh: 0,
      stale: 0,
      totalAPICalls: 0
    };

    for (const [key, item] of this.cache.entries()) {
      const age = now - item.timestamp;
      if (age < this.CACHE_DURATION) {
        stats.fresh++;
      } else {
        stats.stale++;
      }
      stats.totalAPICalls += item.apiCallCount;
    }

    return stats;
  }

  // 清空缓存（调试用）
  public clear(): void {
    this.cache.clear();
    console.log('🗑️ 所有缓存已清空');
  }
}

export default ExchangeRateCache;