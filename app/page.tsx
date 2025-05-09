"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  ChevronDown,
  Info,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  AlertTriangle,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"
import WalletConnectModal from "@/components/wallet-connect-modal"
import TokenDetailModal from "@/components/token-detail-modal"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import { useWalletStore } from "@/lib/wallet-store"
import { toast } from "@/hooks/use-toast"

// Filter types
const FILTER_TYPES = {
  TRENDING: "TRENDING",
  NEW_PAIRS: "NEW_PAIRS",
  MEME_ZONE: "MEME_ZONE",
  HOT: "HOT",
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showInfoBanner, setShowInfoBanner] = useState(true)
  const router = useRouter()
  const { isConnected } = useWalletStore()
  const [tokenData, setTokenData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.TRENDING)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // First try to fetch from the real API
        let response = await fetch("/api/tokens")

        // If that fails, use the mock API
        if (!response.ok) {
          console.log("Using mock token data instead")
          response = await fetch("/api/mock-tokens")
        }

        if (response.ok) {
          const data = await response.json()
          setTokenData(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch token data:", error)

        // Try mock data as fallback
        try {
          const mockResponse = await fetch("/api/mock-tokens")
          if (mockResponse.ok) {
            const mockData = await mockResponse.json()
            setTokenData(mockData.data || [])
          }
        } catch (mockError) {
          console.error("Failed to fetch mock token data:", mockError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTokenData()
  }, [])

  const handleNavClick = (path) => {
    if (!isConnected) {
      toast.warning("Connect your wallet first", {
        description: "You need to connect your wallet to access this feature.",
      })
      setShowWalletModal(true)
    } else {
      router.push(path)
    }
  }

  // Filter and search logic
  const filteredTokens = useMemo(() => {
    // First apply search filter
    let filtered = tokenData
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = tokenData.filter(
        (token) =>
          token.pairData?.baseToken?.name?.toLowerCase().includes(query) ||
          token.pairData?.baseToken?.symbol?.toLowerCase().includes(query) ||
          token.profile?.tokenAddress?.toLowerCase().includes(query),
      )
    }

    // Then apply tab filter
    switch (activeFilter) {
      case FILTER_TYPES.TRENDING:
        // Sort by volume
        return [...filtered].sort((a, b) => (b.pairData?.volume?.h24 || 0) - (a.pairData?.volume?.h24 || 0))
      case FILTER_TYPES.NEW_PAIRS:
        // Sort by creation date (newest first)
        return [...filtered].sort((a, b) => (b.pairData?.pairCreatedAt || 0) - (a.pairData?.pairCreatedAt || 0))
      case FILTER_TYPES.MEME_ZONE:
        // Filter tokens that might be meme coins (based on name or description)
        return filtered.filter((token) => {
          const name = token.pairData?.baseToken?.name?.toLowerCase() || ""
          const symbol = token.pairData?.baseToken?.symbol?.toLowerCase() || ""
          const description = token.profile?.description?.toLowerCase() || ""
          const memeKeywords = ["meme", "doge", "shib", "pepe", "coin", "moon", "elon", "inu", "cat", "dog", "frog"]
          return memeKeywords.some(
            (keyword) => name.includes(keyword) || symbol.includes(keyword) || description.includes(keyword),
          )
        })
      case FILTER_TYPES.HOT:
        // Sort by price change (highest first)
        return [...filtered].sort((a, b) => (b.pairData?.priceChange?.h24 || 0) - (a.pairData?.priceChange?.h24 || 0))
      default:
        return filtered
    }
  }, [tokenData, activeFilter, searchQuery])

  // Pagination logic
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage)
  const paginatedTokens = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredTokens.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTokens, currentPage, itemsPerPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBuyClick = (e, token) => {
    e.stopPropagation()
    if (!isConnected) {
      toast.info("Please connect your wallet to proceed with purchase")
      setShowWalletModal(true)
    } else {
      // If connected, show insufficient balance message
      toast.error(
        <div>
          <p>Insufficient SOL balance in your wallet!</p>
          <p className="text-sm">You need at least 0.005 SOL (incl. fee) to make this purchase</p>
        </div>,
      )
    }
  }

  const handleWalletConnectSuccess = () => {
    toast.success(
      <div>
        <p>Wallet connected successfully</p>
        <p className="text-sm">You need at least 0.005 SOL (incl. fee) to make purchases</p>
      </div>,
    )
    setShowWalletModal(false)
  }

  return (
    <div className="min-h-screen bg-[#0e0e16] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-[#6366f1]">MEVX</span>
          </Link>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search or Snipe"
              className="bg-[#1a1a2e] rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <NavItem label="DISCOVER" hasDropdown onClick={() => handleNavClick("/discover")} />
          <NavItem label="SNIPER" hasDropdown onClick={() => handleNavClick("/sniper")} />
          <NavItem label="EARN" hasDropdown onClick={() => handleNavClick("/earn")} />
          <NavItem label="COPY TRADE" onClick={() => handleNavClick("/copy-trade")} />
          <NavItem label="PORTFOLIO" onClick={() => handleNavClick("/portfolio")} />
          <NavItem label="MULTI CHART" onClick={() => handleNavClick("/multi-chart")} />
          <NavItem label="WALLET TRACKER" onClick={() => handleNavClick("/wallet-tracker")} />
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-1 text-sm">
            <span className="text-gray-300">SOL</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          <button
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-3 py-1.5 text-xs md:text-sm md:px-4 rounded-md font-medium"
            onClick={() => setShowWalletModal(true)}
          >
            {isConnected ? "Connected" : "Connect"}
          </button>
          <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu className="h-6 w-6 text-gray-300" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#1a1a2e] border-b border-gray-800">
          <div className="p-3 space-y-3">
            <MobileNavItem label="DISCOVER" onClick={() => handleNavClick("/discover")} />
            <MobileNavItem label="SNIPER" onClick={() => handleNavClick("/sniper")} />
            <MobileNavItem label="EARN" onClick={() => handleNavClick("/earn")} />
            <MobileNavItem label="COPY TRADE" onClick={() => handleNavClick("/copy-trade")} />
            <MobileNavItem label="PORTFOLIO" onClick={() => handleNavClick("/portfolio")} />
            <MobileNavItem label="MULTI CHART" onClick={() => handleNavClick("/multi-chart")} />
            <MobileNavItem label="WALLET TRACKER" onClick={() => handleNavClick("/wallet-tracker")} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-3 md:p-4">
        {/* Info Banner */}
        {showInfoBanner && (
          <div className="bg-[#1a1a2e] border border-[#6366f1]/30 rounded-lg p-3 mb-4 flex items-start gap-3">
            <div className="text-[#6366f1] mt-0.5">
              <Info className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">Welcome to MEVX - The Ultimate Trading Platform</h3>
              <p className="text-xs text-gray-300 mb-2">
                MEVX provides advanced tools for trading on Solana and other blockchains. Connect your wallet to access
                all features.
              </p>
              <div className="flex gap-2">
                <button
                  className="text-xs bg-[#6366f1] hover:bg-[#5254cc] px-3 py-1 rounded"
                  onClick={() => setShowWalletModal(true)}
                >
                  Connect Wallet
                </button>
                <button
                  className="text-xs bg-transparent hover:bg-gray-800 px-3 py-1 rounded border border-gray-700"
                  onClick={() => setShowInfoBanner(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Platform Introduction */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Cryptocurrency Trading & Sniper Platform</h1>
          <p className="text-sm text-gray-300 mb-4">
            Discover, analyze, and trade the latest tokens across multiple blockchains. MEVX provides real-time data and
            advanced trading tools to help you maximize your profits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <FeatureCard
              icon={<TrendingUp className="h-5 w-5 text-[#6366f1]" />}
              title="Real-time Market Data"
              description="Access up-to-the-minute price data, liquidity information, and trading volumes for thousands of tokens."
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5 text-[#6366f1]" />}
              title="Advanced Sniping Tools"
              description="Be the first to trade new tokens with our high-speed sniping tools and automated trading features."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5 text-[#6366f1]" />}
              title="Security & Protection"
              description="Trade with confidence using our built-in security features and token audit information."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Trending Pools */}
          <PoolSection
            title="Trending Pools"
            icon="🔥"
            data={tokenData.sort((a, b) => (b.pairData?.volume?.h24 || 0) - (a.pairData?.volume?.h24 || 0)).slice(0, 5)}
            loading={loading}
            onTokenClick={setSelectedToken}
          />

          {/* New Pools */}
          <PoolSection
            title="New Pools"
            icon="🚀"
            data={tokenData
              .sort((a, b) => (b.pairData?.pairCreatedAt || 0) - (a.pairData?.pairCreatedAt || 0))
              .slice(0, 5)}
            loading={loading}
            onTokenClick={setSelectedToken}
          />

          {/* Top Gainers */}
          <PoolSection
            title="Top Gainers"
            icon="🏆"
            data={[...tokenData]
              .sort((a, b) => (b.pairData?.priceChange?.h24 || 0) - (a.pairData?.priceChange?.h24 || 0))
              .slice(0, 5)}
            loading={loading}
            onTokenClick={setSelectedToken}
          />
        </div>

        {/* Mobile Search (visible only on mobile) */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full bg-[#1a1a2e] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
        </div>

        {/* Market Overview Section */}
        <div className="mt-6 mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-2">Market Overview</h2>
          <p className="text-sm text-gray-300 mb-4">
            Explore the latest tokens and market trends. Use the filters below to find specific tokens or categories.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2">
          <TabButton
            label="TRENDING"
            icon="🔥"
            active={activeFilter === FILTER_TYPES.TRENDING}
            onClick={() => {
              setActiveFilter(FILTER_TYPES.TRENDING)
              setCurrentPage(1) // Reset to first page on filter change
            }}
          />
          <TabButton
            label="NEW PAIRS"
            icon="🚀"
            active={activeFilter === FILTER_TYPES.NEW_PAIRS}
            onClick={() => {
              setActiveFilter(FILTER_TYPES.NEW_PAIRS)
              setCurrentPage(1)
            }}
          />
          <TabButton
            label="MEME ZONE"
            icon="🤡"
            active={activeFilter === FILTER_TYPES.MEME_ZONE}
            onClick={() => {
              setActiveFilter(FILTER_TYPES.MEME_ZONE)
              setCurrentPage(1)
            }}
          />
          <TabButton
            label="HOT"
            icon="🌶️"
            active={activeFilter === FILTER_TYPES.HOT}
            onClick={() => {
              setActiveFilter(FILTER_TYPES.HOT)
              setCurrentPage(1)
            }}
          />
        </div>

        {/* Results count and filter info */}
        <div className="mt-3 flex flex-col md:flex-row md:justify-between md:items-center text-xs md:text-sm text-gray-400">
          <div>
            Showing {filteredTokens.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredTokens.length)} of {filteredTokens.length} tokens
          </div>
          <div className="mt-1 md:mt-0">
            Filter: <span className="text-[#6366f1]">{activeFilter}</span>
            {searchQuery && (
              <span>
                {" "}
                • Search: <span className="text-[#6366f1]">"{searchQuery}"</span>
              </span>
            )}
          </div>
        </div>

        {/* Table Header - Desktop */}
        <div className="mt-3 hidden md:grid grid-cols-5 gap-2 text-xs text-gray-400 px-3 py-2 bg-[#1a1a2e] rounded-t-md">
          <div className="flex items-center gap-1">
            PAIR INFO <Info className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1">
            CREATED <ChevronDown className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1">
            LIQUIDITY <ChevronDown className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1">AUDIT RESULTS</div>
          <div className="flex items-center gap-1">QUICK BUY</div>
        </div>

        {/* Table Rows */}
        <div className="mt-2 md:mt-0">
          {loading ? (
            // Loading state
            [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-2 md:grid-cols-5 gap-2 border border-gray-800 rounded-md p-3 mb-2 bg-[#1a1a2e]"
              >
                <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded animate-pulse md:block hidden"></div>
                <div className="h-6 bg-gray-800 rounded animate-pulse md:block hidden"></div>
                <div className="h-6 bg-gray-800 rounded animate-pulse md:block hidden"></div>
                <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))
          ) : paginatedTokens.length > 0 ? (
            // Data rows
            paginatedTokens.map((token, i) => (
              <div
                key={i}
                className="grid grid-cols-2 md:grid-cols-5 gap-2 border border-gray-800 rounded-md p-2 md:p-3 mb-1 bg-[#1a1a2e] hover:bg-[#252542] cursor-pointer transition-colors"
                onClick={() => setSelectedToken(token)}
              >
                {/* Mobile and Desktop: Pair Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                    {token.profile?.icon && (
                      <img
                        src={token.profile.icon || "/placeholder.svg"}
                        alt={token.pairData?.baseToken?.symbol || "Token"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-full">
                      {token.pairData?.baseToken?.name || "Unknown Token"}
                    </div>
                    <div className="text-xs text-gray-400">{token.pairData?.baseToken?.symbol || "???"}</div>
                  </div>
                </div>

                {/* Desktop Only: Created Date */}
                <div className="hidden md:flex items-center text-sm">
                  {new Date(token.pairData?.pairCreatedAt || Date.now()).toLocaleDateString()}
                </div>

                {/* Desktop Only: Liquidity */}
                <div className="hidden md:flex items-center text-sm">
                  ${token.pairData?.liquidity?.usd?.toLocaleString() || "N/A"}
                </div>

                {/* Desktop Only: Audit Results */}
                <div className="hidden md:flex items-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      token.pairData?.liquidity?.usd > 5000
                        ? "bg-green-900/30 text-green-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {token.pairData?.liquidity?.usd > 5000 ? "PASSED" : "CAUTION"}
                  </span>
                </div>

                {/* Mobile and Desktop: Buy Button */}
                <div className="flex items-center justify-end md:justify-start gap-2">
                  <button className="px-3 py-1 bg-[#6366f1] rounded text-xs" onClick={(e) => handleBuyClick(e, token)}>
                    BUY
                  </button>
                  {token.profile?.url && (
                    <a
                      href={token.profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            // No data state - Custom error message for no search results
            <div className="py-8 text-center text-lg text-red-400 animate-pulse bg-[#1a1a2e] rounded-md">
              Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5
              solana and try again
              <br />
              Note: least starting solana varies based off region some start can use at least 0.4
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTokens.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 md:p-2 rounded-md bg-[#1a1a2e] text-gray-400 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1

                  // Show fewer pages on mobile
                  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
                  if (isMobile) {
                    if (pageNum === 1 || pageNum === totalPages || pageNum === currentPage) {
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-md ${
                            currentPage === pageNum
                              ? "bg-[#6366f1] text-white"
                              : "bg-[#1a1a2e] text-gray-400 hover:bg-[#252542]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    }
                    if (
                      (pageNum === currentPage - 1 && currentPage > 2) ||
                      (pageNum === currentPage + 1 && currentPage < totalPages - 1)
                    ) {
                      return (
                        <span key={i} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  // Desktop view - show more pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-md ${
                          currentPage === pageNum
                            ? "bg-[#6366f1] text-white"
                            : "bg-[#1a1a2e] text-gray-400 hover:bg-[#252542]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  }

                  // Show ellipsis for skipped pages
                  if (
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={i} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-gray-400">
                        ...
                      </span>
                    )
                  }

                  return null
                })}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 md:p-2 rounded-md bg-[#1a1a2e] text-gray-400 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Trading Guide Section */}
        <div className="mt-8 bg-[#1a1a2e] border border-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-3">How to Trade on MEVX</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#252542] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#6366f1] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="font-medium">Connect Your Wallet</h3>
              </div>
              <p className="text-xs text-gray-300">
                Click the "Connect" button in the top right corner to connect your cryptocurrency wallet. MEVX supports
                Phantom, MetaMask, and other popular wallets.
              </p>
            </div>

            <div className="bg-[#252542] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#6366f1] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="font-medium">Find Tokens</h3>
              </div>
              <p className="text-xs text-gray-300">
                Browse trending tokens, search for specific tokens, or use our filters to discover new opportunities.
                Click on any token to view detailed information.
              </p>
            </div>

            <div className="bg-[#252542] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#6366f1] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="font-medium">Trade & Snipe</h3>
              </div>
              <p className="text-xs text-gray-300">
                Use the "BUY" button to quickly purchase tokens, or set up advanced sniping strategies to automatically
                trade when specific conditions are met.
              </p>
            </div>
          </div>

          <div className="bg-[#0e0e16] border border-gray-800 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Risk Warning</h4>
              <p className="text-xs text-gray-300">
                Cryptocurrency trading involves significant risk. Always do your own research (DYOR) before investing.
                MEVX provides tools and information, but does not offer financial advice.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-lg md:text-xl font-bold mb-4">Frequently Asked Questions</h2>

          <div className="space-y-3">
            <FaqItem
              question="What is MEVX?"
              answer="MEVX is a comprehensive cryptocurrency trading platform that provides real-time market data, advanced trading tools, and token sniping capabilities across multiple blockchains."
            />

            <FaqItem
              question="How do I connect my wallet?"
              answer="Click the 'Connect' button in the top right corner of the page. You'll be prompted to select your wallet provider (Phantom, MetaMask, etc.) and authorize the connection."
            />

            <FaqItem
              question="What is token sniping?"
              answer="Token sniping refers to the practice of buying new tokens as soon as they become available for trading, often within seconds of liquidity being added. MEVX provides tools to automate this process."
            />

            <FaqItem
              question="Is MEVX safe to use?"
              answer="MEVX employs industry-standard security practices to protect user data and funds. However, always exercise caution when trading cryptocurrencies and never invest more than you can afford to lose."
            />

            <FaqItem
              question="Which blockchains does MEVX support?"
              answer="MEVX currently supports Solana, Ethereum, and Binance Smart Chain, with plans to add more blockchains in the future."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Feature Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
          <div className="bg-[#0e0e16] border border-gray-800 rounded-lg max-w-4xl w-full p-4 relative mx-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base md:text-lg font-bold text-center w-full">
                MEVX.IO - FASTEST TRADE AND SNIPE TRADE SMARTER, EARN HARDER!
              </h2>
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1a1a2e] rounded-lg p-4 space-y-3 md:space-y-4">
                <FeatureItem icon="🔵" label="Multichain" />
                <FeatureItem icon="🎯" label="Raydium Sniper" />
                <FeatureItem icon="🎯" label="Pump.Fun / Moonshot Sniper" />
                <FeatureItem icon="🔄" label="Auto-sell for Pump.fun Sniper" />
                <FeatureItem icon="🤡" label="MemeZone / DegenZone" />
                <FeatureItem icon="📋" label="Copytrade" />
                <FeatureItem icon="🛡️" label="Copytrade Protection" />
                <FeatureItem icon="👛" label="Multi-wallet Support" />
                <FeatureItem icon="📊" label="Multi Chart" />
                <FeatureItem icon="🔒" label="Passcode Security" />
                <FeatureItem icon="💰" label="Fee" />
                <FeatureItem icon="" label="Referral" />
              </div>

              <div className="flex flex-col items-center justify-center bg-[#1a1a2e] rounded-lg p-6 md:p-8">
                <div className="text-[#6366f1] text-xl md:text-2xl font-bold mb-6 md:mb-8">MEVX</div>
                <div className="text-center space-y-4">
                  <div className="text-gray-400">/</div>
                  <div className="text-gray-400">/</div>
                  <div className="text-gray-400">/</div>
                </div>
                <div className="mt-6 md:mt-8 text-lg md:text-xl font-bold">0.8%</div>
                <div className="mt-2 text-xs md:text-sm text-gray-400">5 Layers / Quick Buy Ref</div>
              </div>

              <div className="flex flex-col items-center justify-center bg-[#1a1a2e] rounded-lg p-6 md:p-8">
                <div className="text-center space-y-4 mb-6 md:mb-8">
                  <div className="text-gray-400">/</div>
                  <div className="text-gray-400">/</div>
                  <div className="text-gray-400">/</div>
                </div>
                <div className="mt-6 md:mt-8 text-lg md:text-xl font-bold">0.8%</div>
                <div className="mt-2 text-xs md:text-sm text-gray-400">5 Layers</div>
                <div className="mt-6 md:mt-8 text-lg md:text-xl font-bold">1%</div>
                <div className="mt-2 text-xs md:text-sm text-gray-400">1 Layer</div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="bg-[#6366f1] hover:bg-[#5254cc] text-white px-6 py-2 rounded-md font-medium"
                onClick={() => {
                  setShowModal(false)
                  if (!isConnected) {
                    setShowWalletModal(true)
                  }
                }}
              >
                Let&apos;s go
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connect Modal */}
      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} onSuccess={handleWalletConnectSuccess} />
      )}

      {/* Token Detail Modal */}
      {selectedToken && <TokenDetailModal token={selectedToken} onClose={() => setSelectedToken(null)} />}
    </div>
  )
}

function NavItem({ label, hasDropdown = false, onClick }) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-300 hover:text-white cursor-pointer" onClick={onClick}>
      {label}
      {hasDropdown && <ChevronDown className="h-4 w-4" />}
    </div>
  )
}

function MobileNavItem({ label, onClick }) {
  return (
    <div
      className="py-2 px-1 text-sm text-gray-300 hover:text-white border-b border-gray-800 last:border-0 cursor-pointer"
      onClick={onClick}
    >
      {label}
    </div>
  )
}

function PoolSection({ title, icon, data = [], loading, onTokenClick }) {
  return (
    <div className="bg-[#1a1a2e] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h2 className="text-sm font-medium">{title}</h2>
        </div>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <div className="p-3 space-y-2">
        {loading
          ? // Loading state
            [1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{num}</span>
                <div className="h-5 bg-gray-800 rounded w-full animate-pulse"></div>
              </div>
            ))
          : data.length > 0
            ? // Data rows
              data.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#252542] rounded-md p-1 transition-colors"
                  onClick={() => onTokenClick(token)}
                >
                  <span className="text-xs text-gray-400">{index + 1}</span>
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
                      {token.profile?.icon && (
                        <img
                          src={token.profile.icon || "/placeholder.svg"}
                          alt={token.pairData?.baseToken?.symbol || "Token"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="truncate text-sm">
                      {token.pairData?.baseToken?.symbol || token.profile?.tokenAddress?.substring(0, 6) || "???"}
                    </div>
                    <div
                      className={`ml-auto text-xs ${token.pairData?.priceChange?.h24 > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {token.pairData?.priceChange?.h24 > 0 ? "+" : ""}
                      {token.pairData?.priceChange?.h24?.toFixed(2) || 0}%
                    </div>
                  </div>
                </div>
              ))
            : // No data state
              [1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{num}</span>
                  <div className="text-gray-500 text-sm">No data available</div>
                </div>
              ))}
      </div>
      <div className="flex justify-center p-2 border-t border-gray-800">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ label, icon, active = false, onClick }) {
  return (
    <button
      className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm ${
        active ? "bg-[#6366f1] text-white" : "bg-[#1a1a2e] text-gray-300 hover:bg-[#252542]"
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function FeatureItem({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs md:text-sm">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#1a1a2e] border border-gray-800 rounded-lg p-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-300">{description}</p>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-[#1a1a2e] border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-medium text-sm">{question}</h3>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="p-3 pt-0 border-t border-gray-800">
          <p className="text-xs text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  )
}
