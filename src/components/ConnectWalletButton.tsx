"use client"

import { useState } from "react"
import { Wallet, LogOut } from "lucide-react"

export default function ConnectWalletButton() {
  // Mock authentication state
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock wallet address
  const mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590b5"

  const handleConnect = async () => {
    setIsLoading(true)
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-2 bg-white px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-primary">
            {mockAddress.slice(0, 6)}...{mockAddress.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-dark rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="flex items-center space-x-2 px-4 py-2 bg-[#f6f4d3] border-2 border-primary text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-4 h-4" />
      <span>{isLoading ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  )
}
