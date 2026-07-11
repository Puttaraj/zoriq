"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard, cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: "icon" | "button";
}

export function CopyButton({
  text,
  label = "Copy",
  className,
  variant = "button",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
          className,
        )}
        aria-label={copied ? "Copied!" : `Copy ${label}`}
      >
        {copied ? (
          <Check className="text-accent-surface h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
        copied && "border-accent-surface/30 text-accent-surface",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
