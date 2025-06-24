"use client"

import { useState } from "react"
import { Github, Check, ExternalLink } from "lucide-react"

export default function GitHubLinkButton() {
  const [isLinked, setIsLinked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkGitHub = async () => {
    setIsLoading(true)
    // Simulate OAuth flow
    setTimeout(() => {
      setIsLinked(true)
      setIsLoading(false)
    }, 2000)
  }

  if (isLinked) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-green-800">GitHub Connected</p>
          <p className="text-sm text-green-600">@johndoe • 127 repositories</p>
        </div>
        <button className="text-green-600 hover:text-green-700 transition-colors">
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleLinkGitHub}
      disabled={isLoading}
      className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-xl hover:border-primary/40 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
    >
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <Github className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-primary">{isLoading ? "Connecting..." : "Link GitHub Account"}</p>
        <p className="text-sm text-body-text">Verify your coding contributions</p>
      </div>
    </button>
  )
}
