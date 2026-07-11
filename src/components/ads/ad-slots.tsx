/**
 * ZORIQ — AdSense Component Architecture
 *
 * Placeholder components that render ad slots when AdSense is enabled.
 * Follows Google AdSense policies:
 *   - Ads never block usability
 *   - CLS remains below Google's limits (reserved height)
 *   - Ads load lazily
 *   - No ads on pages with insufficient content
 */

"use client";

import { useRef } from "react";
import { isFeatureEnabled } from "@/config/feature-flags";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  /** AdSense slot ID */
  slot?: string;
  /** Ad format */
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  /** Reserved height to prevent CLS */
  reservedHeight?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Base ad component. All ad variants build on this.
 * Renders nothing when AdSense feature flag is disabled.
 */
function AdSlot({
  slot,
  format = "auto",
  reservedHeight = 100,
  className,
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isEnabled = isFeatureEnabled("adsense");

  if (!isEnabled) return null;

  return (
    <div
      ref={adRef}
      className={cn(
        "bg-muted/30 flex items-center justify-center overflow-hidden rounded-lg",
        className,
      )}
      style={{ minHeight: reservedHeight }}
      aria-hidden="true"
      data-ad-slot={slot}
      data-ad-format={format}
    >
      {/* AdSense script will fill this container */}
      <span className="text-muted-foreground/40 text-xs">Ad</span>
    </div>
  );
}

/** Horizontal banner ad — below header or between sections */
export function BannerAd({ className }: { className?: string }) {
  return (
    <AdSlot
      format="horizontal"
      reservedHeight={90}
      className={cn("w-full", className)}
    />
  );
}

/** Responsive ad — adapts to container */
export function ResponsiveAd({ className }: { className?: string }) {
  return (
    <AdSlot
      format="auto"
      reservedHeight={250}
      className={cn("w-full", className)}
    />
  );
}

/** Sidebar ad — for desktop sidebar layouts */
export function SidebarAd({ className }: { className?: string }) {
  return (
    <AdSlot
      format="vertical"
      reservedHeight={600}
      className={cn("hidden w-[300px] lg:block", className)}
    />
  );
}

/** In-article ad — between content sections */
export function InArticleAd({ className }: { className?: string }) {
  return (
    <AdSlot
      format="auto"
      reservedHeight={250}
      className={cn("my-8 w-full", className)}
    />
  );
}

/** Sticky mobile ad — fixed at bottom on mobile */
export function StickyMobileAd() {
  const isEnabled = isFeatureEnabled("adsense");
  if (!isEnabled) return null;

  return (
    <div
      className="border-border bg-background fixed inset-x-0 bottom-0 z-40 border-t p-2 sm:hidden"
      aria-hidden="true"
    >
      <AdSlot format="horizontal" reservedHeight={50} className="w-full" />
    </div>
  );
}

/**
 * Ad placeholder — shows where an ad will go in development.
 * Only visible when NODE_ENV is development and AdSense is disabled.
 */
export function AdPlaceholder({
  label = "Ad Placement",
  height = 100,
  className,
}: {
  label?: string;
  height?: number;
  className?: string;
}) {
  if (process.env.NODE_ENV !== "development" || isFeatureEnabled("adsense")) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-muted-foreground/20 bg-muted/20 flex items-center justify-center rounded-lg border-2 border-dashed",
        className,
      )}
      style={{ minHeight: height }}
    >
      <span className="text-muted-foreground/40 text-xs">{label}</span>
    </div>
  );
}
