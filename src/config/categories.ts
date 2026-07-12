/**
 * ZORIQ — Category Definitions
 */

import type { CategoryConfig } from "@/types/tool";

export const categories: CategoryConfig[] = [
  {
    slug: "developer",
    name: "Developer Tools",
    description:
      "Essential utilities for developers — JSON formatter, UUID generator, password generator, and more.",
    icon: "Code2",
    color: "from-violet-500 to-purple-600",
    toolCount: 4,
  },
  {
    slug: "image",
    name: "Image Tools",
    description:
      "Compress, convert, and optimize images directly in your browser. No upload required.",
    icon: "Image",
    color: "from-pink-500 to-rose-600",
    toolCount: 2,
  },
  {
    slug: "student",
    name: "Student Tools",
    description:
      "Word counter, age calculator, and more tools designed for students and writers.",
    icon: "GraduationCap",
    color: "from-blue-500 to-cyan-600",
    toolCount: 2,
  },
  {
    slug: "finance",
    name: "Finance Tools",
    description:
      "EMI calculator, SIP calculator, and financial planning tools for smart decisions.",
    icon: "IndianRupee",
    color: "from-emerald-500 to-green-600",
    toolCount: 1,
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    description:
      "Compress, merge, split, and convert PDFs. Coming soon with AI-powered features.",
    icon: "FileText",
    color: "from-orange-500 to-amber-600",
    toolCount: 26,
  },
  {
    slug: "ai",
    name: "AI Tools",
    description:
      "AI-powered utilities — image enhancement, text generation, and more. Coming soon.",
    icon: "Sparkles",
    color: "from-fuchsia-500 to-purple-600",
    toolCount: 0,
  },
  {
    slug: "utilities",
    name: "Utilities",
    description:
      "General daily utility tools, conversion scripts, formatting helpers, and more.",
    icon: "Wrench",
    color: "from-teal-500 to-cyan-600",
    toolCount: 0,
  },
];

/**
 * Get categories that have at least one tool.
 */
export function getActiveCategories(): CategoryConfig[] {
  return categories.filter((c) => c.toolCount > 0);
}

/**
 * Get a category by its slug.
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categories.find((c) => c.slug === slug);
}
