"use client";

import { useState, useMemo } from "react";
import { Copy, Check, AlertCircle, ArrowRightLeft } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const REGEX_PRESETS = [
  {
    label: "Email Address",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
  },
  {
    label: "URL / Web Address",
    pattern:
      "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
    flags: "g",
  },
  {
    label: "IPv4 Address",
    pattern:
      "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    flags: "g",
  },
  {
    label: "ISO Date (YYYY-MM-DD)",
    pattern: "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])",
    flags: "g",
  },
  {
    label: "HEX Color Code",
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    flags: "gi",
  },
];

interface MatchItem {
  index: number;
  match: string;
  groups: string[];
}

export function RegexWorkspace() {
  const [pattern, setPattern] = useState(
    "([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})",
  );
  const [flags, setFlags] = useState({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
  });
  const [testString, setTestString] = useState(
    "Contact our team at hello@zoriq.co.in or support@company.org for assistance.",
  );
  const [replaceString, setReplaceString] = useState("USER($1) DOMAIN($2)");
  const [showReplace, setShowReplace] = useState(false);
  const [copied, setCopied] = useState(false);

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([_, active]) => active)
      .map(([f]) => f)
      .join("");
  }, [flags]);

  const { matches, error, replacedText } = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replacedText: testString };

    try {
      const reg = new RegExp(pattern, flagString);
      const matchItems: MatchItem[] = [];

      if (flags.g) {
        let m: RegExpExecArray | null;
        let loopLimit = 0;
        while ((m = reg.exec(testString)) !== null && loopLimit < 200) {
          loopLimit++;
          matchItems.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
          if (m.index === reg.lastIndex) {
            reg.lastIndex++;
          }
        }
      } else {
        const m = reg.exec(testString);
        if (m) {
          matchItems.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
        }
      }

      let rep = testString;
      try {
        rep = testString.replace(
          new RegExp(pattern, flagString),
          replaceString,
        );
      } catch {
        // ignore replace error
      }

      return { matches: matchItems, error: null, replacedText: rep };
    } catch (err) {
      return {
        matches: [],
        error:
          err instanceof Error ? err.message : "Invalid Regular Expression",
        replacedText: testString,
      };
    }
  }, [pattern, flagString, testString, replaceString, flags.g]);

  const toggleFlag = (flag: "g" | "i" | "m" | "s" | "u") => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleCopyPattern = async () => {
    const success = await copyToClipboard(`/${pattern}/${flagString}`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Pattern Input & Flags Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Regular Expression Pattern
            </span>
            <button
              type="button"
              onClick={handleCopyPattern}
              className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copied ? "Copied /pattern/flags" : "Copy Pattern"}
            </button>
          </div>

          <div className="border-border/80 bg-muted/10 focus-within:border-primary flex items-center rounded-xl border p-2">
            <span className="text-muted-foreground/60 px-2 font-mono text-lg font-bold">
              /
            </span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern (e.g. [a-z0-9]+)..."
              className="text-foreground w-full bg-transparent font-mono text-sm font-semibold outline-none sm:text-base"
            />
            <span className="text-muted-foreground/60 px-2 font-mono text-lg font-bold">
              /
            </span>
            <span className="text-primary pr-2 font-mono text-sm font-bold">
              {flagString}
            </span>
          </div>

          {error && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Flag Pills */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-muted-foreground text-xs font-semibold">
              Flags:
            </span>
            {(["g", "i", "m", "s", "u"] as const).map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold transition-all ${
                  flags[flag]
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                }`}
                title={`Flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {/* Common Preset Templates */}
        <div className="flex flex-col gap-2">
          <span className="text-foreground text-xs font-bold tracking-wider uppercase">
            Quick Regex Templates
          </span>
          <div className="flex flex-wrap gap-2">
            {REGEX_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setPattern(p.pattern);
                  setFlags({
                    g: p.flags.includes("g"),
                    i: p.flags.includes("i"),
                    m: p.flags.includes("m"),
                    s: p.flags.includes("s"),
                    u: p.flags.includes("u"),
                  });
                }}
                className="border-border/60 bg-muted/10 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test String Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Test String
            </span>
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-bold">
              {matches.length} {matches.length === 1 ? "match" : "matches"}{" "}
              found
            </span>
          </div>

          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={5}
            className="border-border/80 bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
            placeholder="Type or paste sample text to test your regular expression..."
          />
        </div>

        {/* Match Breakdown List */}
        <div className="flex flex-col gap-2">
          <span className="text-foreground text-xs font-bold tracking-wider uppercase">
            Captured Matches Breakdown
          </span>

          <div className="border-border/40 bg-muted/15 flex max-h-56 flex-col gap-2 overflow-y-auto rounded-xl border p-3 font-mono text-xs">
            {matches.length > 0 ? (
              matches.map((item, idx) => (
                <div
                  key={idx}
                  className="border-border/60 bg-card/80 flex flex-col gap-1.5 rounded-lg border p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">
                      Match #{idx + 1} (Index: {item.index})
                    </span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Length {item.match.length}
                    </span>
                  </div>
                  <div className="text-foreground bg-muted/30 rounded p-1.5 break-all">
                    {item.match}
                  </div>
                  {item.groups.length > 0 && (
                    <div className="border-border/30 mt-1 flex flex-col gap-1 border-t pt-1 text-[11px]">
                      {item.groups.map((grp, gIdx) => (
                        <div
                          key={gIdx}
                          className="text-muted-foreground flex items-center gap-2"
                        >
                          <span className="text-primary/80 font-semibold">
                            Group {gIdx + 1}:
                          </span>
                          <span className="text-foreground font-mono">
                            {grp || "(empty)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-6 text-center text-xs">
                No matches found in the test string.
              </div>
            )}
          </div>
        </div>

        {/* Optional Substitution Toggle & Preview */}
        <div className="border-border/60 border-t pt-4">
          <button
            type="button"
            onClick={() => setShowReplace(!showReplace)}
            className="text-primary mb-3 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            {showReplace
              ? "Hide Find & Replace Preview"
              : "Show Find & Replace Mode"}
          </button>

          {showReplace && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Replacement Pattern ($1, $2, etc.)
                </label>
                <input
                  type="text"
                  value={replaceString}
                  onChange={(e) => setReplaceString(e.target.value)}
                  className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2.5 font-mono text-xs outline-none"
                  placeholder="e.g. $1 or replacement string"
                />
              </div>

              <div>
                <span className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Substitution Output
                </span>
                <pre className="border-border bg-muted/20 text-foreground max-h-36 overflow-auto rounded-lg border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {replacedText}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
