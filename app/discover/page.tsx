"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWalletStore } from "@/lib/wallet-store"

export default function DiscoverPage() {
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
      <h1 className="text-2xl font-bold mb-6">Discover</h1>
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-lg p-6">
        <p className="text-gray-300">
          Welcome to the Discover page. Here you can explore new tokens and trading opportunities.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#252542] border border-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Featured Token #{i}</h3>
              <p className="text-sm text-gray-400">
                Explore this trending token with high trading volume and potential.
              </p>
              <button className="mt-4 bg-[#6366f1] hover:bg-[#5254cc] text-white px-4 py-2 rounded-md text-sm font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
