"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import GitHubLinkButton from "@/components/GitHubLinkButton"
import ResumeCard from "@/components/ResumeCard"
import WalletStatus from "@/components/WalletStatus"
import { Github, Sparkles } from "lucide-react"
import ReclaimVerification from "@/components/ReclaimVerification"
import { useEffect, useState } from "react"

interface Resume {
  name: string;
  title: string;
  location: string;
  experience: string;
  skills?: string[];
  projects?: { name: string; stars: number }[];
  followers?: string;
  creationYear?: string;
  contributionsLastYear?: string;
}

export default function AppPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // For demo, use a hardcoded GitHub username. Replace with session/user context as needed.
  const username = "MadhuVarshaP";

  const fetchResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-latest-resume?userId=${username}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setResume(null);
      } else {
        setResume(data.resume);
      }
    } catch {
      setError('Failed to fetch resume data');
      setResume(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResume();
  }, [username]);

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
          <WalletStatus />

          {/* GitHub Connection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
              <Github className="w-5 h-5" />
              <span>GitHub Integration</span>
            </h2>
            <GitHubLinkButton />
          </div>

          <ReclaimVerification />

          {/* Resume Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Resume Preview</span>
            </h2>
            <button
              onClick={fetchResume}
              className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            {loading ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 text-center">
                <div className="text-body-text">Loading resume data...</div>
              </div>
            ) : error ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200 text-center">
                <div className="text-red-600">{error}</div>
                <p className="text-body-text text-sm mt-2">
                  Make sure you have completed the GitHub verification process.
                </p>
              </div>
            ) : resume ? (
              <ResumeCard resume={resume} />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 text-center">
                <div className="text-body-text">No resume data available. Please connect your wallet and complete the verification process.</div>
              </div>
            )}
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
