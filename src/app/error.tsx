"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, etc.)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-2xl">
        <AlertTriangle className="text-destructive h-8 w-8" />
      </div>
      <h1 className="font-heading mt-6 text-2xl font-bold">
        Something Went Wrong
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        An unexpected error occurred. Please try again or go back to the
        homepage.
      </p>
      <button
        type="button"
        onClick={reset}
        className="gradient-brand focus-ring mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
