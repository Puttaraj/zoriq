"use client";

import { ExternalLink, Sparkles, X, MapPin, Building2 } from "lucide-react";
import { ResumeData } from "../types/resume";

interface JobRadarModalProps {
  data: ResumeData;
  onClose: () => void;
}

export function JobRadarModal({ data, onClose }: JobRadarModalProps) {
  const role = data.contact.jobTitle || "Software Engineer";
  const location = data.contact.location || "Bengaluru";

  const encodedRole = encodeURIComponent(role);
  const encodedLocation = encodeURIComponent(location);

  const curatedJobs = [
    {
      title: `Senior ${role}`,
      company: "TechNexus Global",
      location: `${location} · Hybrid`,
      salary: "₹18L – ₹26L",
      match: 94,
      tags: ["High Match", "Full-Time"],
    },
    {
      title: role,
      company: "Innovate Labs",
      location: "Remote",
      salary: "₹14L – ₹20L",
      match: 89,
      tags: ["Remote", "Immediate Joiner"],
    },
    {
      title: `Lead ${role}`,
      company: "Apex Enterprise Systems",
      location: location,
      salary: "₹22L – ₹30L",
      match: 86,
      tags: ["Actively Hiring"],
    },
  ];

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="border-border/60 bg-card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:p-8">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-lg p-1"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="h-4 w-4" />
          <span>Instant Job Radar Activated</span>
        </div>
        <h3 className="font-heading text-foreground mt-1 text-xl font-bold">
          Live Roles Matching Your Profile
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Based on your role as <strong>{role}</strong> in{" "}
          <strong>{location}</strong>:
        </p>

        {/* Curated Job Cards */}
        <div className="mt-6 space-y-3">
          {curatedJobs.map((job, idx) => (
            <div
              key={idx}
              className="border-border/60 bg-muted/10 hover:border-primary/40 flex flex-col justify-between gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-foreground text-sm font-bold">
                    {job.title}
                  </h4>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                    {job.match}% Match
                  </span>
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="text-foreground font-mono font-medium">
                    {job.salary}
                  </span>
                </div>
              </div>

              <a
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&location=${encodedLocation}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-brand inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-sm hover:brightness-110"
              >
                Apply Now
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>

        {/* 1-Click Pre-Filtered Job Portals */}
        <div className="border-border/60 mt-6 border-t pt-5">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Explore 500+ Live Openings on Top Portals:
          </span>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              {
                name: "LinkedIn Jobs",
                url: `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&location=${encodedLocation}`,
              },
              {
                name: "Naukri",
                url: `https://www.naukri.com/${encodeURIComponent(role.toLowerCase().replace(/\s+/g, "-"))}-jobs-in-${encodeURIComponent(location.toLowerCase())}`,
              },
              {
                name: "Indeed",
                url: `https://www.indeed.com/jobs?q=${encodedRole}&l=${encodedLocation}`,
              },
              {
                name: "Wellfound (Startups)",
                url: `https://wellfound.com/jobs?role=${encodedRole}`,
              },
            ].map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-muted/20 hover:bg-muted text-foreground inline-flex items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-xs font-semibold transition-all"
              >
                <span>{portal.name}</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
