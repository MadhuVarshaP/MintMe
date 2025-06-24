"use client"

import type { ReactNode } from "react"
import { Wallet, Lock } from "lucide-react"
import Link from "next/link"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Mock authentication - in real app this would check actual auth state
  const isAuthenticated = true // Change to false to see the locked state

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-primary/20">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Access Restricted</h2>
          <p className="text-body-text mb-6">Please connect your wallet to access this page.</p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
