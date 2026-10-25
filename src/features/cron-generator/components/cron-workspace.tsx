"use client";

import { useState, useMemo } from "react";
import { Clock, Copy, Check, Sparkles } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const PRESETS = [
  { label: "Every Minute", cron: "* * * * *" },
  { label: "Every 15 Minutes", cron: "*/15 * * * *" },
  { label: "Every Hour at :00", cron: "0 * * * *" },
  { label: "Every Day at Midnight", cron: "0 0 * * *" },
  { label: "Every Weekday at 9 AM", cron: "0 9 * * 1-5" },
  { label: "Every Sunday at Midnight", cron: "0 0 * * 0" },
  { label: "1st of Every Month at Midnight", cron: "0 0 1 * *" },
];

function explainCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return "Invalid cron expression. Expected 5 fields: minute hour day-of-month month day-of-week.";
  }

  const [min, hour, dom, mon, dow] = parts;

  // Simple, robust human translation
  let timeStr = "";
  if (min === "*" && hour === "*") {
    timeStr = "every minute";
  } else if (min.startsWith("*/")) {
    timeStr = `every ${min.replace("*/", "")} minutes`;
  } else if (min === "0" && hour === "*") {
    timeStr = "at the start of every hour";
  } else if (min === "0" && hour === "0") {
    timeStr = "at midnight (00:00)";
  } else {
    timeStr = `at minute ${min} past hour ${hour}`;
  }

  const domStr = dom === "*" ? "" : ` on day ${dom} of the month`;
  const monStr = mon === "*" ? "" : ` in month ${mon}`;
  const dowMap: Record<string, string> = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
    "7": "Sunday",
    "1-5": "Monday through Friday",
  };
  const dowStr =
    dow === "*" ? "" : ` on ${dowMap[dow] || `day-of-week ${dow}`}`;

  return `Runs ${timeStr}${domStr}${monStr}${dowStr}.`;
}

function calculateNextRuns(expression: string, count = 5): string[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const results: string[] = [];
  const now = new Date();
  let cursor = new Date(now.getTime() + 60000);
  cursor.setSeconds(0, 0);

  // Simple simulator for upcoming runs
  for (let i = 0; i < 500 && results.length < count; i++) {
    const curMin = cursor.getMinutes();
    const curHour = cursor.getHours();
    const curDay = cursor.getDate();
    const curMonth = cursor.getMonth() + 1;
    const curDow = cursor.getDay();

    const [min, hour, dom, mon, dow] = parts;

    const matchMin =
      min === "*" ||
      (min.startsWith("*/") && curMin % Number(min.slice(2)) === 0) ||
      Number(min) === curMin;

    const matchHour =
      hour === "*" ||
      (hour.startsWith("*/") && curHour % Number(hour.slice(2)) === 0) ||
      Number(hour) === curHour;

    const matchDom = dom === "*" || Number(dom) === curDay;
    const matchMon = mon === "*" || Number(mon) === curMonth;
    const matchDow =
      dow === "*" ||
      (dow === "1-5" && curDow >= 1 && curDow <= 5) ||
      Number(dow) === curDow ||
      (dow === "7" && curDow === 0);

    if (matchMin && matchHour && matchDom && matchMon && matchDow) {
      results.push(
        cursor.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    }
    cursor = new Date(cursor.getTime() + 60000);
  }

  return results;
}

export function CronWorkspace() {
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);

  const parts = useMemo(() => {
    const split = cronExpression.trim().split(/\s+/);
    return {
      minute: split[0] || "*",
      hour: split[1] || "*",
      dom: split[2] || "*",
      month: split[3] || "*",
      dow: split[4] || "*",
    };
  }, [cronExpression]);

  const explanation = useMemo(() => {
    return explainCron(cronExpression);
  }, [cronExpression]);

  const nextRuns = useMemo(() => {
    return calculateNextRuns(cronExpression, 5);
  }, [cronExpression]);

  const handleCopy = async () => {
    const success = await copyToClipboard(cronExpression);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const updateField = (
    field: "minute" | "hour" | "dom" | "month" | "dow",
    value: string,
  ) => {
    const currentParts = cronExpression.trim().split(/\s+/);
    while (currentParts.length < 5) currentParts.push("*");

    const indexMap = { minute: 0, hour: 1, dom: 2, month: 3, dow: 4 };
    currentParts[indexMap[field]] = value || "*";
    setCronExpression(currentParts.join(" "));
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Main Expression Input & Copy Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Cron Expression (5 Fields)
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              Linux Crontab / GitHub Actions
            </span>
          </div>

          <div className="border-border/80 bg-muted/10 focus-within:border-primary flex items-center justify-between rounded-xl border p-2">
            <input
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              className="text-foreground w-full bg-transparent px-3 font-mono text-lg font-bold tracking-widest outline-none sm:text-2xl"
              placeholder="* * * * *"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Human Translation Card */}
        <div className="border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border p-4">
          <Sparkles className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Human Translation
            </span>
            <p className="text-foreground mt-0.5 text-sm leading-relaxed font-medium">
              &ldquo;{explanation}&rdquo;
            </p>
          </div>
        </div>

        {/* 5-Field Breakdown Configurator */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { id: "minute", label: "Minute", val: parts.minute, hint: "0-59" },
            { id: "hour", label: "Hour", val: parts.hour, hint: "0-23" },
            { id: "dom", label: "Day", val: parts.dom, hint: "1-31" },
            { id: "month", label: "Month", val: parts.month, hint: "1-12" },
            { id: "dow", label: "Weekday", val: parts.dow, hint: "0-6" },
          ].map((col) => (
            <div
              key={col.id}
              className="border-border/60 bg-muted/15 flex flex-col items-center rounded-xl border p-2.5"
            >
              <span className="text-muted-foreground text-[10px] font-bold uppercase">
                {col.label}
              </span>
              <input
                type="text"
                value={col.val}
                onChange={(e) =>
                  updateField(
                    col.id as "minute" | "hour" | "dom" | "month" | "dow",
                    e.target.value,
                  )
                }
                className="text-foreground w-full bg-transparent text-center font-mono text-sm font-bold outline-none"
              />
              <span className="text-muted-foreground/60 text-[9px]">
                {col.hint}
              </span>
            </div>
          ))}
        </div>

        {/* Preset Templates */}
        <div className="flex flex-col gap-2">
          <span className="text-foreground text-xs font-bold tracking-wider uppercase">
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.cron}
                type="button"
                onClick={() => setCronExpression(p.cron)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  cronExpression === p.cron
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 bg-muted/10 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Next 5 Upcoming Execution Times */}
        <div className="border-border/60 flex flex-col gap-3 border-t pt-5">
          <div className="flex items-center gap-1.5">
            <Clock className="text-primary h-4 w-4" />
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Next 5 Scheduled Execution Runs
            </span>
          </div>

          <div className="border-border/40 bg-muted/15 divide-border/20 flex flex-col divide-y rounded-xl border">
            {nextRuns.length > 0 ? (
              nextRuns.map((run, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 text-xs"
                >
                  <span className="text-muted-foreground font-semibold">
                    Run #{idx + 1}
                  </span>
                  <span className="text-foreground font-mono font-bold">
                    {run}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center text-xs">
                Enter a valid cron expression to calculate future schedules.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
