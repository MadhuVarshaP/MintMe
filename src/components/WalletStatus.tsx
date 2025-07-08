'use client'

import { useWallets } from '@privy-io/react-auth'
import { Wallet } from 'lucide-react'

export default function WalletStatus() {
  const { wallets } = useWallets()
  
  const connectedWallet = wallets.find(wallet => wallet.connectorType !== 'embedded')
  
  const truncateAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!connectedWallet) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary">Wallet Not Connected</h3>
            <p className="text-body-text">Please connect your wallet to continue</p>
          </div>
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Wallet className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary">Wallet Connected</h3>
          <p className="text-body-text font-mono">
            {truncateAddress(connectedWallet.address)}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {connectedWallet.walletClientType || 'Unknown'} Wallet
          </p>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
    </div>
  )
}