"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search,
  X,
  History,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { searchTools, tools, getToolsByCategory } from "@/config/tools";
import { categories } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { ToolConfig } from "@/types/tool";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  variant?: "default" | "hero";
}

const POPULAR_TAGS = [
  { name: "Image Compressor", slug: "image-compressor" },
  { name: "QR Generator", slug: "qr-generator" },
  { name: "Password Generator", slug: "password-generator" },
];

export function SearchBar({
  placeholder = "Search tools...",
  className,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolConfig[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCategory = categories.find((c) => c.slug === categoryFilter);
  const categoryTools =
    categoryFilter !== "all" ? getToolsByCategory(categoryFilter) : [];

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zoriq_recent_searches");
      if (stored) {
        setRecent(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to recent searches
  const saveRecentSearch = useCallback(
    (term: string) => {
      try {
        const cleanTerm = term.trim();
        if (!cleanTerm) return;

        const filtered = [
          cleanTerm,
          ...recent.filter((t) => t !== cleanTerm),
        ].slice(0, 3);
        setRecent(filtered);
        localStorage.setItem("zoriq_recent_searches", JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }
    },
    [recent],
  );

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Search logic
  const handleSearch = useCallback(
    (value: string, cat: string = categoryFilter) => {
      setQuery(value);
      setSelectedIndex(-1);

      if (value.trim().length >= 1) {
        setLoading(true);
        // Simulate high-performance search latency
        const timer = setTimeout(() => {
          let searched = searchTools(value);
          if (cat !== "all") {
            searched = searched.filter((t) => t.category === cat);
          }
          setResults(searched);
          setIsOpen(true);
          setLoading(false);
        }, 80);
        return () => clearTimeout(timer);
      } else if (cat !== "all") {
        setResults(getToolsByCategory(cat));
        setIsOpen(true);
        setLoading(false);
      } else {
        setResults([]);
        setLoading(false);
      }
    },
    [categoryFilter],
  );

  // Re-run search if category filter changes
  const handleCategorySelect = (cat: string) => {
    setCategoryFilter(cat);
    handleSearch(query, cat);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleSelect = useCallback(
    (slug: string, name: string) => {
      saveRecentSearch(name);
      setQuery("");
      setResults([]);
      setIsOpen(false);
      setCategoryFilter("all");
      router.push(`/tools/${slug}`);
    },
    [router, saveRecentSearch],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setCategoryFilter("all");
  }, []);

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const listLength = results.length;

    if (e.key === "ArrowDown" && listLength > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % listLength);
    } else if (e.key === "ArrowUp" && listLength > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + listLength) % listLength);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < listLength) {
        const selected = results[selectedIndex];
        if (selected) {
          handleSelect(selected.slug, selected.name);
        }
      } else if (results.length > 0) {
        const first = results[0];
        if (first) {
          handleSelect(first.slug, first.name);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={searchRef}
      className={cn("relative w-full", className)}
      role="search"
    >
      <div
        className={cn(
          "relative flex items-center rounded-xl border transition-all duration-300",
          variant === "hero"
            ? "border-border/60 bg-card/65 shadow-soft focus-within:border-primary/50 focus-within:bg-card h-14 px-5 focus-within:shadow-lg"
            : "border-border bg-background focus-within:border-primary/50 h-10 px-3",
          isOpen && "border-primary/40 bg-card shadow-lg",
        )}
      >
        <Search
          className={cn(
            "text-muted-foreground flex-shrink-0 transition-colors",
            variant === "hero" ? "h-5 w-5" : "h-4 w-4",
            isOpen && "text-primary",
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "placeholder:text-muted-foreground/60 flex-1 border-0 bg-transparent ring-0 outline-none focus:ring-0",
            variant === "hero" ? "ml-3 text-base" : "ml-2 text-sm",
          )}
          aria-label="Search tools"
          aria-expanded={isOpen}
          aria-controls="search-results"
          role="combobox"
          autoComplete="off"
        />

        {loading && (
          <Loader2 className="text-primary mr-2 h-4 w-4 animate-spin" />
        )}

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestion Popover Box */}
      {isOpen && (
        <div
          id="search-results"
          role="listbox"
          className="border-border bg-card animate-scale-in absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border shadow-xl"
        >
          {/* Quick Categories Bar */}
          <div className="border-border/40 bg-muted/20 flex items-center gap-1 overflow-x-auto border-b px-3 py-2">
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className={cn(
                "rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase transition-all",
                categoryFilter === "all"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              All Categories
            </button>
            {categories
              .filter((c) => c.toolCount > 0)
              .map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase transition-all",
                    categoryFilter === cat.slug
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {cat.name.replace(" Tools", "")}
                </button>
              ))}
          </div>

          {/* If query is empty -> Show Recent & Popular or Category-specific recommendations */}
          {!query && (
            <div className="flex flex-col gap-4 p-4">
              {recent.length > 0 && categoryFilter === "all" && (
                <div>
                  <h4 className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                    <History className="h-3 w-3" />
                    Recent Searches
                  </h4>
                  <div className="flex flex-col gap-1">
                    {recent.map((term) => {
                      const matched = tools.find(
                        (t) =>
                          t.name.toLowerCase() === term.toLowerCase() ||
                          t.slug === term,
                      );
                      return (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            if (matched)
                              handleSelect(matched.slug, matched.name);
                            else handleSearch(term);
                          }}
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors"
                        >
                          <span className="truncate">{term}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <Sparkles className="h-3 w-3" />
                  {categoryFilter === "all"
                    ? "Popular Searches"
                    : `Recommended in ${currentCategory?.name || "Category"}`}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(categoryFilter === "all"
                    ? POPULAR_TAGS
                    : categoryTools.slice(0, 8).map((t) => ({
                        name: t.name,
                        slug: t.slug,
                      }))
                  ).map((tag) => (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => handleSelect(tag.slug, tag.name)}
                      className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
                    >
                      <span>{tag.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List: displays search matches OR all tools for the selected category */}
          {results.length > 0 && (
            <div className="border-border/30 border-t p-1">
              <div className="text-muted-foreground px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase">
                {query
                  ? `Search Results (${results.length})`
                  : `All ${currentCategory?.name || "Category Tools"} (${results.length})`}
              </div>
              {results.slice(0, 6).map((tool, idx) => (
                <button
                  key={tool.slug}
                  type="button"
                  role="option"
                  aria-selected={selectedIndex === idx}
                  onClick={() => handleSelect(tool.slug, tool.name)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left transition-colors",
                    selectedIndex === idx
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-semibold">
                      {tool.name}
                    </span>
                    <span className="text-muted-foreground/80 line-clamp-1 text-xs">
                      {tool.shortDescription}
                    </span>
                  </div>
                  <span className="bg-muted/60 text-muted-foreground self-center rounded px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
                    {tool.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No Results found block */}
          {query && results.length === 0 && !loading && (
            <div className="text-muted-foreground p-8 text-center">
              <p className="text-sm font-semibold">
                No results matching &quot;{query}&quot;
              </p>
              <p className="mt-1 text-xs">
                Check the spelling or try selecting another category.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
