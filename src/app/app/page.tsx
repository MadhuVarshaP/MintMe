import ProtectedRoute from "@/components/ProtectedRoute"
import GitHubLinkButton from "@/components/GitHubLinkButton"
import ResumeCard from "@/components/ResumeCard"
import { Wallet, Github, Sparkles } from "lucide-react"

export default function AppPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Your Web3 Professional Identity</h1>
            <p className="text-lg text-body-text max-w-2xl mx-auto">
              Connect your accounts and create your blockchain-verified resume
            </p>
          </div>

          {/* Wallet Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary">Wallet Connected</h3>
                <p className="text-body-text">0x742d35Cc6634C0532925a3b8D4C9db96590b5</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* GitHub Connection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
              <Github className="w-5 h-5" />
              <span>GitHub Integration</span>
            </h2>
            <GitHubLinkButton />
          </div>

          {/* Resume Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Resume Preview</span>
            </h2>
            <ResumeCard />
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-primary/10 to-body-text/10 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Ready to Mint?</h3>
            <p className="text-body-text mb-4">Your resume is ready to be minted as an NFT on the blockchain</p>
            <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold ">
              Mint Your Resume NFT
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
