"use client";

import { useState } from "react";
import {
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  ShieldCheck,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AtsAnalysis {
  atsScore: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingScore: number;
  formattingFeedback: string[];
  bulletImprovements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  actionableTips: string[];
}

const SAMPLE_RESUME = `PUTTARAJ K
Senior Software Engineer | Bengaluru, India
Email: puttaraj@example.com | GitHub: github.com/puttaraj

PROFESSIONAL SUMMARY
Experienced full-stack engineer with 4+ years of expertise in TypeScript, React, Next.js, and scalable web utilities. Passionate about building client-side tools with zero server footprint.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, HTML5, CSS3, SQL
Frameworks: React 19, Next.js 15, Tailwind CSS, Node.js
Tools: Git, GitHub, Docker, Postman, Vercel

WORK EXPERIENCE
Software Engineer | Tech Corp (2022 - Present)
- Worked on developing web applications using React and Next.js.
- Responsible for fixing frontend bugs and collaborating with designers.
- Helped improve website performance and speed.
- Built reusable UI components for team design system.

Junior Developer | Web Studio (2020 - 2022)
- Maintained existing client websites and handled bug tickets.
- Assisted with database queries and API integration.

EDUCATION
Bachelor of Engineering in Computer Science | VTU (2016 - 2020)`;

const SAMPLE_JD = `Senior Full Stack Developer (React & Node.js)
Requirements:
- 3+ years experience with React, Next.js, and TypeScript.
- Strong knowledge of CI/CD pipelines, Docker, and AWS/Cloud deployments.
- Proven track record of performance optimization (Web Vitals).
- Experience with Unit Testing (Jest, Playwright) and System Architecture.`;

export function AtsWorkspace() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError("Please paste or load a resume with at least 50 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ats-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setAnalysis(data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const loadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JD);
    setError(null);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60)
      return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-destructive border-destructive/30 bg-destructive/10";
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      {!analysis ? (
        <div className="flex flex-col gap-6">
          {/* Header Action Bar */}
          <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <span className="font-heading text-foreground text-sm font-bold">
                AI ATS Resume Scanner &amp; Optimizer
              </span>
            </div>
            <button
              type="button"
              onClick={loadSample}
              className="border-border bg-muted/40 hover:bg-muted text-foreground rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
            >
              Load Sample Resume &amp; Job Description
            </button>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Resume Input (7 cols) */}
            <div className="flex flex-col gap-2 md:col-span-7">
              <label className="text-foreground flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                <span className="flex items-center gap-1.5">
                  <FileText className="text-primary h-4 w-4" />
                  Your Resume Content *
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {resumeText.length} characters
                </span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume text here (experience, skills, education)..."
                rows={14}
                className="border-border/80 bg-muted/10 focus-within:border-primary w-full rounded-xl border p-4 font-sans text-xs leading-relaxed transition-all outline-none"
              />
            </div>

            {/* Job Description Input (5 cols) */}
            <div className="flex flex-col gap-2 md:col-span-5">
              <label className="text-foreground flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="text-primary h-4 w-4" />
                  Job Description (Optional)
                </span>
                <span className="text-primary text-[10px] font-bold">
                  Recommended
                </span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target job description to match exact keywords and recruiter filters..."
                rows={14}
                className="border-border/80 bg-muted/10 focus-within:border-primary w-full rounded-xl border p-4 font-sans text-xs leading-relaxed transition-all outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-xl border p-3.5 text-xs font-semibold">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Private. Analyzed securely in real-time.</span>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="gradient-brand inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing Resume with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Scan Resume with ATS Engine</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="flex flex-col gap-8">
          {/* Top Results Bar */}
          <div className="border-border/40 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Award className="text-primary h-5 w-5" />
              <h3 className="font-heading text-foreground text-base font-bold">
                ATS Diagnostic Report
              </h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Scan Another Resume
            </button>
          </div>

          {/* Scores & Executive Summary */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Score Ring (4 cols) */}
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border p-6 text-center md:col-span-4",
                getScoreColor(analysis.atsScore),
              )}
            >
              <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                ATS Pass Score
              </span>
              <div className="font-heading my-3 flex items-baseline text-6xl font-black">
                {analysis.atsScore}
                <span className="text-2xl font-bold opacity-60">/100</span>
              </div>
              <span className="text-xs font-semibold">
                {analysis.atsScore >= 80
                  ? "Excellent — High Interview Likelihood"
                  : analysis.atsScore >= 60
                    ? "Good — Minor Keyword Gaps"
                    : "Needs Optimization to Pass ATS Filters"}
              </span>
            </div>

            {/* Summary & Formatting (8 cols) */}
            <div className="border-border/60 bg-muted/5 flex flex-col justify-between gap-4 rounded-2xl border p-6 md:col-span-8">
              <div>
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Executive AI Critique
                </span>
                <p className="text-foreground mt-2 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              <div className="border-border/40 border-t pt-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    ATS Formatting &amp; Parseability
                  </span>
                  <span className="text-foreground font-mono">
                    {analysis.formattingScore}%
                  </span>
                </div>
                <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                  {analysis.formattingFeedback.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Matched */}
            <div className="border-border/60 bg-muted/5 rounded-2xl border p-5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Matched Skills &amp; Keywords (
                  {analysis.matchedKeywords.length})
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {analysis.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="border-border/60 bg-muted/5 rounded-2xl border p-5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                <XCircle className="h-4 w-4" />
                <span>
                  Missing High-Priority Keywords (
                  {analysis.missingKeywords.length})
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {analysis.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* STAR Method Bullet Point Enhancer */}
          {analysis.bulletImprovements.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                <h4 className="font-heading text-foreground text-sm font-bold tracking-wider uppercase">
                  STAR-Method Bullet Point Rewriter
                </h4>
              </div>
              <div className="space-y-4">
                {analysis.bulletImprovements.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-border/60 bg-muted/5 rounded-xl border p-4 text-xs"
                  >
                    <div className="space-y-2">
                      <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-3">
                        <span className="text-destructive text-[10px] font-bold tracking-wider uppercase">
                          Original Weak Bullet:
                        </span>
                        <p className="text-muted-foreground mt-1 line-through">
                          {item.original}
                        </p>
                      </div>

                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                            STAR Optimized Bullet:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.improved, idx)}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] font-semibold"
                          >
                            {copiedIndex === idx ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedIndex === idx ? "Copied" : "Copy Bullet"}
                          </button>
                        </div>
                        <p className="text-foreground mt-1 leading-relaxed font-medium">
                          {item.improved}
                        </p>
                      </div>

                      <p className="text-muted-foreground px-1 text-[11px] italic">
                        <strong>Why it ranks higher:</strong> {item.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Quick Wins */}
          {analysis.actionableTips.length > 0 && (
            <div className="border-primary/20 bg-primary/5 rounded-2xl border p-5">
              <h4 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
                Top 3 Actions to Boost Your Score
              </h4>
              <ul className="text-muted-foreground mt-3 space-y-2 text-xs">
                {analysis.actionableTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="text-primary mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
