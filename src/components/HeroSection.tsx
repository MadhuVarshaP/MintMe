"use client"

import { ArrowRight, Github, Wallet, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-background"></div>
      <div className="absolute top-10 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-body-text/10 rounded-full blur-xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-primary mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Web3 Professional Identity</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Mint Your Professional
            <br />
            <span className="text-body-text">Resume as NFT</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-body-text max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect your wallet, verify your GitHub contributions, and create a blockchain-verified professional
            identity that showcases your real achievements.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/app"
              className="group flex items-center space-x-2 px-8 py-4 bg-white/90 border-2 border-primary rounded-xl font-semibold hover:shadow-lg"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect & Verify</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="flex items-center space-x-2 px-8 py-4 bg-white/90 backdrop-blur-sm hover:bg-white text-text-dark rounded-xl font-semibold   border border-primary/20"
            >
              <Github className="w-5 h-5" />
              <span>Learn More</span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: <Wallet className="w-8 h-8 text-primary" />,
                title: "Wallet Connection",
                description: "Securely connect your Web3 wallet to get started",
              },
              {
                icon: <Github className="w-8 h-8 text-primary" />,
                title: "GitHub Verification",
                description: "Verify your coding contributions and repositories",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-primary" />,
                title: "NFT Resume",
                description: "Mint your professional identity as a unique NFT",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 hover:border-primary/20  "
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-body-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
