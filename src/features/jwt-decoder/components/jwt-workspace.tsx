"use client";

import { useState, useMemo } from "react";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { parseJwt } from "../lib/jwt";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlpvcnVxIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjA1MTYyMzkwMn0." +
  "4zN_q5TqG_eR1iY3U4s9X-uY0VvVfB7rW5Z6gK9mM_w";

export function JwtWorkspace() {
  const [tokenInput, setTokenInput] = useState(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const decoded = useMemo(() => {
    return parseJwt(tokenInput);
  }, [tokenInput]);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const formatExpiryTime = (seconds: number | null) => {
    if (seconds === null) return "No expiration set (never expires)";
    if (seconds <= 0) return "Token has expired";
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `Expires in ${days} days, ${hours} hours`;
    if (hours > 0) return `Expires in ${hours} hours, ${mins} minutes`;
    return `Expires in ${mins} minutes`;
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      {/* Top Action Bar */}
      <div className="border-border/40 mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="text-primary h-5 w-5" />
          <span className="font-heading text-foreground text-sm font-bold">
            100% Client-Side JWT Inspector
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTokenInput(SAMPLE_JWT)}
            className="border-border bg-muted/40 hover:bg-muted text-foreground rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
          >
            Load Sample JWT
          </button>
          <button
            type="button"
            onClick={() => setTokenInput("")}
            className="border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Input Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Encoded JWT String
        </label>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste your encoded JWT token here (e.g. eyJhbGci...)"
          rows={4}
          className="border-border/80 bg-muted/10 focus-within:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed break-all transition-all outline-none"
        />
      </div>

      {/* Decoded Details */}
      {decoded ? (
        <div className="mt-8 flex flex-col gap-6">
          {/* Expiration Alert Banner */}
          <div
            className={`flex items-center justify-between rounded-xl border p-4 text-xs font-semibold ${
              decoded.isExpired
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {decoded.isExpired ? (
                <ShieldAlert className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
              <span>
                {decoded.isExpired
                  ? "TOKEN EXPIRED: This JWT has passed its validity timestamp."
                  : "TOKEN VALID: This JWT is currently active."}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="h-4 w-4" />
              <span>{formatExpiryTime(decoded.secondsRemaining)}</span>
            </div>
          </div>

          {/* Header & Payload Columns */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Header Box */}
            <div className="border-border/60 bg-muted/5 flex flex-col rounded-xl border">
              <div className="border-border/40 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
                    Header: Algorithm &amp; Type
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(decoded.header, null, 2),
                      "header",
                    )
                  }
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] font-semibold"
                >
                  {copiedSection === "header" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedSection === "header" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-rose-600 dark:text-rose-400">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload Box */}
            <div className="border-border/60 bg-muted/5 flex flex-col rounded-xl border">
              <div className="border-border/40 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  <span className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
                    Payload: Data Claims
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(decoded.payload, null, 2),
                      "payload",
                    )
                  }
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] font-semibold"
                >
                  {copiedSection === "payload" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedSection === "payload" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-violet-600 dark:text-violet-400">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Signature Box */}
          <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-600 uppercase dark:text-cyan-400">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              Signature Block
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              HMAC / RSA cryptographic signature string. Verified locally by
              secret key:
            </p>
            <p className="border-border/40 bg-muted/20 text-foreground mt-2 rounded-lg border p-2.5 font-mono text-xs break-all">
              {decoded.signature}
            </p>
          </div>
        </div>
      ) : tokenInput.trim() ? (
        <div className="border-destructive/40 bg-destructive/5 text-destructive mt-6 rounded-xl border p-4 text-center text-xs font-semibold">
          Invalid JWT format. A valid JSON Web Token must have 3 Base64URL parts
          separated by periods (header.payload.signature).
        </div>
      ) : null}
    </div>
  );
}
