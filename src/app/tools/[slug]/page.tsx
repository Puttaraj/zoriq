import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getToolBySlug, getRelatedTools, tools } from "@/config/tools";
import { getCategoryBySlug } from "@/config/categories";
import {
  generateToolMetadata,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateToolSchema,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FAQSection } from "@/components/shared/faq-section";
import { RelatedTools } from "@/components/shared/related-tools";
import { AdPlaceholder } from "@/components/ads/ad-slots";
import { ShareButton } from "@/components/shared/share-button";
import { CopyButton } from "@/components/shared/copy-button";
import { siteConfig } from "@/config/site";

// Dynamic imports for Tool Workspaces to keep initial JS bundles tiny (< 150KB)
const PasswordWorkspace = dynamic(
  () =>
    import("@/features/password-generator").then((m) => m.PasswordWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const UuidWorkspace = dynamic(
  () => import("@/features/uuid-generator").then((m) => m.UuidWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const QrWorkspace = dynamic(
  () => import("@/features/qr-generator").then((m) => m.QrWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const JsonWorkspace = dynamic(
  () => import("@/features/json-formatter").then((m) => m.JsonWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const WordWorkspace = dynamic(
  () => import("@/features/word-counter").then((m) => m.WordWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const AgeWorkspace = dynamic(
  () => import("@/features/age-calculator").then((m) => m.AgeWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const EmiWorkspace = dynamic(
  () => import("@/features/emi-calculator").then((m) => m.EmiWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const CompressorWorkspace = dynamic(
  () =>
    import("@/features/image-compressor").then((m) => m.CompressorWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const ConverterWorkspace = dynamic(
  () => import("@/features/image-converter").then((m) => m.ConverterWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const SipWorkspace = dynamic(
  () => import("@/features/sip-calculator").then((m) => m.SipWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const JwtWorkspace = dynamic(
  () => import("@/features/jwt-decoder").then((m) => m.JwtWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const BackgroundRemoverWorkspace = dynamic(
  () =>
    import("@/features/ai-background-remover").then(
      (m) => m.BackgroundRemoverWorkspace,
    ),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const AtsWorkspace = dynamic(
  () => import("@/features/ats-resume-checker").then((m) => m.AtsWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const ResumeBuilderWorkspace = dynamic(
  () =>
    import("@/features/ats-resume-builder").then(
      (m) => m.ResumeBuilderWorkspace,
    ),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);

const Base64Workspace = dynamic(
  () => import("@/features/base64-converter").then((m) => m.Base64Workspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const CronWorkspace = dynamic(
  () => import("@/features/cron-generator").then((m) => m.CronWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const RegexWorkspace = dynamic(
  () => import("@/features/regex-tester").then((m) => m.RegexWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const CurlWorkspace = dynamic(
  () => import("@/features/curl-converter").then((m) => m.CurlWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const SvgWorkspace = dynamic(
  () => import("@/features/svg-to-png").then((m) => m.SvgWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const ExifWorkspace = dynamic(
  () => import("@/features/remove-exif").then((m) => m.ExifWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const MockupWorkspace = dynamic(
  () => import("@/features/screenshot-mockup").then((m) => m.MockupWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const MarkdownWorkspace = dynamic(
  () => import("@/features/markdown-to-html").then((m) => m.MarkdownWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const DiffWorkspace = dynamic(
  () => import("@/features/diff-checker").then((m) => m.DiffWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);
const TimezoneWorkspace = dynamic(
  () =>
    import("@/features/timezone-converter").then((m) => m.TimezoneWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);

// Import SEO Assets and FAQs directly
import * as passwordFeature from "@/features/password-generator";
import * as uuidFeature from "@/features/uuid-generator";
import * as qrFeature from "@/features/qr-generator";
import * as jsonFeature from "@/features/json-formatter";
import * as wordFeature from "@/features/word-counter";
import * as ageFeature from "@/features/age-calculator";
import * as emiFeature from "@/features/emi-calculator";
import * as compressorFeature from "@/features/image-compressor";
import * as converterFeature from "@/features/image-converter";
import * as sipFeature from "@/features/sip-calculator";
import * as jwtFeature from "@/features/jwt-decoder";
import * as bgRemoverFeature from "@/features/ai-background-remover";
import * as atsFeature from "@/features/ats-resume-checker";
import * as resumeBuilderFeature from "@/features/ats-resume-builder";
import * as base64Feature from "@/features/base64-converter";
import * as cronFeature from "@/features/cron-generator";
import * as regexFeature from "@/features/regex-tester";
import * as curlFeature from "@/features/curl-converter";
import * as svgFeature from "@/features/svg-to-png";
import * as exifFeature from "@/features/remove-exif";
import * as mockupFeature from "@/features/screenshot-mockup";
import * as markdownFeature from "@/features/markdown-to-html";
import * as diffFeature from "@/features/diff-checker";
import * as timezoneFeature from "@/features/timezone-converter";

const PDFWorkspace = dynamic(
  () => import("@/features/pdf").then((m) => m.PDFWorkspace),
  {
    loading: () => (
      <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
    ),
  },
);

// Map slugs to feature configurations
const featureMap: Record<
  string,
  {
    workspace: React.ComponentType;
    seoContent: string;
    faqs: { question: string; answer: string }[];
  }
> = {
  "password-generator": {
    workspace: PasswordWorkspace,
    seoContent: passwordFeature.seoContent,
    faqs: passwordFeature.faqs,
  },
  "uuid-generator": {
    workspace: UuidWorkspace,
    seoContent: uuidFeature.seoContent,
    faqs: uuidFeature.faqs,
  },
  "qr-generator": {
    workspace: QrWorkspace,
    seoContent: qrFeature.seoContent,
    faqs: qrFeature.faqs,
  },
  "json-formatter": {
    workspace: JsonWorkspace,
    seoContent: jsonFeature.seoContent,
    faqs: jsonFeature.faqs,
  },
  "word-counter": {
    workspace: WordWorkspace,
    seoContent: wordFeature.seoContent,
    faqs: wordFeature.faqs,
  },
  "age-calculator": {
    workspace: AgeWorkspace,
    seoContent: ageFeature.seoContent,
    faqs: ageFeature.faqs,
  },
  "emi-calculator": {
    workspace: EmiWorkspace,
    seoContent: emiFeature.seoContent,
    faqs: emiFeature.faqs,
  },
  "sip-calculator": {
    workspace: SipWorkspace,
    seoContent: sipFeature.seoContent,
    faqs: sipFeature.faqs,
  },
  "image-compressor": {
    workspace: () => <CompressorWorkspace />,
    seoContent: compressorFeature.seoContent,
    faqs: compressorFeature.faqs,
  },
  "compress-image-to-20kb": {
    workspace: () => <CompressorWorkspace defaultTargetKB={20} />,
    seoContent: `
## Compress Image to 20KB Online
Need to reduce your photo or signature file size to under 20KB for government exam forms (SSC, UPSC, IBPS, State PSC)? ZORIQ Compress to 20KB optimizes image dimensions and JPEG encoding directly in your browser without uploading your sensitive ID photos to any third-party server.

## Ideal For
* **Online Exam Application Portals:** SSC CGL, CHSL, UPSC Civil Services, Banking (IBPS, SBI), Railway (RRB).
* **Signatures & Thumb Impressions:** Most government application portals strictly mandate signature files between 10KB and 20KB.
* **100% Client-Side Privacy:** Your biometric photos and signatures never leave your device.
    `,
    faqs: [
      {
        question: "How do I compress an image to under 20KB?",
        answer:
          "Upload your image or signature photo. ZORIQ automatically tunes resolution and compression algorithms to keep the file strictly under 20KB. Click Download to save.",
      },
      {
        question: "Will my photo quality be ruined?",
        answer:
          "No. The compressor uses smart edge-preserving downsampling to ensure your photo remains clear, legible, and compliant with official specifications.",
      },
    ],
  },
  "compress-image-to-50kb": {
    workspace: () => <CompressorWorkspace defaultTargetKB={50} />,
    seoContent: `
## Compress Image to 50KB Online
Easily reduce passport-size photos, admit card pictures, and ID proofs to under 50KB. Perfect for college admission portals, employment registration, and visa applications.

## Key Advantages
* **Strict 50KB Upper Limit:** Guaranteed to pass strict file size upload filters on web forms.
* **Preserves Facial Recognition Clarity:** Maintains facial sharpness, colors, and correct passport aspect ratios.
* **Instant In-Browser Compression:** No waiting for cloud queues or server uploads.
    `,
    faqs: [
      {
        question: "Why do government portals require photos under 50KB?",
        answer:
          "Portals receive millions of applicant submissions. Restricting photo sizes to under 50KB saves server bandwidth and database storage while keeping web form submissions fast.",
      },
      {
        question: "Can I compress photos directly from my phone?",
        answer:
          "Yes! ZORIQ works in mobile browsers on Android and iPhone. Take a photo and compress it instantly.",
      },
    ],
  },
  "image-converter": {
    workspace: ConverterWorkspace,
    seoContent: converterFeature.seoContent,
    faqs: converterFeature.faqs,
  },
  "jwt-decoder": {
    workspace: JwtWorkspace,
    seoContent: jwtFeature.seoContent,
    faqs: jwtFeature.faqs,
  },
  "background-remover": {
    workspace: BackgroundRemoverWorkspace,
    seoContent: bgRemoverFeature.seoContent,
    faqs: bgRemoverFeature.faqs,
  },
  "ats-resume-checker": {
    workspace: AtsWorkspace,
    seoContent: atsFeature.seoContent,
    faqs: atsFeature.faqs,
  },
  "ats-resume-builder": {
    workspace: ResumeBuilderWorkspace,
    seoContent: resumeBuilderFeature.seoContent,
    faqs: resumeBuilderFeature.faqs,
  },
  "base64-converter": {
    workspace: Base64Workspace,
    seoContent: base64Feature.seoContent,
    faqs: base64Feature.faqs,
  },
  "cron-generator": {
    workspace: CronWorkspace,
    seoContent: cronFeature.seoContent,
    faqs: cronFeature.faqs,
  },
  "regex-tester": {
    workspace: RegexWorkspace,
    seoContent: regexFeature.seoContent,
    faqs: regexFeature.faqs,
  },
  "curl-converter": {
    workspace: CurlWorkspace,
    seoContent: curlFeature.seoContent,
    faqs: curlFeature.faqs,
  },
  "svg-to-png": {
    workspace: SvgWorkspace,
    seoContent: svgFeature.seoContent,
    faqs: svgFeature.faqs,
  },
  "remove-exif": {
    workspace: ExifWorkspace,
    seoContent: exifFeature.seoContent,
    faqs: exifFeature.faqs,
  },
  "screenshot-mockup": {
    workspace: MockupWorkspace,
    seoContent: mockupFeature.seoContent,
    faqs: mockupFeature.faqs,
  },
  "markdown-to-html": {
    workspace: MarkdownWorkspace,
    seoContent: markdownFeature.seoContent,
    faqs: markdownFeature.faqs,
  },
  "diff-checker": {
    workspace: DiffWorkspace,
    seoContent: diffFeature.seoContent,
    faqs: diffFeature.faqs,
  },
  "timezone-converter": {
    workspace: TimezoneWorkspace,
    seoContent: timezoneFeature.seoContent,
    faqs: timezoneFeature.faqs,
  },
};

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  return generateToolMetadata(tool);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  let Workspace: React.ComponentType;
  let feature: {
    seoContent?: string;
    faqs?: { question: string; answer: string }[];
  } = {};

  if (tool.category === "pdf") {
    const PDFWorkspaceWrapper = function PDFWorkspaceWrapper() {
      return <PDFWorkspace slug={slug} />;
    };
    Workspace = PDFWorkspaceWrapper;
    feature.seoContent = `
## About ${tool.name}
ZORIQ ${tool.name} is a high-performance utility designed to manipulate documents directly inside your browser. Built with local client-side libraries, it requires zero files upload to a server.

## Key Features
${tool.features.map((f) => `* **${f.split(" — ")[0] || f}**: ${f.split(" — ")[1] || ""}`).join("\n")}

## Clean Workflow Directives
1. **Load Files**: Drag & drop or browse your local system.
2. **Apply Options**: Choose page ranges, passwords, or drawings.
3. **Execute Compiler**: Click run to trigger processing.
4. **Immediate Saving**: Click download to save the processed file.
    `;
    feature.faqs = [
      {
        question: `Is ${tool.name} completely free and private?`,
        answer: `Yes, ZORIQ ${tool.name} is 100% free with no sign-ups or subscription fees. All file processing occurs client-side in your web browser, meaning your sensitive files never touch external servers or cloud storage.`,
      },
      {
        question: `Is there a file size or document limit?`,
        answer: `You can process files up to 25MB locally in your browser. Because computation leverages your local device resources, processing is instantaneous and has no daily usage limits.`,
      },
      {
        question: `Can I use ${tool.name} on my mobile device?`,
        answer: `Yes. ZORIQ is optimized for modern mobile browsers on Android and iOS, allowing you to manipulate and download PDFs without installing third-party apps.`,
      },
      {
        question: `What should I do if my document fails to process?`,
        answer: `Ensure your PDF is not corrupted or encrypted with restricted owner permissions. If your document requires a password, use our Unlock PDF tool first to decrypt it before applying further changes.`,
      },
    ];
  } else {
    const featureData = featureMap[slug];
    if (!featureData) {
      notFound();
    }
    Workspace = featureData.workspace;
    feature = {
      seoContent: featureData.seoContent,
      faqs: featureData.faqs,
    };
  }

  const category = getCategoryBySlug(tool.category);
  const related = getRelatedTools(tool.slug);

  const breadcrumbs = [
    {
      label: category ? category.name : "Tools",
      href: `/tools?category=${tool.category}`,
    },
    { label: tool.name },
  ];

  // Simple Markdown to HTML parser for SEO Content rendering
  const parseMarkdown = (md: string) => {
    return md
      .split("\n")
      .map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-heading text-foreground mt-8 mb-4 text-xl font-bold"
            >
              {trimmed.substring(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("* ")) {
          return (
            <li
              key={idx}
              className="text-muted-foreground my-1.5 ml-4 list-disc text-sm leading-relaxed"
            >
              {trimmed.substring(2)}
            </li>
          );
        }
        if (trimmed) {
          // Replace inline bold formatting like **text**
          const parts = trimmed.split(/(\*\*.*?\*\*)/);
          return (
            <p
              key={idx}
              className="text-muted-foreground my-3 text-sm leading-relaxed"
            >
              {parts.map((part, pIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong
                      key={pIdx}
                      className="text-foreground font-semibold"
                    >
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(feature.faqs || [])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolSchema(tool)),
        }}
      />

      <div className="container-tight py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        {/* Heading Row */}
        <div className="mb-8 flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {tool.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
              {tool.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:self-start">
            <ShareButton
              url={`${siteConfig.url}/tools/${tool.slug}`}
              title={`ZORIQ — ${tool.name}`}
            />
            <CopyButton
              text={`${siteConfig.url}/tools/${tool.slug}`}
              label="Copy Link"
            />
            <Link
              href={`/contact?subject=Report%20Issue%20with%20${tool.slug}`}
              className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all"
            >
              Report Issue
            </Link>
          </div>
        </div>

        {/* Workspace Card Container */}
        <div className="mb-10">
          <Workspace />
        </div>

        {/* Ad Space */}
        <div className="mb-12">
          <AdPlaceholder label="Responsive Banner Placement" height={90} />
        </div>

        {/* SEO Text Content */}
        {feature.seoContent && (
          <article className="border-border/60 mx-auto max-w-3xl border-t pt-8">
            <h2 className="font-heading text-foreground mb-6 text-2xl font-bold">
              About {tool.name}
            </h2>
            {parseMarkdown(feature.seoContent)}
          </article>
        )}

        {/* FAQ Accordion */}
        {feature.faqs && feature.faqs.length > 0 && (
          <div className="border-border/60 mt-12 border-t pt-8">
            <FAQSection faqs={feature.faqs} title={`${tool.name} FAQs`} />
          </div>
        )}

        {/* Related Tools */}
        {related.length > 0 && (
          <div className="border-border/60 mt-12 border-t">
            <RelatedTools tools={related} />
          </div>
        )}
      </div>
    </>
  );
}
