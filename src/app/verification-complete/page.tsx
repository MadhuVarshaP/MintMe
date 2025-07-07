"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function VerificationHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const proofId = searchParams?.get("proofId")

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (proofId && proofId.length > 0) {
        router.replace("/?verification=success")
      } else {
        router.replace("/?verification=error")
      }
    }, 1200) 

    return () => clearTimeout(timeout)
  }, [proofId, router])

  return null
}

export default function VerificationCompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Suspense fallback={null}>
        <VerificationHandler />
      </Suspense>
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 flex flex-col items-center space-y-6 border border-primary/20">
        <svg className="w-12 h-12 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <h2 className="text-xl font-semibold text-primary text-center">
          Verifying your GitHub credentials…
        </h2>
        <p className="text-body-text text-center">
          Please wait while we complete your verification.
        </p>
      </div>
    </div>
  )
}