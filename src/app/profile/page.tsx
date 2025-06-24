import { Github, MapPin, Calendar, Star, ExternalLink, Award } from "lucide-react"

export default function ProfilePage() {
  const mockProfile = {
    name: "John Doe",
    username: "johndoe",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    joinDate: "March 2019",
    bio: "Passionate full-stack developer with expertise in Web3 technologies. Building the future of decentralized applications.",
    stats: {
      repositories: 127,
      followers: 1234,
      following: 456,
      contributions: 2847,
    },
    achievements: ["Top 1% GitHub Contributor", "Open Source Maintainer", "Web3 Pioneer"],
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-body-text rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary mb-2">{mockProfile.name}</h1>
              <p className="text-lg text-body-text font-medium mb-2">@{mockProfile.username}</p>
              <p className="text-body-text mb-4">{mockProfile.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-body-text">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mockProfile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {mockProfile.joinDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Github className="w-4 h-4" />
                  <span>{mockProfile.title}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>View on GitHub</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Repositories", value: mockProfile.stats.repositories },
            { label: "Followers", value: mockProfile.stats.followers },
            { label: "Following", value: mockProfile.stats.following },
            { label: "Contributions", value: mockProfile.stats.contributions },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-primary/20 text-center"
            >
              <div className="text-2xl font-bold text-primary mb-1">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-body-text">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Achievements</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProfile.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-body-text/10 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-primary">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* NFT Status */}
        <div className="bg-gradient-to-r from-primary/10 to-body-text/10 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-primary mb-2">NFT Resume Status</h3>
          <p className="text-body-text mb-4">Your professional identity is ready to be minted as a unique NFT</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">
              Mint NFT
            </button>
            <button className="px-6 py-2 bg-white/80 backdrop-blur-sm hover:bg-white text-text-dark rounded-lg font-semibold transition-colors border border-primary/20">
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
