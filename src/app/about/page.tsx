import { Github, ExternalLink, Sparkles, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">About MintMe</h1>
          <p className="text-lg text-body-text max-w-2xl mx-auto">
            Revolutionizing professional identity verification through blockchain technology
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-body-text leading-relaxed mb-6">
              MintMe is a cutting-edge Web3 platform that bridges the gap between traditional professional credentials
              and blockchain technology. By connecting your wallet and verifying your GitHub contributions, we create a
              tamper-proof, blockchain-verified professional identity that showcases your real achievements and skills.
            </p>

            <p className="text-body-text leading-relaxed mb-6">
              In today's digital economy, proving your technical expertise and professional accomplishments can be
              challenging. MintMe solves this by creating NFT-based resumes that are permanently stored on the
              blockchain, providing employers and collaborators with verifiable proof of your capabilities.
            </p>

            <p className="text-body-text leading-relaxed">
              Our platform leverages the power of decentralized technology to ensure that your professional identity
              remains secure, portable, and truly owned by you. No more relying on centralized platforms that can
              disappear or change their policies overnight.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <Shield className="w-8 h-8 text-primary" />,
              title: "Secure & Verified",
              description: "Blockchain-based verification ensures your credentials are tamper-proof and authentic.",
            },
            {
              icon: <Zap className="w-8 h-8 text-primary" />,
              title: "Easy Integration",
              description: "Simple wallet connection and GitHub OAuth make the process seamless and user-friendly.",
            },
            {
              icon: <Sparkles className="w-8 h-8 text-primary" />,
              title: "NFT Ownership",
              description: "Your professional identity becomes a unique NFT that you truly own and control.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all hover:scale-105"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-primary mb-2 text-center">{feature.title}</h3>
              <p className="text-body-text text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-body-text/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to Get Started?</h2>
          <p className="text-body-text mb-6 max-w-2xl mx-auto">
            Join the future of professional identity verification. Connect your wallet, verify your GitHub, and mint
            your unique professional NFT today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/app"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>Launch App</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white/80 backdrop-blur-sm hover:bg-white text-text-dark rounded-lg font-semibold transition-colors hover:scale-105 border border-primary/20"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
