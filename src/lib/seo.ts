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
  "base64-converter": {
    title: "Base64 Encoder & Decoder Online — Images, Files & Text — ZORIQ",
    description:
      "Convert images, files, and text to Base64 data URIs or decode Base64 strings back to original files. 100% private in-browser tool with zero server uploads.",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "image to base64",
      "base64 to image",
      "data uri generator",
      "base64 online converter",
    ],
  },
  "cron-generator": {
    title: "Cron Expression Generator & Explainer — Crontab Guru — ZORIQ",
    description:
      "Generate, validate, and convert cron expressions into human-readable English schedules. Features visual builders, upcoming timestamps, and one-click presets.",
    keywords: [
      "cron generator",
      "cron expression generator",
      "crontab guru",
      "cron syntax explainer",
      "crontab generator online",
    ],
  },
  "regex-tester": {
    title: "Regex Tester & Visualizer Online — Real-Time Matcher — ZORIQ",
    description:
      "Test and debug regular expressions online with real-time match highlighting, capture group inspectors, regex cheat sheets, and common patterns.",
    keywords: [
      "regex tester",
      "regex online tester",
      "regular expression tester",
      "regex visualizer",
      "test regex javascript",
    ],
  },
  "curl-converter": {
    title: "cURL to Code Converter — Fetch, Python, Axios & Go — ZORIQ",
    description:
      "Convert cURL commands instantly into JavaScript Fetch, Axios, Python Requests, Node.js, and Go net/http code. 100% client-side privacy for API tokens.",
    keywords: [
      "curl converter",
      "curl to fetch",
      "curl to python",
      "curl to axios",
      "curl command converter online",
    ],
  },
  "svg-to-png": {
    title: "SVG to PNG & WebP Converter Online (High-DPI Up to 8x) — ZORIQ",
    description:
      "Convert SVG vector graphics to crisp PNG, WebP, and JPEG raster images. Supports transparent backgrounds and ultra-HD scale factors up to 8x.",
    keywords: [
      "svg to png",
      "convert svg to png online",
      "svg to webp",
      "high resolution svg to png",
      "vector to png",
    ],
  },
  "remove-exif": {
    title: "Remove EXIF Data Online — Strip GPS & Photo Metadata — ZORIQ",
    description:
      "Purge GPS location coordinates, camera models, and private metadata from photos before posting online. 100% client-side zero-retention privacy.",
    keywords: [
      "remove exif",
      "strip exif data online",
      "remove gps from photo",
      "photo privacy cleaner",
      "delete metadata from image",
    ],
  },
  "screenshot-mockup": {
    title: "Screenshot Mockup Generator — macOS Window Frames — ZORIQ",
    description:
      "Turn screenshots and code captures into stunning showcase mockups with macOS window headers, vibrant gradients, shadows, and 2x Retina download.",
    keywords: [
      "screenshot mockup",
      "screenshot frame generator",
      "macos window mockup",
      "code screenshot mockup",
      "beautiful screenshot maker",
    ],
  },
  "markdown-to-html": {
    title: "Markdown to HTML Converter Online — Real-Time Preview — ZORIQ",
    description:
      "Convert GitHub Flavored Markdown to clean HTML with synchronized live preview, instant syntax highlighting, and downloadable styled HTML files.",
    keywords: [
      "markdown to html",
      "convert markdown to html online",
      "markdown previewer",
      "markdown editor online",
      "github flavored markdown",
    ],
  },
  "diff-checker": {
    title: "Diff Checker & Text Compare Online — Side-by-Side — ZORIQ",
    description:
      "Compare two text files or code snippets online. Visual side-by-side and unified diff views with highlighted additions, deletions, and line statistics.",
    keywords: [
      "diff checker",
      "text compare online",
      "code diff online",
      "side by side text comparison",
      "diff tool online",
    ],
  },
  "timezone-converter": {
    title: "Timezone Converter & Epoch Timestamp Converter — ZORIQ",
    description:
      "Convert times across global timezones (UTC, IST, EST, PST, GMT, JST) and convert Unix timestamps to human dates. Perfect meeting planner and developer clock.",
    keywords: [
      "timezone converter",
      "epoch converter",
      "unix timestamp to date",
      "world clock meeting planner",
      "utc to ist converter",
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
