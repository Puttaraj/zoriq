"use client";

import { useState, useMemo } from "react";
import { Download, RotateCcw, Briefcase, FileText } from "lucide-react";
import { ResumeData } from "../types/resume";
import { calculateLiveAtsScore } from "../lib/ats-score";
import { SAMPLE_SOFTWARE_ENGINEER } from "../lib/sample-data";
import { ResumeForm } from "./resume-form";
import { ResumePreview } from "./resume-preview";
import { LiveAtsAudit } from "./live-ats-audit";
import { JobRadarModal } from "./job-radar-modal";

export function ResumeBuilderWorkspace() {
  const [resumeData, setResumeData] = useState<ResumeData>(
    SAMPLE_SOFTWARE_ENGINEER,
  );
  const [showJobRadar, setShowJobRadar] = useState(false);

  const atsAudit = useMemo(() => {
    return calculateLiveAtsScore(resumeData);
  }, [resumeData]);

  const handlePrint = () => {
    window.print();
    setShowJobRadar(true);
  };

  const handleReset = () => {
    setResumeData({
      contact: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      summary: "",
      experience: [],
      education: [],
      projects: [],
      skills: [
        { id: "sk-1", category: "Languages", items: "" },
        { id: "sk-2", category: "Frameworks", items: "" },
        { id: "sk-3", category: "Tools", items: "" },
      ],
      declaration: {
        enabled: false,
        statement:
          "I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.",
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        place: "",
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Top Action Bar */}
      <div className="border-border/60 bg-card shadow-soft mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <FileText className="text-primary h-5 w-5" />
          <h2 className="font-heading text-foreground text-sm font-bold sm:text-base">
            ATS Resume Studio (Harvard Monochrome Standard)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setResumeData(SAMPLE_SOFTWARE_ENGINEER)}
            className="border-border bg-muted/40 hover:bg-muted text-foreground rounded-xl border px-3 py-2 text-xs font-semibold transition-all"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border-border hover:bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => setShowJobRadar(true)}
            className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Matching Jobs
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="gradient-brand inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110"
          >
            <Download className="h-4 w-4" />
            Download ATS PDF (Free)
          </button>
        </div>
      </div>

      {/* Split View: Form + Audit (Left) | Live Preview (Right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form Controls & Live ATS Audit (5 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Real-time ATS Pass Audit Card */}
          <LiveAtsAudit audit={atsAudit} />

          {/* Structured Resume Form */}
          <ResumeForm data={resumeData} setData={setResumeData} />
        </div>

        {/* Right Preview Column (7 cols) */}
        <div className="lg:col-span-7">
          <div className="border-border/60 bg-card shadow-soft sticky top-20 overflow-hidden rounded-2xl border">
            <div className="border-border/40 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5 text-xs font-semibold">
              <span className="text-muted-foreground">
                Real-Time A4 Live Document Preview
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                100% ATS Ready
              </span>
            </div>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>

      {/* Instant Job Radar Modal */}
      {showJobRadar && (
        <JobRadarModal
          data={resumeData}
          onClose={() => setShowJobRadar(false)}
        />
      )}
    </div>
  );
}
