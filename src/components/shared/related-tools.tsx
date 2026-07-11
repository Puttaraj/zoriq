import Link from "next/link";
import { ToolCard } from "@/components/shared/tool-card";
import type { ToolConfig } from "@/types/tool";

interface RelatedToolsProps {
  tools: ToolConfig[];
  title?: string;
}

export function RelatedTools({
  tools,
  title = "Related Tools",
}: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="container-tight">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            {title}
          </h2>
          <Link
            href="/tools"
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            View all tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 3).map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
