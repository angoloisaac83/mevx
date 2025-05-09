"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type WalletStore = {
  isConnected: boolean
  walletType: string | null
  walletName: string | null
  setWalletConnected: (connected: boolean) => void
  setWalletInfo: (type: string, name: string) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      isConnected: false,
      walletType: null,
      walletName: null,
      setWalletConnected: (connected) => set({ isConnected: connected }),
      setWalletInfo: (type, name) => set({ walletType: type, walletName: name }),
      disconnect: () => set({ isConnected: false, walletType: null, walletName: null }),
    }),
    {
      name: "wallet-storage",
    },
  ),
)
