"use client";

import { useState, useMemo } from "react";
import { Trash2, Copy, Check, PlusCircle, MinusCircle } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const SAMPLE_OLD = `function calculateTotal(price, taxRate) {
  const tax = price * taxRate;
  const total = price + tax;
  return total;
}`;

const SAMPLE_NEW = `function calculateTotal(price, taxRate, discount = 0) {
  const discountedPrice = price - discount;
  const tax = discountedPrice * taxRate;
  const total = discountedPrice + tax;
  return Math.round(total * 100) / 100;
}`;

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

function computeLineDiff(
  text1: string,
  text2: string,
  ignoreWhitespace = false,
): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");

  const diff: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let oldLine = 1;
  let newLine = 1;

  while (i < lines1.length || j < lines2.length) {
    const l1 = lines1[i];
    const l2 = lines2[j];

    const c1 = ignoreWhitespace && l1 !== undefined ? l1.trim() : l1;
    const c2 = ignoreWhitespace && l2 !== undefined ? l2.trim() : l2;

    if (i < lines1.length && j < lines2.length && c1 === c2) {
      diff.push({
        type: "unchanged",
        content: l1,
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
      });
      i++;
      j++;
    } else if (
      j >= lines2.length ||
      (i < lines1.length &&
        !lines2.slice(j).some((x) => (ignoreWhitespace ? x.trim() : x) === c1))
    ) {
      diff.push({
        type: "removed",
        content: l1,
        oldLineNumber: oldLine++,
      });
      i++;
    } else {
      diff.push({
        type: "added",
        content: l2,
        newLineNumber: newLine++,
      });
      j++;
    }
  }

  return diff;
}

export function DiffWorkspace() {
  const [original, setOriginal] = useState(SAMPLE_OLD);
  const [modified, setModified] = useState(SAMPLE_NEW);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [copied, setCopied] = useState(false);

  const diffLines = useMemo(() => {
    return computeLineDiff(original, modified, ignoreWhitespace);
  }, [original, modified, ignoreWhitespace]);

  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === "added").length;
    const removed = diffLines.filter((l) => l.type === "removed").length;
    return { added, removed };
  }, [diffLines]);

  const handleCopyUnified = async () => {
    const text = diffLines
      .map((l) => {
        const prefix =
          l.type === "added" ? "+" : l.type === "removed" ? "-" : " ";
        return `${prefix} ${l.content}`;
      })
      .join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Top Controls Bar */}
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <PlusCircle className="h-3.5 w-3.5" /> +{stats.added}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
              <MinusCircle className="h-3.5 w-3.5" /> -{stats.removed}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="text-primary focus:ring-primary h-3.5 w-3.5 rounded"
              />
              Ignore Whitespace
            </label>

            <button
              type="button"
              onClick={handleCopyUnified}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied Diff" : "Copy Diff"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive rounded p-1"
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Original Text (Before)
            </span>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={8}
              className="border-border bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
              placeholder="Paste original text or code here..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Modified Text (After)
            </span>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              rows={8}
              className="border-border bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
              placeholder="Paste modified text or code here..."
            />
          </div>
        </div>

        {/* Diff Output Display */}
        <div className="flex flex-col gap-2">
          <span className="text-foreground text-xs font-bold tracking-wider uppercase">
            Comparison Results
          </span>

          <div className="border-border bg-muted/20 flex max-h-[420px] flex-col overflow-auto rounded-xl border font-mono text-xs">
            {diffLines.length > 0 ? (
              diffLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`border-border/10 flex items-start border-b px-3 py-0.5 ${
                    line.type === "added"
                      ? "bg-emerald-500/15 font-semibold text-emerald-800 dark:text-emerald-300"
                      : line.type === "removed"
                        ? "bg-rose-500/15 font-semibold text-rose-800 line-through opacity-85 dark:text-rose-300"
                        : "text-foreground opacity-90"
                  }`}
                >
                  <span className="w-10 pr-3 text-right text-[10px] opacity-40 select-none">
                    {line.oldLineNumber || ""}
                  </span>
                  <span className="w-10 pr-3 text-right text-[10px] opacity-40 select-none">
                    {line.newLineNumber || ""}
                  </span>
                  <span className="w-6 text-center font-bold select-none">
                    {line.type === "added"
                      ? "+"
                      : line.type === "removed"
                        ? "-"
                        : " "}
                  </span>
                  <span className="flex-1 break-all whitespace-pre-wrap">
                    {line.content || " "}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-8 text-center text-xs">
                Paste text above to compute instant line diffs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
