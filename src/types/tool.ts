/**
 * ZORIQ — Global Type Definitions for Tools
 *
 * Central type definitions used by the tool registry, tool pages,
 * and feature modules.
 */

/** Tool processing location */
export type ProcessingLocation = "client" | "server" | "hybrid";

/** Tool input type determines the primary UI pattern */
export type ToolInputType = "file" | "text" | "form" | "none";

/** Tool category slugs */
export type ToolCategory =
  | "developer"
  | "image"
  | "pdf"
  | "ai"
  | "finance"
  | "student"
  | "text"
  | "converter"
  | "utilities";

/** Feature flag states */
export type FeatureState = "enabled" | "disabled" | "beta" | "internal";

/** FAQ item */
export interface FAQ {
  question: string;
  answer: string;
}

/** Tool configuration — drives the entire tool ecosystem */
export interface ToolConfig {
  /** URL slug: "image-compressor" → /tools/image-compressor */
  slug: string;
  /** Display name shown in UI */
  name: string;
  /** Full SEO description (<155 chars) */
  description: string;
  /** Short description for tool cards (<80 chars) */
  shortDescription: string;
  /** Category for grouping and filtering */
  category: ToolCategory;
  /** Lucide icon name */
  icon: string;
  /** Key features shown on tool page */
  features: string[];
  /** Primary input pattern */
  inputType: ToolInputType;
  /** Accepted MIME types for file-based tools */
  acceptedFormats?: string[];
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Where processing happens */
  processingLocation: ProcessingLocation;
  /** Badge: show "New" tag */
  isNew?: boolean;
  /** Badge: premium-only (Phase 2) */
  isPro?: boolean;
  /** AI enhancement available (Phase 2) */
  aiEnhanced?: boolean;
  /** Slugs of related tools for cross-linking */
  relatedTools: string[];
  /** Schema.org type for structured data */
  schemaType: "WebApplication" | "SoftwareApplication";
  /** SEO keywords for this tool */
  keywords: string[];
}

/** Category definition for the categories section */
export interface CategoryConfig {
  slug: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  toolCount: number;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  isExternal?: boolean;
}

/** Navigation section (footer) */
export interface NavSection {
  title: string;
  links: NavLink[];
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** SEO metadata for a page */
export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  ogImage?: string;
}

/** Schema.org JSON-LD types used across the platform */
export interface SchemaOrg {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}
