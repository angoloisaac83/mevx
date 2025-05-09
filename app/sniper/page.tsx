"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWalletStore } from "@/lib/wallet-store"

export default function SniperPage() {
  const router = useRouter()
  const { isConnected } = useWalletStore()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0e0e16] text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Sniper</h1>
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-lg p-6">
        <p className="text-gray-300">
          Welcome to the Sniper page. Here you can set up automated trading for new token launches.
        </p>
        <div className="mt-6 space-y-4">
          <div className="bg-[#252542] border border-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">Token Address</h3>
            <input
              type="text"
              placeholder="Enter token address to snipe"
              className="w-full bg-[#1a1a2e] border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
            />
          </div>

          <div className="bg-[#252542] border border-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">Buy Amount</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0.0"
                className="flex-1 bg-[#1a1a2e] border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
              />
              <select className="bg-[#1a1a2e] border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6366f1]">
                <option>SOL</option>
                <option>ETH</option>
                <option>USDC</option>
              </select>
            </div>
          </div>

          <div className="bg-[#252542] border border-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">Sniper Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Sell</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Take Profit</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stop Loss</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#6366f1] hover:bg-[#5254cc] text-white px-4 py-3 rounded-md text-sm font-medium">
            Set Up Sniper
          </button>
        </div>
      </div>
    </div>
  )
}
