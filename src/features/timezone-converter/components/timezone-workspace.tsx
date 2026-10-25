"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, Copy, Check, Globe, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface CityZone {
  city: string;
  country: string;
  zone: string;
  flag: string;
}

const CITIES: CityZone[] = [
  { city: "Universal", country: "UTC", zone: "UTC", flag: "🌐" },
  {
    city: "Bengaluru",
    country: "India (IST)",
    zone: "Asia/Kolkata",
    flag: "🇮🇳",
  },
  {
    city: "San Francisco",
    country: "USA (PST/PDT)",
    zone: "America/Los_Angeles",
    flag: "🇺🇸",
  },
  {
    city: "New York",
    country: "USA (EST/EDT)",
    zone: "America/New_York",
    flag: "🇺🇸",
  },
  {
    city: "London",
    country: "UK (GMT/BST)",
    zone: "Europe/London",
    flag: "🇬🇧",
  },
  { city: "Tokyo", country: "Japan (JST)", zone: "Asia/Tokyo", flag: "🇯🇵" },
  {
    city: "Sydney",
    country: "Australia (AEST)",
    zone: "Australia/Sydney",
    flag: "🇦🇺",
  },
];

export function TimezoneWorkspace() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(() =>
    Math.floor(Date.now() / 1000),
  );
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      // only auto-update if near current time
      const realSeconds = Math.floor(Date.now() / 1000);
      if (Math.abs(currentEpoch - realSeconds) < 5) {
        setCurrentEpoch(realSeconds);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentEpoch]);

  const targetDate = useMemo(() => {
    const ms = unit === "seconds" ? currentEpoch * 1000 : currentEpoch;
    return new Date(isNaN(ms) ? Date.now() : ms);
  }, [currentEpoch, unit]);

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const setNow = () => {
    const now = Date.now();
    setCurrentEpoch(unit === "seconds" ? Math.floor(now / 1000) : now);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Unix Timestamp Converter Box */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Clock className="text-primary h-4 w-4" />
              Unix Epoch Timestamp
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={setNow}
                className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
              >
                <RefreshCw className="h-3 w-3" />
                Set to Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="border-border/80 bg-muted/10 focus-within:border-primary flex items-center rounded-xl border p-2 sm:col-span-8">
              <input
                type="number"
                value={currentEpoch}
                onChange={(e) => setCurrentEpoch(Number(e.target.value))}
                className="text-foreground w-full bg-transparent px-3 font-mono text-lg font-bold outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(String(currentEpoch), "epoch")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                {copiedKey === "epoch" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="border-border/60 bg-muted/20 flex rounded-xl border p-1 sm:col-span-4">
              <button
                type="button"
                onClick={() => {
                  if (unit === "milliseconds")
                    setCurrentEpoch(Math.floor(currentEpoch / 1000));
                  setUnit("seconds");
                }}
                className={`flex-1 rounded-lg py-1 text-xs font-semibold transition-all ${
                  unit === "seconds"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Seconds (s)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (unit === "seconds") setCurrentEpoch(currentEpoch * 1000);
                  setUnit("milliseconds");
                }}
                className={`flex-1 rounded-lg py-1 text-xs font-semibold transition-all ${
                  unit === "milliseconds"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Millis (ms)
              </button>
            </div>
          </div>

          {/* Formatted Date Badges */}
          <div className="grid grid-cols-1 gap-2 pt-1 text-xs sm:grid-cols-2">
            <div className="border-border/40 bg-muted/10 flex items-center justify-between rounded-lg border p-2.5">
              <span className="text-muted-foreground font-semibold">
                UTC String:
              </span>
              <span className="text-foreground font-mono font-bold">
                {targetDate.toUTCString()}
              </span>
            </div>
            <div className="border-border/40 bg-muted/10 flex items-center justify-between rounded-lg border p-2.5">
              <span className="text-muted-foreground font-semibold">
                ISO 8601:
              </span>
              <span className="text-foreground font-mono font-bold">
                {targetDate.toISOString()}
              </span>
            </div>
          </div>
        </div>

        {/* Global World Cities Comparison Grid */}
        <div className="border-border/60 flex flex-col gap-3 border-t pt-5">
          <div className="flex items-center justify-between">
            <span className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Globe className="text-primary h-4 w-4" />
              World Business Hubs Time Comparison
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {CITIES.map((c) => {
              const timeString = targetDate.toLocaleTimeString("en-US", {
                timeZone: c.zone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              });

              const dateString = targetDate.toLocaleDateString("en-US", {
                timeZone: c.zone,
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={c.city}
                  className="border-border/50 bg-card hover:border-primary/40 flex items-center justify-between rounded-xl border p-3.5 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <p className="text-foreground text-xs font-bold">
                        {c.city}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {c.country}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-foreground font-mono text-sm font-bold">
                      {timeString}
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      {dateString}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
