/**
 * ZORIQ — Tool Registry
 *
 * Central registry of all tools on the platform.
 * Every tool page, the homepage, the sitemap, and the search
 * all derive their data from this single array.
 *
 * To add a new tool:
 *   1. Add an entry here
 *   2. Create the feature module in src/features/<slug>/
 *   3. Create the route page in src/app/tools/<slug>/page.tsx
 */

import type { ToolConfig } from "@/types/tool";

export const tools: ToolConfig[] = [
  // ──────────────────────────────────
  // Developer Tools
  // ──────────────────────────────────
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Generate strong, secure passwords instantly. Customize length, include symbols, numbers, and uppercase letters. Free online password generator.",
    shortDescription: "Generate strong, secure passwords instantly",
    category: "developer",
    icon: "KeyRound",
    features: [
      "Customizable length (8–128 characters)",
      "Include/exclude uppercase, lowercase, numbers, symbols",
      "Password strength indicator",
      "One-click copy to clipboard",
      "Bulk generation (up to 50 passwords)",
      "No data stored — 100% client-side",
    ],
    inputType: "form",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["uuid-generator", "qr-generator", "json-formatter"],
    schemaType: "WebApplication",
    keywords: [
      "password generator",
      "strong password",
      "secure password",
      "random password",
      "password creator",
    ],
  },

  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description:
      "Generate UUIDs (v4) instantly. Create unique identifiers for databases, APIs, and applications. Free online UUID generator with bulk generation.",
    shortDescription: "Generate unique UUIDs (v4) instantly",
    category: "developer",
    icon: "Fingerprint",
    features: [
      "UUID v4 generation",
      "Bulk generation (up to 100 UUIDs)",
      "Uppercase/lowercase toggle",
      "One-click copy",
      "Copy all with one click",
      "No data stored — 100% client-side",
    ],
    inputType: "none",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["password-generator", "json-formatter", "qr-generator"],
    schemaType: "WebApplication",
    keywords: [
      "uuid generator",
      "guid generator",
      "unique id",
      "uuid v4",
      "random uuid",
    ],
  },

  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format, validate, and beautify JSON data online. Minify JSON, fix syntax errors, and view JSON in a tree structure. Free JSON formatter and validator.",
    shortDescription: "Format, validate & beautify JSON data",
    category: "developer",
    icon: "Braces",
    features: [
      "Format and beautify JSON",
      "Minify JSON",
      "Validate JSON syntax",
      "Adjustable indentation (2/4 spaces, tabs)",
      "Copy formatted output",
      "Error highlighting with line numbers",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["password-generator", "uuid-generator", "word-counter"],
    schemaType: "WebApplication",
    keywords: [
      "json formatter",
      "json beautifier",
      "json validator",
      "format json",
      "json viewer",
    ],
  },

  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description:
      "Create QR codes for URLs, text, WiFi, vCards, and more. Customize colors, size, and download as PNG or SVG. Free online QR code generator.",
    shortDescription: "Create customizable QR codes instantly",
    category: "developer",
    icon: "QrCode",
    features: [
      "Generate QR codes for URLs, text, WiFi, email",
      "Custom foreground and background colors",
      "Adjustable size and error correction",
      "Download as PNG or SVG",
      "Share directly",
      "No data stored — 100% client-side",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["password-generator", "uuid-generator", "image-converter"],
    schemaType: "WebApplication",
    keywords: [
      "qr code generator",
      "qr maker",
      "create qr code",
      "qr code free",
      "custom qr code",
    ],
  },

  // ──────────────────────────────────
  // Text / Student Tools
  // ──────────────────────────────────
  {
    slug: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs instantly. Check reading time and keyword density. Free online word counter tool.",
    shortDescription: "Count words, characters & reading time",
    category: "student",
    icon: "FileText",
    features: [
      "Real-time word count",
      "Character count (with/without spaces)",
      "Sentence and paragraph count",
      "Reading time estimate",
      "Speaking time estimate",
      "Keyword density analysis",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["json-formatter", "age-calculator", "password-generator"],
    schemaType: "WebApplication",
    keywords: [
      "word counter",
      "character counter",
      "word count online",
      "letter counter",
      "reading time calculator",
    ],
  },

  {
    slug: "age-calculator",
    name: "Age Calculator",
    description:
      "Calculate your exact age in years, months, days, hours, minutes, and seconds. Find age on any date. Free online age calculator.",
    shortDescription: "Calculate exact age in years, months & days",
    category: "student",
    icon: "Calendar",
    features: [
      "Exact age in years, months, and days",
      "Age in total days, hours, minutes, seconds",
      "Next birthday countdown",
      "Age on any specific date",
      "Day of the week you were born",
      "Zodiac sign detection",
    ],
    inputType: "form",
    processingLocation: "client",
    relatedTools: ["emi-calculator", "word-counter", "password-generator"],
    schemaType: "WebApplication",
    keywords: [
      "age calculator",
      "date of birth calculator",
      "how old am i",
      "exact age",
      "age in days",
    ],
  },

  // ──────────────────────────────────
  // Finance Tools
  // ──────────────────────────────────
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description:
      "Calculate your monthly EMI for home loans, car loans, and personal loans. View amortization schedule with detailed breakdown. Free EMI calculator India.",
    shortDescription: "Calculate monthly EMI for any loan",
    category: "finance",
    icon: "IndianRupee",
    features: [
      "Instant EMI calculation",
      "Total interest & total payment breakdown",
      "Visual pie chart breakdown",
      "Monthly amortization schedule",
      "Adjustable loan amount, rate, and tenure",
      "Supports home, car, and personal loans",
    ],
    inputType: "form",
    processingLocation: "client",
    relatedTools: ["age-calculator", "word-counter", "password-generator"],
    schemaType: "WebApplication",
    keywords: [
      "emi calculator",
      "loan emi calculator",
      "home loan emi",
      "car loan emi",
      "emi calculator india",
    ],
  },

  // ──────────────────────────────────
  // Image Tools
  // ──────────────────────────────────
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress images without losing quality. Reduce JPEG, PNG, and WebP file sizes by up to 80%. Free online image compressor with batch processing.",
    shortDescription: "Compress images without losing quality",
    category: "image",
    icon: "ImageDown",
    features: [
      "Compress JPEG, PNG, and WebP images",
      "Adjustable quality slider",
      "Up to 80% size reduction",
      "Side-by-side preview (before/after)",
      "Batch compression (up to 20 images)",
      "Download all as ZIP",
    ],
    inputType: "file",
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    processingLocation: "client",
    isNew: true,
    relatedTools: ["image-converter", "qr-generator"],
    schemaType: "WebApplication",
    keywords: [
      "image compressor",
      "compress image",
      "reduce image size",
      "compress jpg",
      "compress png",
    ],
  },

  {
    slug: "image-converter",
    name: "Image Converter",
    description:
      "Convert images between JPEG, PNG, WebP, and BMP formats instantly. Batch convert multiple images. Free online image format converter.",
    shortDescription: "Convert images between JPEG, PNG & WebP",
    category: "image",
    icon: "ArrowRightLeft",
    features: [
      "Convert between JPEG, PNG, WebP, and BMP",
      "Batch conversion (up to 20 images)",
      "Adjustable output quality",
      "Preview before download",
      "Download all as ZIP",
      "No upload — 100% browser-based",
    ],
    inputType: "file",
    acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/bmp"],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    processingLocation: "client",
    isNew: true,
    relatedTools: ["image-compressor", "qr-generator"],
    schemaType: "WebApplication",
    keywords: [
      "image converter",
      "convert image",
      "png to jpg",
      "jpg to png",
      "webp converter",
    ],
  },
];

/**
 * Lookup a tool by its URL slug.
 */
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

/**
 * Get all tools in a specific category.
 */
export function getToolsByCategory(category: string): ToolConfig[] {
  return tools.filter((t) => t.category === category);
}

/**
 * Get related tools for a given tool slug.
 */
export function getRelatedTools(slug: string): ToolConfig[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolConfig => t !== undefined);
}

/**
 * Get tools marked as "new".
 */
export function getNewTools(): ToolConfig[] {
  return tools.filter((t) => t.isNew);
}

/**
 * Get popular tools (first 6 by default).
 */
export function getPopularTools(count: number = 6): ToolConfig[] {
  return tools.slice(0, count);
}

/**
 * Search tools by name or description.
 */
export function searchTools(query: string): ToolConfig[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  );
}
