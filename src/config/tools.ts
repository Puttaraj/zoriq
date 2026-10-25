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

  {
    slug: "jwt-decoder",
    name: "JWT Decoder & Debugger",
    description:
      "Decode and inspect JSON Web Tokens (JWT) safely in your browser. View header, payload claims, and token expiration countdown. 100% private.",
    shortDescription: "Decode and inspect JSON Web Tokens locally",
    category: "developer",
    icon: "KeyRound",
    features: [
      "Decode Header, Payload, and Signature",
      "Real-time expiration countdown and status indicator",
      "Format JSON claims with syntax colors",
      "One-click copy for payload data",
      "Zero network requests — 100% private browser decoding",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["json-formatter", "password-generator", "uuid-generator"],
    schemaType: "WebApplication",
    keywords: [
      "jwt decoder",
      "jwt debugger",
      "decode jwt",
      "jwt token parser",
      "jwt online",
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

  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    description:
      "Calculate your mutual fund SIP returns and future wealth value. Interactive monthly compounding calculator with visual chart and annual schedule.",
    shortDescription: "Calculate mutual fund SIP returns & wealth growth",
    category: "finance",
    icon: "TrendingUp",
    features: [
      "Instant monthly compounding calculations",
      "Visual donut chart breakdown (Invested vs Returns)",
      "Year-by-year wealth projection table",
      "Adjustable monthly amount, tenure, and expected return rate",
      "100% free with zero sign-up required",
    ],
    inputType: "form",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["emi-calculator", "age-calculator"],
    schemaType: "WebApplication",
    keywords: [
      "sip calculator",
      "mutual fund sip calculator",
      "sip return calculator",
      "investment calculator",
      "systematic investment plan",
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

  {
    slug: "compress-image-to-20kb",
    name: "Compress Image to 20KB",
    description:
      "Compress and resize images to under 20KB online. Perfect for SSC, UPSC, government exam forms, and signatures. 100% free and private.",
    shortDescription: "Compress photo or signature to under 20KB",
    category: "image",
    icon: "ImageDown",
    features: [
      "Compress photos and signatures strictly under 20 KB",
      "Ideal for SSC, UPSC, and online exam application portals",
      "Adjustable quality fallback slider",
      "Instant before-and-after file size comparison",
      "Safe local browser compression — no upload to any server",
    ],
    inputType: "file",
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    maxFileSize: 10 * 1024 * 1024,
    processingLocation: "client",
    isNew: true,
    relatedTools: [
      "compress-image-to-50kb",
      "image-compressor",
      "image-converter",
    ],
    schemaType: "WebApplication",
    keywords: [
      "compress image to 20kb",
      "reduce image size to 20kb",
      "photo compress 20kb",
      "signature resize 20kb",
      "image under 20kb",
    ],
  },

  {
    slug: "compress-image-to-50kb",
    name: "Compress Image to 50KB",
    description:
      "Compress and resize images to under 50KB online. Ideal for passport photos, college admissions, and portal registrations. Fast and free.",
    shortDescription: "Compress photo to under 50KB for portals",
    category: "image",
    icon: "ImageDown",
    features: [
      "Compress images strictly under 50 KB",
      "Optimized for passport photos, admit cards, and job portals",
      "Maintains facial clarity and aspect ratio",
      "Real-time compression preview",
      "Processed 100% inside your browser memory",
    ],
    inputType: "file",
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    maxFileSize: 10 * 1024 * 1024,
    processingLocation: "client",
    isNew: true,
    relatedTools: [
      "compress-image-to-20kb",
      "image-compressor",
      "image-converter",
    ],
    schemaType: "WebApplication",
    keywords: [
      "compress image to 50kb",
      "reduce photo size to 50kb",
      "passport photo 50kb",
      "image resize 50kb",
      "compress jpg to 50kb",
    ],
  },

  // ──────────────────────────────────
  // AI Tools
  // ──────────────────────────────────
  {
    slug: "background-remover",
    name: "AI Background Remover",
    description:
      "Remove image backgrounds automatically in your browser. Create transparent PNG cutouts for portraits, products, and graphics. 100% free and private.",
    shortDescription: "Remove image backgrounds instantly in browser",
    category: "ai",
    icon: "Sparkles",
    features: [
      "Remove photo backgrounds automatically",
      "100% private — processed locally on your device",
      "Export high-resolution transparent PNG cutouts",
      "Solid white or black background replacement modes",
      "No image uploads to external cloud servers",
    ],
    inputType: "file",
    acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
    maxFileSize: 10 * 1024 * 1024,
    processingLocation: "client",
    isNew: true,
    relatedTools: ["image-compressor", "image-converter"],
    schemaType: "WebApplication",
    keywords: [
      "background remover",
      "remove bg",
      "transparent background",
      "erase background",
      "ai background removal free",
    ],
  },

  {
    slug: "ats-resume-checker",
    name: "AI ATS Resume Scanner & Optimizer",
    description:
      "Diagnostic-test your resume against applicant tracking systems (ATS). Match job description keywords, calculate ATS score, and rewrite bullets in STAR format.",
    shortDescription: "Scan resume against ATS filters & job keywords",
    category: "ai",
    icon: "FileCheck",
    features: [
      "Real-time ATS pass likelihood score (0–100%)",
      "Matched vs. missing job description keyword audit",
      "STAR-method resume bullet point rewriter",
      "Recruiter formatting & parseability diagnostic checks",
      "Actionable recommendations to boost interview conversion",
    ],
    inputType: "text",
    processingLocation: "hybrid",
    isNew: true,
    relatedTools: ["word-counter", "background-remover"],
    schemaType: "WebApplication",
    keywords: [
      "ats resume checker",
      "ats resume scanner",
      "ats score online",
      "resume keyword matcher",
      "resume optimizer free",
    ],
  },

  {
    slug: "ats-resume-builder",
    name: "Harvard ATS Resume Builder",
    description:
      "Build free ATS-proof resumes using the single-column Ivy League format. Real-time ATS scoring, optional declaration toggle for PSU/Govt drives, and 1-click Instant Job Radar matching.",
    shortDescription:
      "Free Ivy League ATS resume builder with instant Job Radar",
    category: "ai",
    icon: "FileText",
    features: [
      "Harvard / Ivy League single-column ATS-compliant format",
      "Real-time live ATS pass audit & actionable diagnostic checklist",
      "Optional declaration toggle for Indian PSU, Govt & campus drives",
      "Instant Job Radar: 1-click job search on LinkedIn, Naukri, Indeed & Wellfound",
      "100% free vector PDF export — zero watermark, no sign-up required",
      "Clean monochrome typography optimized for ATS OCR scanners",
    ],
    inputType: "form",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["ats-resume-checker", "merge-pdf", "word-counter"],
    schemaType: "WebApplication",
    keywords: [
      "ats resume builder",
      "harvard resume format",
      "free resume builder no watermark",
      "ivy league resume template",
      "ats friendly resume builder",
      "resume builder with job matches",
    ],
  },

  // ──────────────────────────────────
  // PDF Tools
  // ──────────────────────────────────
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description:
      "Combine multiple PDF files into a single document easily. Reorder pages visually before merging. 100% secure client-side execution.",
    shortDescription: "Combine multiple PDF files into one",
    category: "pdf",
    icon: "Combine",
    features: [
      "Combine unlimited PDF documents",
      "Visually reorder files before merge",
      "Retain original document layout and links",
      "Process 100% locally inside the browser",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["split-pdf", "compress-pdf", "pdf-to-jpg"],
    schemaType: "WebApplication",
    keywords: ["merge pdf", "combine pdf", "join pdf", "concatenate pdfs"],
  },

  {
    slug: "split-pdf",
    name: "Split PDF",
    description:
      "Split a PDF file into separate pages or custom ranges. Free, secure, and fast with no files uploaded to any servers.",
    shortDescription: "Split PDF by page ranges or extract all",
    category: "pdf",
    icon: "Scissors",
    features: [
      "Split by page ranges (e.g. 1-3, 5-8)",
      "Extract every page to a separate file",
      "Real-time visual page index references",
      "No data limits — completely offline",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["merge-pdf", "remove-pages", "extract-pages"],
    schemaType: "WebApplication",
    keywords: ["split pdf", "extract pdf pages", "divide pdf", "cut pdf pages"],
  },

  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description:
      "Optimize and reduce your PDF file size while keeping visual resolution. Perfect for emailing attachments and server storage savings.",
    shortDescription: "Optimize and reduce PDF file size",
    category: "pdf",
    icon: "TrendingDown",
    features: [
      "Reduce PDF size by adjusting DPI resolution",
      "Strip unreferenced layout stream objects",
      "Process inside browser threads safely",
      "Real-time file compression comparisons",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["merge-pdf", "pdf-to-jpg"],
    schemaType: "WebApplication",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "optimize pdf"],
  },

  {
    slug: "remove-pages",
    name: "Remove Pages",
    description:
      "Delete unnecessary pages from your PDF documents instantly. Get a clean, optimized copy of your file containing only the pages you want.",
    shortDescription: "Delete pages from a PDF document",
    category: "pdf",
    icon: "Scissors",
    features: [
      "Delete single pages or custom selections",
      "Visual grid of all PDF pages rendered instantly",
      "Download clean, page-trimmed PDF files",
      "100% private browser processing",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["extract-pages", "split-pdf", "organize-pdf"],
    schemaType: "WebApplication",
    keywords: [
      "remove pdf pages",
      "delete page from pdf",
      "trim pdf",
      "strip page",
    ],
  },

  {
    slug: "extract-pages",
    name: "Extract Pages",
    description:
      "Save specific pages from your PDF file as a new document. Choose exactly what pages to keep using a thumbnail-preview selector.",
    shortDescription: "Save specific pages as a new document",
    category: "pdf",
    icon: "Scissors",
    features: [
      "Extract single pages or non-adjacent sets",
      "Interactive page-preview grid mapping",
      "Retain original document styling attributes",
      "Local client-side execution",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["remove-pages", "split-pdf", "organize-pdf"],
    schemaType: "WebApplication",
    keywords: ["extract pages from pdf", "isolate pdf page", "save pdf page"],
  },

  {
    slug: "organize-pdf",
    name: "Organize PDF",
    description:
      "Reorder, delete, and rotate pages in your PDF documents. Move pages visually inside an interactive layout manager.",
    shortDescription: "Reorder, delete, and rotate pages visually",
    category: "pdf",
    icon: "Layers",
    features: [
      "Drag and drop to reorder PDF pages",
      "Rotate pages (90° steps) in place",
      "Instant deletions of unnecessary pages",
      "Works completely offline",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["rotate-pdf", "remove-pages", "extract-pages"],
    schemaType: "WebApplication",
    keywords: [
      "organize pdf",
      "reorder pdf pages",
      "sort pdf pages",
      "move page",
    ],
  },

  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description:
      "Rotate one or all pages in your PDF document permanently. Align layout margins and horizontal orientations in seconds.",
    shortDescription: "Rotate page orientation permanently",
    category: "pdf",
    icon: "RotateCw",
    features: [
      "Rotate 90°, 180°, or 270° degrees clockwise",
      "Batch rotate all pages in one operation",
      "Visual grid shows layout changes instantly",
      "Pure client-side processing",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["organize-pdf", "crop-pdf"],
    schemaType: "WebApplication",
    keywords: [
      "rotate pdf",
      "turn pdf page",
      "flip pdf page",
      "permanently rotate",
    ],
  },

  {
    slug: "crop-pdf",
    name: "Crop PDF",
    description:
      "Adjust visible page margins or trim specific canvas areas in your PDF document. Crop margins for print layout adjustments.",
    shortDescription: "Trim page margins or select crop areas",
    category: "pdf",
    icon: "Crop",
    features: [
      "Custom page box cropping parameters",
      "Adjust print margins on all pages",
      "Clean visual canvas boundary overlays",
      "No data limits — completely local",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["rotate-pdf", "organize-pdf"],
    schemaType: "WebApplication",
    keywords: ["crop pdf", "trim pdf margins", "cut pdf pages", "pdf page box"],
  },

  {
    slug: "add-watermark",
    name: "Add Watermark",
    description:
      "Overlay customizable text stamps onto each page of your PDF. Set custom text colors, opacities, and rotation coordinates.",
    shortDescription: "Overlay watermark text stamps on PDF pages",
    category: "pdf",
    icon: "Bookmark",
    features: [
      "Custom text stamp inputs (e.g. DRAFT)",
      "Adjustable opacity, rotation angle, and size",
      "Live settings panel configurations",
      "Fast offline processing",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["add-page-numbers", "protect-pdf"],
    schemaType: "WebApplication",
    keywords: ["add watermark to pdf", "watermark pdf", "draft stamp pdf"],
  },

  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    description:
      "Number the pages in your PDF files automatically. Customize numbers placements, sizes, colors, and margins.",
    shortDescription: "Add customized page numbers to your files",
    category: "pdf",
    icon: "Hash",
    features: [
      "Positions: Header/Footer, Left/Center/Right",
      "Formats: 'Page X of Y' or single digit",
      "Adjustable text color, style, and offsets",
      "Safe local browser rendering",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["add-watermark", "protect-pdf"],
    schemaType: "WebApplication",
    keywords: ["number pdf pages", "add page numbers to pdf", "paginate pdf"],
  },

  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description:
      "Secure your PDF documents by encrypting them with custom passwords. Set passwords to restrict print, modify, and copy permissions.",
    shortDescription: "Secure and encrypt PDF files with password",
    category: "pdf",
    icon: "Lock",
    features: [
      "Strong client-side password encryption",
      "Restrict print, modify, and copy permissions",
      "Password protection verified locally",
      "Zero server tracking — 100% private",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["unlock-pdf", "add-watermark"],
    schemaType: "WebApplication",
    keywords: [
      "protect pdf",
      "password protect pdf",
      "encrypt pdf",
      "secure pdf",
    ],
  },

  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description:
      "Decrypt and remove passwords and restrictions from PDF files. Enter the correct password to save a clean, password-free copy.",
    shortDescription: "Remove encryption passwords and restrictions",
    category: "pdf",
    icon: "Unlock",
    features: [
      "Remove password encryption from PDFs",
      "Remove copying and printing restrictions",
      "Instant client-side decryption",
      "Works completely offline",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["protect-pdf", "add-watermark"],
    schemaType: "WebApplication",
    keywords: [
      "unlock pdf",
      "remove password from pdf",
      "decrypt pdf",
      "remove restriction",
    ],
  },

  {
    slug: "sign-pdf",
    name: "Sign PDF",
    description:
      "Add electronic signatures to your PDF documents. Draw, clear, and place hand-drawn signatures on target pages.",
    shortDescription: "Sign PDF documents with digital hand signature",
    category: "pdf",
    icon: "PenTool",
    features: [
      "Smooth canvas drawing signature pad",
      "Choose exactly which page to apply signature",
      "Place and preview placement coordinates",
      "Secure and fast browser rendering",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["pdf-forms", "add-watermark"],
    schemaType: "WebApplication",
    keywords: [
      "sign pdf",
      "e-sign pdf",
      "electronic signature pdf",
      "digital signature",
    ],
  },

  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description:
      "Convert images (JPEG, PNG, WebP) to PDF documents in seconds. Process multiple images and compile them as single-page or merged documents.",
    shortDescription: "Convert multiple images to PDF files",
    category: "pdf",
    icon: "FileImage",
    features: [
      "Convert JPG, PNG, and WebP images",
      "Merge multiple images into a single PDF",
      "Maintains page margins and orientations",
      "Works completely offline",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["pdf-to-jpg", "merge-pdf"],
    schemaType: "WebApplication",
    keywords: [
      "jpg to pdf",
      "png to pdf",
      "convert images to pdf",
      "compile photos",
    ],
  },

  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description:
      "Convert PDF pages to JPEG/PNG images instantly. Draw page contents onto local browser canvases for lossless image downloads.",
    shortDescription: "Convert PDF document pages to PNG images",
    category: "pdf",
    icon: "FileImage",
    features: [
      "Convert each PDF page into a separate image",
      "Extract original embedded photos from file",
      "High-fidelity local rendering",
      "Download all pages instantly",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["jpg-to-pdf", "extract-pages"],
    schemaType: "WebApplication",
    keywords: [
      "pdf to jpg",
      "pdf to png",
      "convert pdf to image",
      "pdf reader canvas",
    ],
  },

  {
    slug: "pdf-forms",
    name: "PDF Forms",
    description:
      "Fill interactive PDF form fields instantly. Load and input information directly in your browser with zero data leakage.",
    shortDescription: "Fill out interactive PDF form fields",
    category: "pdf",
    icon: "FormInput",
    features: [
      "Interactive text field parsing and forms filler",
      "Load checkboxes, select fields, and layouts",
      "Download finalized filled document",
      "100% private browser processing",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["sign-pdf", "add-watermark"],
    schemaType: "WebApplication",
    keywords: [
      "fill pdf form",
      "pdf form filler",
      "form input pdf",
      "interactive pdf",
    ],
  },

  // ──────────────────────────────────
  // PDF Conversion - Phase 2 Stubs
  // ──────────────────────────────────
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description:
      "Convert Word DOC and DOCX documents into clean, professional PDF files with high-fidelity formatting.",
    shortDescription: "Convert DOC and DOCX files to PDF format",
    category: "pdf",
    icon: "FileText",
    features: [
      "Convert Word documents to PDF",
      "Preserve text styling, layouts, and image blocks",
      "Zero-knowledge privacy guarantee",
      "Support for DOC and DOCX files",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["pdf-to-word", "merge-pdf"],
    schemaType: "WebApplication",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf"],
  },

  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description:
      "Convert Excel XLS and XLSX spreadsheet workbooks to standardized PDF format with clean tables.",
    shortDescription: "Convert Excel spreadsheets to PDF sheets",
    category: "pdf",
    icon: "FileSpreadsheet",
    features: [
      "Convert spreadsheet sheets to PDF layouts",
      "Support grid lines, formulas, and cells borders",
      "Zero-knowledge privacy guarantee",
      "Fast file validation",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["pdf-to-excel", "merge-pdf"],
    schemaType: "WebApplication",
    keywords: ["excel to pdf", "xlsx to pdf", "spreadsheet converter"],
  },

  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description:
      "Convert PowerPoint PPT and PPTX presentation slide decks to PDF format while preserving slide design.",
    shortDescription: "Convert PPT/PPTX slides to PDF documents",
    category: "pdf",
    icon: "Presentation",
    features: [
      "Convert presentation slides to PDF format",
      "Keep text flow and layout structure",
      "Zero-knowledge privacy guarantee",
      "Support for PPT and PPTX files",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["pdf-to-powerpoint", "merge-pdf"],
    schemaType: "WebApplication",
    keywords: ["ppt to pdf", "pptx to pdf", "convert presentation"],
  },

  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description:
      "Convert HTML code, files, or web pages into clean, accurately formatted PDF documents.",
    shortDescription: "Convert web page URLs to PDF documents",
    category: "pdf",
    icon: "Globe",
    features: [
      "Render web page URLs to PDF layouts",
      "Support standard CSS styling alignments",
      "Zero-knowledge privacy guarantee",
      "Accurate page-break handling",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["word-to-pdf", "excel-to-pdf"],
    schemaType: "WebApplication",
    keywords: ["html to pdf", "webpage to pdf", "url to pdf"],
  },

  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description:
      "Convert PDF documents back to editable Microsoft Word DOCX files with editable text.",
    shortDescription: "Convert PDF files to Word DOCX documents",
    category: "pdf",
    icon: "FileText",
    features: [
      "Convert PDF back to editable Word documents",
      "Extract text streams and tables correctly",
      "Zero-knowledge privacy guarantee",
      "Fast visual validation",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["word-to-pdf", "pdf-to-excel"],
    schemaType: "WebApplication",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to word"],
  },

  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    description:
      "Convert PDF tables and spreadsheet data into editable Excel workbooks.",
    shortDescription: "Convert PDF tables to Excel sheets format",
    category: "pdf",
    icon: "FileSpreadsheet",
    features: [
      "Extract document tables to spreadsheets",
      "Keep original cell grid and row styling alignments",
      "Zero-knowledge privacy guarantee",
      "Support for XLS and XLSX export",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["excel-to-pdf", "pdf-to-word"],
    schemaType: "WebApplication",
    keywords: ["pdf to excel", "pdf to xlsx", "extract table pdf"],
  },

  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description:
      "Convert PDF pages back to editable PowerPoint PPTX presentation slides.",
    shortDescription: "Convert PDF document pages to PPTX slides",
    category: "pdf",
    icon: "Presentation",
    features: [
      "Convert pages into presentation slide items",
      "Extract layouts and texts cleanly",
      "Zero-knowledge privacy guarantee",
      "Editable slide elements",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["powerpoint-to-pdf", "pdf-to-word"],
    schemaType: "WebApplication",
    keywords: ["pdf to ppt", "pdf to pptx", "convert slides"],
  },

  {
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description:
      "Convert standard PDF documents into ISO-compliant PDF/A long-term archiving format.",
    shortDescription: "Convert PDFs to PDF/A standard archive files",
    category: "pdf",
    icon: "Lock",
    features: [
      "Convert documents to PDF/A standard templates",
      "Prepare for long-term document archiving",
      "Zero-knowledge privacy guarantee",
      "Strict data compliance checks",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["protect-pdf", "word-to-pdf"],
    schemaType: "WebApplication",
    keywords: ["pdf to pdfa", "pdfa archive", "standardize pdf"],
  },

  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    description:
      "Extract readable, searchable text from scanned PDF documents and images using OCR.",
    shortDescription: "Make scanned PDF pages text-searchable",
    category: "pdf",
    icon: "Globe",
    features: [
      "Perform Optical Character Recognition (OCR)",
      "Create searchable overlays on scanned images",
      "Zero-knowledge privacy guarantee",
      "Multi-language recognition support",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["pdf-to-word", "pdf-to-jpg"],
    schemaType: "WebApplication",
    keywords: [
      "ocr pdf",
      "searchable pdf",
      "extract text scan",
      "optical recognition",
    ],
  },

  {
    slug: "repair-pdf",
    name: "Repair PDF",
    description:
      "Analyze and recover readable text, images, and content from corrupted or damaged PDF files.",
    shortDescription: "Recover data from damaged PDF files",
    category: "pdf",
    icon: "Wrench",
    features: [
      "Repair corrupted stream metadata descriptors",
      "Recover text blocks and layouts from damaged files",
      "Zero-knowledge privacy guarantee",
      "Fast corruption analysis",
    ],
    inputType: "file",
    processingLocation: "hybrid",
    isNew: false,
    relatedTools: ["merge-pdf", "unlock-pdf"],
    schemaType: "WebApplication",
    keywords: [
      "repair pdf",
      "fix corrupted pdf",
      "recover pdf data",
      "broken pdf",
    ],
  },
  {
    slug: "base64-converter",
    name: "Base64 Encoder & Decoder",
    description:
      "Encode images, files, and text to Base64 data URIs or decode Base64 strings to original files. Fast, free, and 100% private in-browser tool.",
    shortDescription: "Encode or decode images, files, and text to Base64",
    category: "developer",
    icon: "Binary",
    features: [
      "Image & file to Base64 data URI",
      "CSS background-image & HTML img snippet generator",
      "Base64 string to file download and image preview",
      "Clipboard screenshot paste support (Ctrl+V / Cmd+V)",
      "100% client-side privacy via HTML5 FileReader",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["json-formatter", "svg-to-png", "uuid-generator"],
    schemaType: "WebApplication",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "image to base64",
      "base64 to image",
      "base64 online converter",
      "data uri generator",
    ],
  },
  {
    slug: "cron-generator",
    name: "Cron Expression Generator",
    description:
      "Build, validate, and translate crontab expressions into clear human English. Interactive visual builder with presets and upcoming execution timestamps.",
    shortDescription:
      "Visual cron builder and plain-English schedule explainer",
    category: "developer",
    icon: "Clock",
    features: [
      "Visual schedule builder for minutes, hours, days, months, and weekdays",
      "Plain English explanation of any cron expression in real-time",
      "Next 5 scheduled execution timestamps preview",
      "One-click presets (hourly, daily, weekly, monthly, workdays)",
      "Zero server latency — 100% client-side parser",
    ],
    inputType: "form",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["jwt-decoder", "timezone-converter", "regex-tester"],
    schemaType: "WebApplication",
    keywords: [
      "cron generator",
      "cron expression generator",
      "crontab guru",
      "cron syntax explainer",
      "cron schedule online",
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester & Visualizer",
    description:
      "Test, debug, and visualize regular expressions in real-time with instant syntax highlighting, capture groups, and cheat sheet presets.",
    shortDescription:
      "Test regular expressions with real-time match highlighting",
    category: "developer",
    icon: "Code2",
    features: [
      "Real-time regex evaluation and match highlighting",
      "Named and indexed capture group inspector with match index offsets",
      "Interactive flag toggles: Global (g), Multiline (m), Case-insensitive (i), DotAll (s)",
      "Preloaded regex templates for Emails, URLs, IPv4, Phone Numbers, and Dates",
      "100% client-side Web Regex Engine with ReDoS protection safeguards",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["diff-checker", "curl-converter", "json-formatter"],
    schemaType: "WebApplication",
    keywords: [
      "regex tester",
      "regex online tester",
      "regular expression tester",
      "regex visualizer",
      "test regex javascript",
    ],
  },
  {
    slug: "curl-converter",
    name: "cURL to Code Converter",
    description:
      "Convert cURL command syntax instantly into production-ready Fetch API, Axios, Python Requests, Go net/http, and Node.js code snippets.",
    shortDescription:
      "Convert cURL commands to JavaScript, Python, Axios, and Go",
    category: "developer",
    icon: "Terminal",
    features: [
      "Translates cURL commands into JavaScript (Fetch & Axios), Python (Requests), Go, and Node.js",
      "Extracts headers, HTTP methods, basic auth, and JSON/form-urlencoded payloads",
      "One-click copy with syntax-highlighted code output",
      "Common API example templates (GET, JSON POST, Auth Bearer)",
      "100% client-side parser — your API keys and tokens never leave your browser",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["jwt-decoder", "json-formatter", "base64-converter"],
    schemaType: "WebApplication",
    keywords: [
      "curl converter",
      "curl to fetch",
      "curl to python",
      "curl to axios",
      "curl command converter online",
    ],
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG & WebP Converter",
    description:
      "Convert SVG vector files to crisp, high-resolution raster PNG, WebP, and JPEG images. Choose custom scale factors (1x, 2x, 4x, 8x) with transparent background support.",
    shortDescription: "Export vector SVGs to high-DPI PNG or WebP images",
    category: "image",
    icon: "FileImage",
    features: [
      "Ultra-crisp vector rasterization at 1x, 2x, 3x, 4x, and 8x Ultra-HD scales",
      "Export to PNG (with alpha transparency), WebP, or JPEG formats",
      "Live zoomable visual SVG preview with instant dimension detector",
      "Clipboard paste & drag-and-drop file upload support",
      "100% private in-browser HTML5 Canvas rendering engine",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["image-compressor", "image-converter", "base64-converter"],
    schemaType: "WebApplication",
    keywords: [
      "svg to png",
      "convert svg to png online",
      "svg to webp",
      "high resolution svg to png",
      "vector to png",
    ],
  },
  {
    slug: "remove-exif",
    name: "EXIF Metadata Remover",
    description:
      "Strip GPS location coordinates, camera models, shutter speeds, and personal metadata from your photos before sharing on the web.",
    shortDescription: "Strip GPS location and camera metadata from photos",
    category: "image",
    icon: "ShieldCheck",
    features: [
      "Purges GPS coordinates, camera serial numbers, timestamps, and device metadata",
      "Zero-knowledge privacy: strips metadata locally on HTML5 Canvas without server uploads",
      "Preserves original image visual clarity and aspect ratio",
      "Instant before/after file size comparison",
      "Download clean sanitized JPG, PNG, or WebP images",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["image-compressor", "image-converter", "svg-to-png"],
    schemaType: "WebApplication",
    keywords: [
      "remove exif",
      "strip exif data online",
      "remove gps from photo",
      "photo privacy cleaner",
      "delete metadata from image",
    ],
  },
  {
    slug: "screenshot-mockup",
    name: "Screenshot Mockup Generator",
    description:
      "Turn raw screenshots into stunning, professional showcase mockups with macOS window frames, customizable gradient backgrounds, padding, and drop shadows.",
    shortDescription: "Create beautiful mockups with macOS frames & gradients",
    category: "utilities",
    icon: "Monitor",
    features: [
      "macOS dark and light window frame styling with traffic light buttons",
      "Curated gradient backgrounds and transparent canvas mode",
      "Customizable padding, border radius, and realistic drop shadow controls",
      "Ctrl+V / Cmd+V paste support for instant screenshot importing",
      "High-DPI 2x Retina PNG export directly from client canvas",
    ],
    inputType: "file",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["svg-to-png", "image-compressor", "base64-converter"],
    schemaType: "WebApplication",
    keywords: [
      "screenshot mockup",
      "screenshot frame generator",
      "macos window mockup",
      "code screenshot mockup",
      "beautiful screenshot maker",
    ],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML Converter",
    description:
      "Convert Markdown into clean, semantic HTML in real-time. Features live side-by-side preview, syntax highlighting, and one-click copy options.",
    shortDescription:
      "Real-time Markdown editor, HTML converter, and live previewer",
    category: "text",
    icon: "FileCode2",
    features: [
      "Real-time GitHub-flavored Markdown parsing into semantic HTML",
      "Side-by-side synchronized live rendering preview",
      "One-click copy as raw HTML code or rendered formatted text",
      "Download as .html document with embedded responsive typography styles",
      "Preloaded template showcasing headings, tables, task lists, and code blocks",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["word-counter", "diff-checker", "json-formatter"],
    schemaType: "WebApplication",
    keywords: [
      "markdown to html",
      "convert markdown to html online",
      "markdown previewer",
      "markdown editor online",
      "github flavored markdown",
    ],
  },
  {
    slug: "diff-checker",
    name: "Diff & Text Compare Online",
    description:
      "Compare two text files or code snippets side-by-side. Highlights additions, deletions, and line modifications with split and unified diff views.",
    shortDescription:
      "Compare text and code snippets with side-by-side diff highlighting",
    category: "developer",
    icon: "GitCompare",
    features: [
      "Side-by-side split view and unified inline diff modes",
      "Precise line-by-line additions (green) and deletions (red) highlighting",
      "Line numbers and real-time modification statistics count",
      "Ignore whitespace and case-sensitivity comparison toggles",
      "100% private in-browser text comparison — zero server storage",
    ],
    inputType: "text",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["json-formatter", "markdown-to-html", "regex-tester"],
    schemaType: "WebApplication",
    keywords: [
      "diff checker",
      "text compare online",
      "code diff online",
      "side by side text comparison",
      "diff tool",
    ],
  },
  {
    slug: "timezone-converter",
    name: "Timezone & Epoch Converter",
    description:
      "Convert timestamps across global timezones (UTC, IST, EST, PST, GMT, JST) and convert Unix epoch seconds/milliseconds to human-readable datetime.",
    shortDescription:
      "World clock, global timezone scheduler, and Unix epoch converter",
    category: "utilities",
    icon: "Globe",
    features: [
      "Live synchronized clocks across major global financial & tech hubs",
      "Bidirectional Unix epoch timestamp (seconds & milliseconds) converter",
      "Interactive meeting time scheduler with hour sliders",
      "Relative time calculator (e.g. 'in 3 hours', '2 days ago')",
      "100% client-side Intl.DateTimeFormat API with zero network latency",
    ],
    inputType: "form",
    processingLocation: "client",
    isNew: true,
    relatedTools: ["cron-generator", "age-calculator", "jwt-decoder"],
    schemaType: "WebApplication",
    keywords: [
      "timezone converter",
      "epoch converter",
      "unix timestamp to date",
      "world clock meeting planner",
      "utc to ist converter",
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

const POPULAR_TOOL_SLUGS = [
  "image-compressor",
  "merge-pdf",
  "qr-generator",
  "json-formatter",
  "password-generator",
  "emi-calculator",
];

/**
 * Get popular tools across categories for the homepage.
 */
export function getPopularTools(count: number = 6): ToolConfig[] {
  const popular = POPULAR_TOOL_SLUGS.map((slug) =>
    tools.find((t) => t.slug === slug),
  ).filter((t): t is ToolConfig => t !== undefined);

  if (popular.length >= count) {
    return popular.slice(0, count);
  }

  const remaining = tools.filter((t) => !POPULAR_TOOL_SLUGS.includes(t.slug));
  return [...popular, ...remaining].slice(0, count);
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
