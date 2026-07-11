"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const shareUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title ?? "Check out this tool on ZORIQ";

  const handleShare = async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      } catch {
        // User cancelled or not supported — fall through to copy
      }
    }

    // Fallback: copy link
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
        shared && "border-accent-surface/30 text-accent-surface",
        className,
      )}
    >
      {shared ? (
        <>
          <Check className="h-4 w-4" />
          Link copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </button>
  );
}
