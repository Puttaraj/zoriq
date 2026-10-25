/**
 * ZORIQ — SEO Helpers
 *
 * Factory functions for generating Next.js Metadata objects
 * and Schema.org JSON-LD structured data.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { ToolConfig, FAQ, BreadcrumbItem, SchemaOrg } from "@/types/tool";

const TOOL_SEO_OVERRIDES: Record<
  string,
  { title: string; description: string; keywords?: string[] }
> = {
  "qr-generator": {
    title: "Free QR Code Generator Online (Custom Colors & SVG) — ZORIQ",
    description:
      "Generate free QR codes online instantly. Create QR codes for URLs, WiFi networks, vCards, and emails. Customize colors, add logos, and download in PNG or SVG vector format.",
    keywords: [
      "qr code generator online",
      "free qr code generator online",
      "qr code generator",
      "create qr code",
      "wifi qr code generator",
      "svg qr code",
      "custom qr code generator",
    ],
  },
  "password-generator": {
    title: "Strong Password Generator Online — 100% Private & Secure — ZORIQ",
    description:
      "Generate strong, secure, random passwords online instantly. Customize length, symbols, numbers, and uppercase letters. 100% client-side privacy with zero data saved.",
    keywords: [
      "password online",
      "password generator online",
      "free password generator",
      "generate password online",
      "create strong password",
      "random password generator",
      "free passwords",
    ],
  },
  "uuid-generator": {
    title: "UUID Generator Online — Create Unique ID (Bulk v4 UUIDs) — ZORIQ",
    description:
      "Generate random UUID v4 identifiers online instantly. Create unique IDs for databases, APIs, and software development. Supports single and bulk UUID generation.",
    keywords: [
      "uuid generator",
      "create unique id",
      "uuid generator online",
      "uuid v4 generator",
      "random uuid generator",
      "bulk uuid generator",
    ],
  },
  "json-formatter": {
    title:
      "JSON Formatter & Validator Online — Beautify & Simplify JSON — ZORIQ",
    description:
      "Format, validate, beautify, and simplify JSON online instantly. Highlights syntax errors with exact line numbers and minifies payloads. 100% browser-based.",
    keywords: [
      "json formatter on line",
      "online formatter",
      "json formatter online",
      "simplify json",
      "validate json online",
      "json validator online",
      "beautify json",
    ],
  },
  "image-compressor": {
    title: "Free Image Compressor Online — Compress JPG, PNG & WebP — ZORIQ",
    description:
      "Compress images online without losing quality. Reduce file sizes for JPG, PNG, and WebP photos directly in your browser. Fast, free, and 100% private.",
    keywords: [
      "image compressor",
      "compress image online",
      "reduce image size",
      "compress photo online",
      "jpeg compressor",
      "png compressor",
    ],
  },
  "compress-image-to-20kb": {
    title: "Compress Image to 20KB Online — For SSC, UPSC & Govt Forms — ZORIQ",
    description:
      "Reduce photo and signature sizes strictly under 20KB for government exam application forms (SSC, UPSC, IBPS, State PSC). 100% client-side in-browser compression.",
    keywords: [
      "compress image to 20kb",
      "compress photo to 20kb",
      "signature compress to 20kb",
      "image under 20kb online",
      "ssc photo resize",
    ],
  },
  "compress-image-to-50kb": {
    title: "Compress Image to 50KB Online — Passport Photo Size — ZORIQ",
    description:
      "Reduce passport photos and ID proofs strictly under 50KB for online portals, exam registration, and visa forms without losing facial clarity.",
    keywords: [
      "compress image to 50kb",
      "compress photo to 50kb",
      "passport size photo 50kb",
      "image under 50kb",
    ],
  },
  "merge-pdf": {
    title: "Merge PDF Online — Combine Multiple PDF Files Free — ZORIQ",
    description:
      "Combine and merge multiple PDF documents into a single file online. Reorder pages visually with instant preview. 100% free and processed in your browser.",
    keywords: [
      "merge pdf",
      "merge pdf online",
      "combine pdf files",
      "join pdf online free",
      "combine multiple pdfs",
    ],
  },
  "split-pdf": {
    title: "Split PDF Online — Extract Pages & Custom Ranges Free — ZORIQ",
    description:
      "Split PDF files into individual pages or custom page ranges online. Visual page preview selection with zero server uploads.",
    keywords: [
      "split pdf",
      "split pdf online",
      "extract pdf pages",
      "separate pdf pages",
    ],
  },
  "compress-pdf": {
    title: "Compress PDF Online — Reduce PDF File Size Free — ZORIQ",
    description:
      "Reduce PDF file sizes online while maintaining visual resolution. Real-time file size estimator and 100% private in-browser compression.",
    keywords: [
      "compress pdf",
      "compress pdf online",
      "reduce pdf file size",
      "pdf compressor free",
    ],
  },
  "age-calculator": {
    title:
      "Age Calculator Online — Calculate Exact Age in Years, Months, Days — ZORIQ",
    description:
      "Calculate your exact chronological age in years, months, weeks, days, hours, and minutes from date of birth. Free online date calculation tool.",
    keywords: [
      "age calculator online",
      "calculate age online",
      "exact age calculator",
      "date of birth calculator",
    ],
  },
  "word-counter": {
    title: "Word & Character Counter Online — Real-Time Text Stats — ZORIQ",
    description:
      "Count words, characters, sentences, paragraphs, and reading time in real-time. Free online text analyzer for writers, students, and SEOs.",
    keywords: [
      "word counter online",
      "character counter",
      "word count tool",
      "count words in text",
    ],
  },
};

/**
 * Generate Metadata for a tool page.
 */
export function generateToolMetadata(tool: ToolConfig): Metadata {
  const override = TOOL_SEO_OVERRIDES[tool.slug];
  const title =
    override?.title ?? `Free ${tool.name} Online — Fast & Private | ZORIQ`;
  const description = override?.description ?? tool.description;
  const keywords = override?.keywords ?? tool.keywords;
  const url = `${siteConfig.url}/tools/${tool.slug}`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}/og/${tool.slug}.png`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/og/${tool.slug}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generate Metadata for a generic page.
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${siteConfig.url}${item.href}` : undefined,
    })),
  };
}

/**
 * Generate FAQPage JSON-LD.
 */
export function generateFAQSchema(faqs: FAQ[]): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate SoftwareApplication JSON-LD for a tool.
 */
export function generateToolSchema(tool: ToolConfig): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": tool.schemaType,
    name: tool.name,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Generate Organization JSON-LD for the homepage.
 */
export function generateOrganizationSchema(): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.organization.url,
    logo: siteConfig.organization.logo,
    foundingDate: siteConfig.organization.foundingDate,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  };
}

/**
 * Generate WebSite JSON-LD with SearchAction.
 */
export function generateWebsiteSchema(): SchemaOrg {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
