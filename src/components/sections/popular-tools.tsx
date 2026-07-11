import { ToolCard } from "@/components/shared/tool-card";
import { getPopularTools } from "@/config/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PopularTools() {
  const popular = getPopularTools(6);

  return (
    <section className="py-16 lg:py-24" id="popular">
      <div className="container-tight">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Popular Tools
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Our most-used tools — loved by thousands of developers, students,
              and professionals.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-primary hover:text-primary/80 hidden items-center gap-1 text-sm font-medium transition-colors sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/tools"
            className="text-primary inline-flex items-center gap-2 text-sm font-medium"
          >
            View all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
