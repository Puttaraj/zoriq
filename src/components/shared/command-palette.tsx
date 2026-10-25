"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { tools } from "@/config/tools";
import { categories } from "@/config/categories";
import type { ToolConfig } from "@/types/tool";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K and custom open event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter tools based on search query and category
  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.description.toLowerCase().includes(q);
      const catMatch = tool.category.toLowerCase().includes(q);
      const keywordsMatch = tool.keywords?.some((k) =>
        k.toLowerCase().includes(q),
      );

      return nameMatch || descMatch || catMatch || keywordsMatch;
    });
  }, [query, selectedCategory]);

  // Reset selected index when query or results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  const handleSelect = useCallback(
    (tool: ToolConfig) => {
      setIsOpen(false);
      router.push(`/tools/${tool.slug}`);
    },
    [router],
  );

  // Handle keyboard navigation inside the palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredTools.length - 1 ? prev + 1 : 0,
      );
      scrollSelectedIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredTools.length - 1,
      );
      scrollSelectedIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredTools[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const scrollSelectedIntoView = () => {
    setTimeout(() => {
      const activeEl = listRef.current?.querySelector('[data-active="true"]');
      activeEl?.scrollIntoView({ block: "nearest" });
    }, 10);
  };

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-md sm:pt-24"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="border-border bg-card animate-scale-in flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        {/* Search Input Bar */}
        <div className="border-border/40 relative flex items-center border-b px-4 py-3.5">
          <Search className="text-muted-foreground mr-3 h-5 w-5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search all 30+ tools by name, keyword, or action..."
            className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none sm:text-base"
            aria-autocomplete="list"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground mr-2 rounded p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="bg-muted border-border/40 text-muted-foreground hidden items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] sm:flex">
            ESC
          </kbd>
        </div>

        {/* Category Filter Chips */}
        <div className="border-border/30 bg-muted/15 no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Tools ({tools.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] min-h-[160px] overflow-y-auto p-2"
        >
          {filteredTools.length > 0 ? (
            <div className="flex flex-col gap-1">
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={tool.slug}
                    data-active={isSelected}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all ${
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
                        : "hover:bg-muted/40 text-foreground border border-transparent"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3 pr-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs font-semibold sm:text-sm">
                            {tool.name}
                          </span>
                          <span className="bg-muted border-border/40 text-muted-foreground py-0.2 rounded border px-1.5 text-[9px] font-medium tracking-wider uppercase">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 truncate text-[11px] leading-tight">
                          {tool.shortDescription || tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {isSelected && (
                        <span className="text-primary hidden items-center gap-1 text-[11px] font-semibold sm:flex">
                          Select <CornerDownLeft className="h-3 w-3" />
                        </span>
                      )}
                      <ArrowRight
                        className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
                          isSelected
                            ? "text-primary"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center">
              <Search className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm font-semibold">No tools found</p>
              <p className="mt-1 text-xs">
                No tool matching &quot;{query}&quot;. Try searching for
                &quot;pdf&quot;, &quot;compress&quot;, &quot;qr&quot;, or
                &quot;json&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Keyboard Footer Shortcuts Bar */}
        <div className="border-border/30 bg-muted/20 text-muted-foreground flex items-center justify-between border-t px-4 py-2.5 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-background border-border/40 rounded border px-1 py-0.5 font-mono text-[9px]">
                ↑
              </kbd>
              <kbd className="bg-background border-border/40 rounded border px-1 py-0.5 font-mono text-[9px]">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-background border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px]">
                ↵
              </kbd>{" "}
              Open Tool
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="bg-background border-border/40 rounded border px-1 py-0.5 font-mono text-[9px]">
              <Command className="inline h-2.5 w-2.5" />K
            </kbd>{" "}
            Toggle
          </span>
        </div>
      </div>
    </div>
  );
}
