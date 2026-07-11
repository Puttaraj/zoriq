import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
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
  "image-compressor": {
    workspace: CompressorWorkspace,
    seoContent: compressorFeature.seoContent,
    faqs: compressorFeature.faqs,
  },
  "image-converter": {
    workspace: ConverterWorkspace,
    seoContent: converterFeature.seoContent,
    faqs: converterFeature.faqs,
  },
};

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateToolMetadata(tool);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const feature = featureMap[slug];

  if (!tool || !feature) {
    notFound();
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

  const Workspace = feature.workspace;

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
          __html: JSON.stringify(generateFAQSchema(feature.faqs)),
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

        {/* Heading */}
        <div className="mb-8 max-w-3xl">
          <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            {tool.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            {tool.description}
          </p>
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
