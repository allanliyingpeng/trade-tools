"use client"

import { useState } from "react"

export function TradingPanel() {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement trading logic
    console.log("Trade order:", { orderType, amount, price })
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">交易面板</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setOrderType("buy")}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            orderType === "buy"
              ? "bg-green-600 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          买入
        </button>
        <button
          onClick={() => setOrderType("sell")}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            orderType === "sell"
              ? "bg-red-600 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          卖出
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            数量
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="输入交易数量"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            价格
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="输入交易价格"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            orderType === "buy"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {orderType === "buy" ? "买入" : "卖出"}
        </button>
      </form>
    </div>
  )
}