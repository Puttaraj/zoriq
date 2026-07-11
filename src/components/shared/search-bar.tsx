"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchTools } from "@/config/tools";
import { cn } from "@/lib/utils";
import type { ToolConfig } from "@/types/tool";

interface SearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Full-size variant for hero section */
  variant?: "default" | "hero";
}

export function SearchBar({
  placeholder = "Search tools...",
  className,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolConfig[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setResults(searchTools(value));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const handleSelect = useCallback(
    (slug: string) => {
      setQuery("");
      setResults([]);
      setIsOpen(false);
      router.push(`/tools/${slug}`);
    },
    [router],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }, []);

  return (
    <div className={cn("relative w-full", className)} role="search">
      <div
        className={cn(
          "relative flex items-center rounded-xl border transition-all",
          variant === "hero"
            ? "border-border/60 bg-card shadow-soft focus-within:border-primary/50 h-14 px-5 focus-within:shadow-lg"
            : "border-border bg-background focus-within:border-primary/50 h-10 px-3",
        )}
      >
        <Search
          className={cn(
            "text-muted-foreground flex-shrink-0",
            variant === "hero" ? "h-5 w-5" : "h-4 w-4",
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className={cn(
            "placeholder:text-muted-foreground/60 flex-1 bg-transparent outline-none",
            variant === "hero" ? "ml-3 text-base" : "ml-2 text-sm",
          )}
          aria-label="Search tools"
          aria-expanded={isOpen}
          aria-controls="search-results"
          role="combobox"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          role="listbox"
          className="border-border bg-card absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border shadow-lg"
        >
          {results.slice(0, 6).map((tool) => (
            <button
              key={tool.slug}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(tool.slug)}
              className="hover:bg-muted flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
            >
              <span className="text-foreground font-medium">{tool.name}</span>
              <span className="text-muted-foreground ml-auto text-xs">
                {tool.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div
          id="search-results"
          className="border-border bg-card absolute top-full right-0 left-0 z-50 mt-2 rounded-xl border p-4 shadow-lg"
        >
          <p className="text-muted-foreground text-center text-sm">
            No tools found for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
