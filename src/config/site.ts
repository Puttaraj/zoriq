/**
 * ZORIQ — Site Configuration
 *
 * Single source of truth for site-wide constants.
 * Referenced by layouts, SEO helpers, and schema generators.
 */

export const siteConfig = {
  name: "ZORIQ",
  tagline: "Fast, Secure, AI-Powered Online Tools",
  description:
    "Free online tools for everyone — compress images, generate QR codes, format JSON, calculate EMI, and 100+ more utilities. Fast, secure, and beautifully designed.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zoriq.co.in",
  domain: "zoriq.co.in",

  /** Open Graph defaults */
  ogImage: "/og/default.png",

  /** Social links */
  links: {
    github: "https://github.com/zoriq",
    twitter: "https://twitter.com/zoriq_tools",
  },

  /** Contact */
  email: "hello@zoriq.co.in",

  /** Analytics IDs (loaded from env) */
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
    clarityId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "",
  },

  /** AdSense (loaded from env) */
  adsense: {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
  },

  /** Metadata for Schema.org Organization */
  organization: {
    name: "ZORIQ",
    url: "https://zoriq.co.in",
    logo: "https://zoriq.co.in/icons/logo.svg",
    foundingDate: "2026",
  },

  /** Default SEO values */
  seo: {
    titleTemplate: "%s | ZORIQ — Free Online Tools",
    defaultTitle: "ZORIQ — Free Online Tools for Everyone",
    defaultDescription:
      "Free online tools for everyone — compress images, generate QR codes, format JSON, calculate EMI, and 100+ more utilities.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
