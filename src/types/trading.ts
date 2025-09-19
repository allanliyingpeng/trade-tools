export interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
}

export interface OrderBook {
  symbol: string
  bids: [number, number][] // [price, quantity]
  asks: [number, number][] // [price, quantity]
  timestamp: number
}

export interface OrderRequest {
  symbol: string
  type: 'market' | 'limit'
  side: 'buy' | 'sell'
  quantity: number
  price?: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
}

export interface Order extends OrderRequest {
  id: string
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  filledQuantity: number
  averagePrice?: number
  createdAt: string
  updatedAt: string
}

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  timestamp: number
}

export interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TradingStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  totalVolume: number
  averageWin: number
  averageLoss: number
  maxDrawdown: number
}