"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to monitoring service
    console.error("Local Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="container-tight relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      {/* Soft destructive ambient background glow */}
      <div className="bg-destructive/5 pointer-events-none absolute -z-10 h-[300px] w-[300px] rounded-full blur-[80px]" />

      <div className="flex flex-col items-center gap-6">
        {/* Error icon circle */}
        <div className="bg-destructive/10 text-destructive shadow-soft flex h-12 w-12 items-center justify-center rounded-xl">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-xs leading-relaxed sm:text-sm">
            An unexpected error occurred in your local browser sandbox. Try
            reloading the module or return to the dashboard.
          </p>
        </div>

        {/* Diagnostic Digest info */}
        {error.digest && (
          <code className="bg-muted text-muted-foreground border-border/40 rounded border px-2 py-1 font-mono text-[10px]">
            Error ID: {error.digest}
          </code>
        )}

        {/* CTA Options */}
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-sm transition-all sm:w-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="border-border bg-card hover:bg-muted focus-ring text-muted-foreground hover:text-foreground inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-semibold transition-all sm:w-auto"
          >
            <Home className="h-3.5 w-3.5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
