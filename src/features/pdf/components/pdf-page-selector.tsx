"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckSquare, Square, ZoomIn, Eye } from "lucide-react";
import { pdfEngineService } from "../lib/engine";
import { cn } from "@/lib/utils";

interface PDFPageSelectorProps {
  file: File;
  selectedPages: number[];
  onSelectionChange: (pages: number[]) => void;
  multiple?: boolean;
  readOnly?: boolean;
}

export function PDFPageSelector({
  file,
  selectedPages,
  onSelectionChange,
  multiple = true,
  readOnly = false,
}: PDFPageSelectorProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPages([]);

    const loadPages = async () => {
      try {
        const urls = await pdfEngineService.pdfToImages(file);
        if (!active) return;
        setPages(urls);
      } catch (err) {
        console.error("Failed to render PDF page previews:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPages();

    return () => {
      active = false;
    };
  }, [file]);

  const handleTogglePage = (pageNum: number) => {
    if (!multiple) {
      onSelectionChange([pageNum]);
      return;
    }

    if (selectedPages.includes(pageNum)) {
      onSelectionChange(selectedPages.filter((p) => p !== pageNum));
    } else {
      onSelectionChange([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const handleSelectAll = () => {
    const all = Array.from({ length: pages.length }, (_, i) => i + 1);
    onSelectionChange(all);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="text-muted-foreground text-xs font-semibold">
          Rendering PDF thumbnails...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      {multiple && pages.length > 0 && !readOnly && (
        <div className="border-border/40 flex items-center justify-between border-b pb-3">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Select Pages ({selectedPages.length} of {pages.length} selected)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-primary hover:bg-primary/5 focus-ring rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all"
            >
              Select All
            </button>
            <span className="bg-border/40 h-4 w-px" />
            <button
              type="button"
              onClick={handleClearAll}
              className="text-muted-foreground hover:bg-muted focus-ring rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Pages Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pages.map((url, idx) => {
          const pageNum = idx + 1;
          const isSelected = selectedPages.includes(pageNum);

          return (
            <div
              key={pageNum}
              onClick={() => !readOnly && handleTogglePage(pageNum)}
              className={cn(
                "group border-border/40 bg-card/60 shadow-soft relative flex flex-col overflow-hidden rounded-xl border p-2 transition-all duration-300",
                readOnly
                  ? "cursor-default"
                  : "hover:border-primary/40 cursor-pointer",
                isSelected &&
                  !readOnly &&
                  "border-primary bg-primary/5 shadow-md",
              )}
            >
              {/* Checkbox state top-left */}
              {!readOnly && (
                <div className="absolute top-2 left-2 z-10">
                  {isSelected ? (
                    <CheckSquare className="text-primary fill-primary/10 h-4 w-4" />
                  ) : (
                    <Square className="text-muted-foreground/40 group-hover:text-muted-foreground/60 h-4 w-4" />
                  )}
                </div>
              )}

              {/* Page Number Badge top-right */}
              <div className="bg-muted/90 text-muted-foreground absolute top-2 right-2 z-10 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                Page {pageNum}
              </div>

              {/* Image Preview Canvas */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Page ${pageNum} Preview`}
                className="border-border/10 mt-6 aspect-[3/4] h-auto w-full rounded border bg-white object-contain shadow-sm"
              />

              {/* Zoom Action hover bar */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomUrl(url);
                }}
                className="absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Zoom page"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Lightbox zoomed preview modal */}
      {zoomUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setZoomUrl(null)}
        >
          <div className="relative max-h-screen max-w-lg overflow-hidden p-4">
            <button
              type="button"
              onClick={() => setZoomUrl(null)}
              className="absolute top-6 right-6 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <Eye className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomUrl}
              alt="Zoomed Page Preview"
              className="max-h-[85vh] w-auto rounded-xl bg-white object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
