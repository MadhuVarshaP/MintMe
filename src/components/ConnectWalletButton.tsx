"use client"

import { Wallet, LogOut, Network, ExternalLink, Copy } from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Dropdown } from "@/components/ui/dropdown"
import { useEffect, useState } from "react"


interface NetworkInfo {
  name: string
  chainId: number
  isTestnet: boolean
  nativeCurrency: string
  blockExplorer?: string
}

export default function ConnectWalletButton() {
  const { login, user, logout, authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)
  const [balance, setBalance] = useState<string>("0.00")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  
  // Check if user is authenticated and has wallets
  const isConnected = authenticated && user && wallets.length > 0
  const walletAddress = wallets.length > 0 ? wallets[0].address : null
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"

  // Network mapping
  const getNetworkInfo = (chainId: number): NetworkInfo => {
    const networks: Record<number, NetworkInfo> = {
      1: { name: "Ethereum Mainnet", chainId: 1, isTestnet: false, nativeCurrency: "ETH", blockExplorer: "https://etherscan.io" },
      11155111: { name: "Ethereum Sepolia", chainId: 11155111, isTestnet: true, nativeCurrency: "ETH", blockExplorer: "https://sepolia.etherscan.io" },
      8453: { name: "Base Mainnet", chainId: 8453, isTestnet: false, nativeCurrency: "ETH", blockExplorer: "https://basescan.org" },
      84532: { name: "Base Sepolia", chainId: 84532, isTestnet: true, nativeCurrency: "ETH", blockExplorer: "https://sepolia.basescan.org" },
      137: { name: "Polygon Mainnet", chainId: 137, isTestnet: false, nativeCurrency: "MATIC", blockExplorer: "https://polygonscan.com" },
      80001: { name: "Polygon Mumbai", chainId: 80001, isTestnet: true, nativeCurrency: "MATIC", blockExplorer: "https://mumbai.polygonscan.com" },
      56: { name: "BSC Mainnet", chainId: 56, isTestnet: false, nativeCurrency: "BNB", blockExplorer: "https://bscscan.com" },
      97: { name: "BSC Testnet", chainId: 97, isTestnet: true, nativeCurrency: "BNB", blockExplorer: "https://testnet.bscscan.com" },
      43114: { name: "Avalanche Mainnet", chainId: 43114, isTestnet: false, nativeCurrency: "AVAX", blockExplorer: "https://snowtrace.io" },
      43113: { name: "Avalanche Fuji", chainId: 43113, isTestnet: true, nativeCurrency: "AVAX", blockExplorer: "https://testnet.snowtrace.io" },
    }
    
    return networks[chainId] || { 
      name: `Unknown Network (${chainId})`, 
      chainId, 
      isTestnet: false, 
      nativeCurrency: "ETH" 
    }
  }

  // Get network information and balance from connected wallet
  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (wallets.length > 0 && wallets[0].chainId) {
        const chainId = parseInt(wallets[0].chainId.split(':')[1] || wallets[0].chainId)
        setNetworkInfo(getNetworkInfo(chainId))
        
        // Fetch balance using wallet provider
        setIsLoadingBalance(true)
        try {
          // Check if wallet has Ethereum provider capability
          if ('getEthereumProvider' in wallets[0] && typeof wallets[0].getEthereumProvider === 'function') {
            const provider = await wallets[0].getEthereumProvider()
            const balance = await provider.request({
              method: 'eth_getBalance',
              params: [walletAddress, 'latest']
            })
            // Convert from wei to ether
            const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18)
            setBalance(balanceInEth.toFixed(4))
          } else {
            // For non-Ethereum wallets or if provider is not available
            setBalance("N/A")
          }
        } catch (error) {
          console.error('Error fetching balance:', error)
          setBalance("0.00")
        } finally {
          setIsLoadingBalance(false)
        }
      }
    }

    if (isConnected) {
      fetchWalletInfo()
    }
  }, [wallets, isConnected, walletAddress])

  // Copy address to clipboard
  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy address:', error)
      }
    }
  }



  if (isConnected) {
    const dropdownContent = (
      <div className="p-4">
        {/* Network Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Network</span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              networkInfo?.isTestnet 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}>
              <Network className="w-3 h-3" />
              <span>{networkInfo?.isTestnet ? 'Testnet' : 'Mainnet'}</span>
            </div>
          </div>
          <div className="text-sm text-gray-900 font-medium">
            {networkInfo?.name || 'Unknown Network'}
          </div>
          <div className="text-xs text-gray-500">
            Chain ID: {networkInfo?.chainId}
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Balance</div>
          <div className="text-lg font-semibold text-gray-900">
            {isLoadingBalance ? (
              <span className="text-gray-500">Loading...</span>
            ) : (
              `${balance} ${networkInfo?.nativeCurrency || 'ETH'}`
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Address</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-mono">{shortAddress}</span>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy full address"
            >
              <Copy className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Explorer Link */}
        {networkInfo?.blockExplorer && (
          <div className="pt-3 border-t border-gray-200">
            <a
              href={`${networkInfo.blockExplorer}/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </a>
          </div>
        )}
      </div>
    )

    return (
      <div className="flex items-center space-x-2">
        <Dropdown content={dropdownContent}>
          <div className="flex items-center space-x-2 bg-background backdrop-blur-sm px-3 py-2 rounded-lg border border-primary hover:border-primary/80 transition-colors cursor-pointer">
            <div className={`w-2 h-2 rounded-full ${
              networkInfo?.isTestnet ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <span className="text-sm font-medium text-primary">
              {shortAddress}
            </span>
            {networkInfo && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                networkInfo.isTestnet 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {networkInfo.isTestnet ? 'Test' : 'Main'}
              </span>
            )}
          </div>
        </Dropdown>
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
