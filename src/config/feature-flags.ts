/**
 * ZORIQ — Feature Flags
 *
 * Controls feature visibility across the platform.
 * Every future feature must be gated behind a feature flag.
 *
 * States:
 *   "enabled"  — visible to all users
 *   "disabled" — hidden from everyone
 *   "beta"     — visible with a "Beta" badge
 *   "internal" — visible only in development mode
 */

import type { FeatureState } from "@/types/tool";

interface FeatureFlag {
  /** Unique identifier */
  key: string;
  /** Human-readable name */
  name: string;
  /** Current state */
  state: FeatureState;
  /** Optional description */
  description?: string;
}

const featureFlags: FeatureFlag[] = [
  // ── Phase 1: Launched ──
  {
    key: "password-generator",
    name: "Password Generator",
    state: "enabled",
  },
  {
    key: "uuid-generator",
    name: "UUID Generator",
    state: "enabled",
  },
  {
    key: "qr-generator",
    name: "QR Code Generator",
    state: "enabled",
  },
  {
    key: "json-formatter",
    name: "JSON Formatter",
    state: "enabled",
  },
  {
    key: "word-counter",
    name: "Word Counter",
    state: "enabled",
  },
  {
    key: "age-calculator",
    name: "Age Calculator",
    state: "enabled",
  },
  {
    key: "emi-calculator",
    name: "EMI Calculator",
    state: "enabled",
  },
  {
    key: "image-compressor",
    name: "Image Compressor",
    state: "enabled",
  },
  {
    key: "image-converter",
    name: "Image Converter",
    state: "enabled",
  },

  // ── Phase 2: Coming Soon ──
  {
    key: "pdf-compressor",
    name: "PDF Compressor",
    state: "disabled",
    description: "Phase 2 — PDF processing tools",
  },
  {
    key: "pdf-merge",
    name: "PDF Merge",
    state: "disabled",
  },
  {
    key: "pdf-split",
    name: "PDF Split",
    state: "disabled",
  },

  // ── Phase 6: AI Tools ──
  {
    key: "ai-resume-builder",
    name: "AI Resume Builder",
    state: "disabled",
    description: "Phase 6 — Zoriq AI module",
  },
  {
    key: "ai-image-enhancer",
    name: "AI Image Enhancer",
    state: "disabled",
  },

  // ── Platform Features ──
  {
    key: "adsense",
    name: "Google AdSense",
    state: "disabled",
    description: "Enable after AdSense approval",
  },
  {
    key: "blog",
    name: "Blog Section",
    state: "disabled",
    description: "Phase 4 — MDX blog infrastructure",
  },
  {
    key: "admin",
    name: "Admin Panel",
    state: "disabled",
    description: "Phase 5 — /admin module",
  },
];

/**
 * Check if a feature is enabled.
 * In development mode, "internal" features are also enabled.
 */
export function isFeatureEnabled(key: string): boolean {
  const flag = featureFlags.find((f) => f.key === key);
  if (!flag) return false;

  if (flag.state === "enabled") return true;
  if (flag.state === "beta") return true;
  if (flag.state === "internal" && process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

/**
 * Check if a feature is in beta.
 */
export function isFeatureBeta(key: string): boolean {
  const flag = featureFlags.find((f) => f.key === key);
  return flag?.state === "beta";
}

/**
 * Get all feature flags (for admin panel, Phase 5).
 */
export function getAllFeatureFlags(): FeatureFlag[] {
  return featureFlags;
}
