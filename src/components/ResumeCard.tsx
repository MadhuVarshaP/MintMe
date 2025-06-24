"use client"

import { Calendar, MapPin, Star, ExternalLink } from "lucide-react"

export default function ResumeCard() {
  const mockData = {
    name: "John Doe",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    experience: "5+ years",
    skills: ["React", "Node.js", "TypeScript", "Web3", "Solidity"],
    projects: [
      { name: "DeFi Dashboard", stars: 234 },
      { name: "NFT Marketplace", stars: 189 },
      { name: "Web3 Wallet", stars: 156 },
    ],
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-primary mb-1">{mockData.name}</h3>
          <p className="text-body-text font-medium">{mockData.title}</p>
        </div>
        <div className="text-right text-sm text-body-text">
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="w-4 h-4" />
            <span>{mockData.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{mockData.experience}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary mb-3">Top Skills</h4>
        <div className="flex flex-wrap gap-2">
          {mockData.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary mb-3">Featured Projects</h4>
        <div className="space-y-2">
          {mockData.projects.map((project) => (
            <div key={project.name} className="flex items-center justify-between p-2 bg-gray-light/50 rounded-lg">
              <span className="text-sm font-medium text-text-dark">{project.name}</span>
              <div className="flex items-center space-x-1 text-body-text">
                <Star className="w-4 h-4" />
                <span className="text-sm">{project.stars}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">
          <span>Mint Resume</span>
        </button>
        <button className="flex items-center justify-center px-4 py-2 bg-gray-light hover:bg-gray-200 text-text-dark rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
