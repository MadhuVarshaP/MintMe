"use client"


import { Wallet, LogOut } from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"


export default function ConnectWalletButton() {
  const { login, user, logout, authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  
  // Check if user is authenticated and has wallets
  const isConnected = authenticated && user && wallets.length > 0
  const walletAddress = wallets.length > 0 ? wallets[0].address : null
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"



  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-background backdrop-blur-sm px-3 py-2 rounded-lg border border-primary">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-primary">
            {shortAddress}
          </span>
        </div>
        {/* Disconnect button */}
        <button
          onClick={() => logout()} 
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-500 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    )
  }


  if (!ready) {
    return (
      <button className="relative px-4 py-2 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" disabled>
        <span className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Loading...
        </span>
      </button>
    )
  }



  return (
    <button
      onClick={login}
      className="flex items-center space-x-2 px-4 py-2 bg-background border-2 border-primary text-primary rounded-lg transition-colors cursor-pointer "
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  )
}
