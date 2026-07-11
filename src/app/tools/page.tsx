"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, FolderSync } from "lucide-react";
import { tools } from "@/config/tools";
import { categories } from "@/config/categories";
import { ToolCard } from "@/components/shared/tool-card";
import { cn } from "@/lib/utils";

function ToolsListContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Sync state with query parameters on mount or param changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("q");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  // Filter tools list based on criteria
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some((kw) =>
          kw.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search and filter toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="border-border bg-card focus-within:border-primary relative flex h-11 w-full items-center rounded-xl border px-3 transition-all sm:max-w-xs">
          <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all tools..."
            className="placeholder:text-muted-foreground/60 ml-2.5 w-full flex-1 bg-transparent text-sm outline-none"
            aria-label="Search all tools"
          />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "focus-ring rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted",
            )}
          >
            All Tools
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "focus-ring rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 py-20 text-center shadow-inner">
          <FolderSync className="text-muted-foreground/30 mb-3 h-10 w-10" />
          <h3 className="text-foreground text-sm font-semibold">
            No Tools Found
          </h3>
          <p className="text-muted-foreground mt-1 max-w-xs text-xs">
            We couldn&apos;t find any tools matching &quot;{searchQuery}&quot;
            in the selected category.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="container-tight py-8 md:py-12">
      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          All Tools
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Browse and filter our complete suite of browser-based utilities
        </p>
      </div>

      <Suspense
        fallback={
          <div className="bg-muted/10 h-96 animate-pulse rounded-2xl border" />
        }
      >
        <ToolsListContent />
      </Suspense>
    </div>
  );
}
