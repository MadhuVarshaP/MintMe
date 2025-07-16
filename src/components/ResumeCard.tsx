"use client"

import { Calendar, MapPin, Star, ExternalLink } from "lucide-react";

interface Project {
  name: string;
  stars: number;
}

interface Resume {
  name: string;
  title: string;
  location: string;
  experience: string;
  skills?: string[];
  projects?: Project[];
  followers?: string;
  creationYear?: string;
  contributionsLastYear?: string;
}

export default function ResumeCard({ resume }: { resume: Resume }) {
  if (!resume) return <div>Loading...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/40">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-primary mb-1">{resume.name}</h3>
          <p className="text-body-text font-medium">{resume.title}</p>
        </div>
        <div className="text-right text-sm text-body-text">
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="w-4 h-4" />
            <span>{resume.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{resume.experience}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary mb-3">Top Skills</h4>
        <div className="flex flex-wrap gap-2">
          {resume.skills?.map((skill: string) => (
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
          {resume.projects?.map((project: Project) => (
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

      {/* GitHub Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary mb-3">GitHub Stats</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 rounded-lg p-3 text-center border border-primary/10">
            <div className="text-lg font-bold text-primary">{resume.followers}</div>
            <div className="text-xs text-body-text">Followers</div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 text-center border border-primary/10">
            <div className="text-lg font-bold text-primary">{resume.creationYear}</div>
            <div className="text-xs text-body-text">Joined</div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 text-center border border-primary/10">
            <div className="text-lg font-bold text-primary">{resume.contributionsLastYear}</div>
            <div className="text-xs text-body-text">Contributions (Last Year)</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/90 border-2 border-primary cursor-pointer rounded-lg font-semibold transition-colors">
          <span>Mint Resume</span>
        </button>
        <button className="flex items-center justify-center px-4 py-2 bg-gray-light hover:bg-gray-200 text-text-dark rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
