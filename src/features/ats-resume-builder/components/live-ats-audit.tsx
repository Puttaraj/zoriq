"use client";

import { CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { AtsAuditResult } from "../types/resume";
import { cn } from "@/lib/utils";

interface LiveAtsAuditProps {
  audit: AtsAuditResult;
}

export function LiveAtsAudit({ audit }: LiveAtsAuditProps) {
  const getBadgeColor = (score: number) => {
    if (score >= 85)
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    if (score >= 60)
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
  };

  return (
    <div className="border-border/60 bg-muted/5 flex flex-col gap-3 rounded-xl border p-4">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary h-4 w-4" />
          <span className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
            Real-Time ATS Pass Meter
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-bold",
            getBadgeColor(audit.score),
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>{audit.score} / 100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full transition-all duration-500",
            audit.score >= 85
              ? "bg-emerald-500"
              : audit.score >= 60
                ? "bg-amber-500"
                : "bg-rose-500",
          )}
          style={{ width: `${audit.score}%` }}
        />
      </div>

      {/* What to Fix Checklist */}
      {audit.missingCrucials.length > 0 ? (
        <div className="mt-1 space-y-1.5">
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Fix these to reach 95%+ ATS Score:
          </span>
          <ul className="space-y-1 text-xs">
            {audit.missingCrucials.slice(0, 3).map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400"
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-[11px] leading-tight">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            Perfect! Your resume meets 100% of corporate ATS parsing rules.
          </span>
        </div>
      )}
    </div>
  );
}
