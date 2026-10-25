"use client";

import { useState, useMemo, useEffect } from "react";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Copy,
  Check,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import {
  parseJwt,
  formatDetailedCountdown,
  verifyHmacSha256,
} from "../lib/jwt";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlpvcnVxIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjA1MTYyMzkwMn0." +
  "4zN_q5TqG_eR1iY3U4s9X-uY0VvVfB7rW5Z6gK9mM_w";

export function JwtWorkspace() {
  const [tokenInput, setTokenInput] = useState(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<
    "idle" | "valid" | "invalid"
  >("idle");
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Real-time 1-second interval ticker for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const decoded = useMemo(() => {
    return parseJwt(tokenInput);
  }, [tokenInput]);

  const liveCountdown = useMemo(() => {
    if (!decoded || !decoded.expiresAt) {
      return formatDetailedCountdown(null);
    }
    const diffSeconds = Math.floor(
      (decoded.expiresAt.getTime() - currentTime) / 1000,
    );
    return formatDetailedCountdown(diffSeconds);
  }, [decoded, currentTime]);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleVerifySecret = async () => {
    if (!tokenInput.trim() || !secretKey) {
      setVerifyStatus("idle");
      return;
    }
    setIsVerifying(true);
    try {
      const isValid = await verifyHmacSha256(tokenInput, secretKey);
      setVerifyStatus(isValid ? "valid" : "invalid");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      {/* Top Action Bar */}
      <div className="border-border/40 mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="text-primary h-5 w-5" />
          <span className="font-heading text-foreground text-sm font-bold">
            100% Client-Side JWT Inspector &amp; Verifier
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTokenInput(SAMPLE_JWT);
              setVerifyStatus("idle");
            }}
            className="border-border bg-muted/40 hover:bg-muted text-foreground rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
          >
            Load Sample JWT
          </button>
          <button
            type="button"
            onClick={() => {
              setTokenInput("");
              setSecretKey("");
              setVerifyStatus("idle");
            }}
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
          onChange={(e) => {
            setTokenInput(e.target.value);
            setVerifyStatus("idle");
          }}
          placeholder="Paste your encoded JWT token here (e.g. eyJhbGci...)"
          rows={4}
          className="border-border/80 bg-muted/10 focus-within:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed break-all transition-all outline-none"
        />
      </div>

      {/* Decoded Details */}
      {decoded ? (
        <div className="mt-8 flex flex-col gap-6">
          {/* Live Expiration Countdown Banner */}
          <div
            className={`flex flex-col justify-between gap-3 rounded-xl border p-4 text-xs font-semibold sm:flex-row sm:items-center ${
              liveCountdown.severity === "expired"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : liveCountdown.severity === "urgent"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : liveCountdown.severity === "valid"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border/40 bg-muted/30 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              {liveCountdown.severity === "expired" ? (
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              ) : (
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
              )}
              <span>
                {liveCountdown.severity === "expired"
                  ? "TOKEN EXPIRED"
                  : liveCountdown.severity === "urgent"
                    ? "EXPIRING SOON"
                    : liveCountdown.severity === "valid"
                      ? "TOKEN ACTIVE & VALID"
                      : "LIFETIME TOKEN"}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <Clock className="h-4 w-4" />
              <span className="font-bold tracking-wide">
                {liveCountdown.text}
              </span>
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

          {/* Signature Verification Block with HMAC-SHA256 Input */}
          <div className="border-border/60 bg-muted/5 rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-600 uppercase dark:text-cyan-400">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                HMAC-SHA256 Signature Verification
              </div>
              <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-normal">
                <Lock className="h-3 w-3" />
                100% In-Browser (Secret never transmitted)
              </span>
            </div>

            <p className="text-muted-foreground mt-1 text-xs">
              Raw signature token string:
            </p>
            <p className="border-border/40 bg-muted/20 text-foreground mt-1.5 rounded-lg border p-2.5 font-mono text-xs break-all">
              {decoded.signature}
            </p>

            {/* Secret Verification Field */}
            <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  setVerifyStatus("idle");
                }}
                placeholder="Enter secret key to verify HMAC-SHA256 signature..."
                className="border-border/80 bg-background focus:border-primary flex-1 rounded-lg border px-3 py-2 font-mono text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleVerifySecret}
                disabled={!secretKey.trim() || isVerifying}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Signature"}
              </button>
            </div>

            {/* Verification Status Feedback */}
            {verifyStatus === "valid" && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>
                  ✓ Signature Verified: The provided secret matches the
                  token&apos;s HMAC-SHA256 signature.
                </span>
              </div>
            )}
            {verifyStatus === "invalid" && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive mt-3 flex items-center gap-2 rounded-lg border p-3 text-xs font-semibold">
                <XCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  ✗ Signature Mismatch: The provided secret does not match this
                  token&apos;s cryptographic signature.
                </span>
              </div>
            )}
            {verifyStatus === "idle" && !secretKey && (
              <p className="text-muted-foreground mt-2 flex items-center gap-1 text-[11px]">
                <HelpCircle className="h-3.5 w-3.5" />
                Provide your API secret key above to mathematically verify if
                this token was signed by your server.
              </p>
            )}
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
