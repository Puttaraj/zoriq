"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Copy,
  Check,
  Trash2,
  AlignLeft,
  Minimize,
  AlertCircle,
  FileCode,
  GitCompare,
  FolderTree,
  Quote,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { JsonTreeView } from "./json-tree-view";
import {
  jsonToTypeScript,
  escapeJsonString,
  computeJsonDiff,
  DiffResult,
} from "../lib/json-utils";

type ViewMode = "format" | "tree" | "diff";

export function JsonWorkspace() {
  const [viewMode, setViewMode] = useState<ViewMode>("format");
  const [input, setInput] = useState(
    '{\n  "service": "ZORIQ",\n  "version": 1,\n  "features": ["Image", "PDF", "Developer"],\n  "active": true,\n  "author": {\n    "name": "Engineering",\n    "location": "Bengaluru"\n  }\n}',
  );
  const [diffInput, setDiffInput] = useState(
    '{\n  "service": "ZORIQ",\n  "version": 2,\n  "features": ["Image", "PDF", "Developer", "AI"],\n  "active": true,\n  "author": {\n    "name": "Engineering",\n    "location": "Bengaluru"\n  },\n  "updatedAt": "2026-10-26"\n}',
  );
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState<number | string>(2);
  const [error, setError] = useState<{ message: string; line?: number } | null>(
    null,
  );
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopyText = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const parsedData = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  }, [input]);

  const diffResults = useMemo<DiffResult[]>(() => {
    if (viewMode !== "diff") return [];
    try {
      const obj1 = JSON.parse(input || "{}");
      const obj2 = JSON.parse(diffInput || "{}");
      return computeJsonDiff(obj1, obj2);
    } catch {
      return [];
    }
  }, [input, diffInput, viewMode]);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      setError(null);
      const parsed = JSON.parse(input);
      const indent = indentSize === "tab" ? "\t" : Number(indentSize);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Invalid JSON format";
      let lineNum: number | undefined;
      const match =
        errMsg.match(/line\s+(\d+)/i) || errMsg.match(/position\s+(\d+)/i);
      if (match && match[1]) {
        lineNum = Number(match[1]);
      }
      setError({ message: errMsg, line: lineNum });
      setOutput("");
    }
  }, [input, indentSize]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      setError(null);
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Invalid JSON format";
      setError({ message: errMsg });
      setOutput("");
    }
  }, [input]);

  const handleCopyEscaped = () => {
    const textToEscape = output || input;
    if (!textToEscape) return;
    const escaped = escapeJsonString(textToEscape);
    handleCopyText(escaped, "escaped");
  };

  const handleCopyTypeScript = () => {
    if (!parsedData) {
      setError({
        message: "Provide valid JSON to generate TypeScript interface.",
      });
      return;
    }
    const ts = jsonToTypeScript(parsedData, "ZoriqPayload");
    handleCopyText(ts, "ts");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      {/* Top Header Mode Navigation Tabs */}
      <div className="border-border/40 mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="bg-muted/30 border-border/40 flex items-center rounded-xl border p-1">
          <button
            type="button"
            onClick={() => setViewMode("format")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "format"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignLeft className="h-3.5 w-3.5" />
            Format &amp; Minify
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode("tree");
              handleFormat();
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "tree"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            Tree View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("diff")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "diff"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            JSON Diff
          </button>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyEscaped}
            disabled={!input.trim()}
            className="border-border bg-card hover:bg-muted text-foreground focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all disabled:opacity-40"
            title="Copy JSON as escaped string for strings / cURL"
          >
            {copyFeedback === "escaped" ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Quote className="h-3.5 w-3.5" />
            )}
            {copyFeedback === "escaped" ? "Copied Escaped" : "Copy Escaped"}
          </button>

          <button
            type="button"
            onClick={handleCopyTypeScript}
            disabled={!parsedData}
            className="border-border bg-card hover:bg-muted text-foreground focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all disabled:opacity-40"
            title="Generate TypeScript interfaces from JSON schema"
          >
            {copyFeedback === "ts" ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <FileCode className="h-3.5 w-3.5" />
            )}
            {copyFeedback === "ts" ? "Copied TypeScript" : "Copy TypeScript"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all"
            aria-label="Clear input"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Main Workspace based on active mode */}
      {viewMode === "format" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Input Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                Raw Input JSON
              </span>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste JSON here...\nExample: {"name": "ZORIQ", "active": true}'
              rows={15}
              className="border-border bg-muted/10 focus:border-primary w-full resize-y rounded-xl border p-4 font-mono text-sm leading-relaxed outline-none"
              aria-label="JSON Input"
            />
          </div>

          {/* Output Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                Formatted Output
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={indentSize}
                  onChange={(e) =>
                    setIndentSize(
                      e.target.value === "tab" ? "tab" : Number(e.target.value),
                    )
                  }
                  className="border-border bg-background focus:border-primary h-8 rounded-lg border px-2.5 py-1 text-xs outline-none"
                  aria-label="Indentation spacing"
                >
                  <option value="2">2 Spaces</option>
                  <option value="4">4 Spaces</option>
                  <option value="tab">Tab Indent</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleCopyText(output || input, "formatted")}
                  disabled={!output && !input}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Copy output"
                >
                  {copyFeedback === "formatted" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copyFeedback === "formatted" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder="Click Format / Beautify to view output..."
                rows={15}
                className="border-border bg-muted/20 focus:border-primary w-full resize-y rounded-xl border p-4 font-mono text-sm leading-relaxed outline-none"
                aria-label="JSON Output"
              />
            </div>
          </div>
        </div>
      )}

      {viewMode === "tree" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-semibold">
              Interactive Collapsible Tree Explorer
            </span>
            <span className="text-muted-foreground text-xs">
              Click chevrons to expand or collapse nodes
            </span>
          </div>

          <div className="border-border bg-muted/15 max-h-[500px] min-h-[380px] overflow-auto rounded-xl border p-5 font-mono text-xs shadow-inner">
            {parsedData !== null ? (
              <JsonTreeView data={parsedData} isLast={true} />
            ) : (
              <div className="text-muted-foreground flex h-64 flex-col items-center justify-center gap-2">
                <AlertCircle className="h-8 w-8 text-amber-500" />
                <p className="font-semibold">Invalid JSON Input</p>
                <p className="text-xs">
                  Switch to Format mode to check syntax errors before rendering
                  Tree View.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === "diff" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                Original JSON (A)
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                className="border-border bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
                placeholder="Paste original JSON..."
              />
            </div>
            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                Compared JSON (B)
              </label>
              <textarea
                value={diffInput}
                onChange={(e) => setDiffInput(e.target.value)}
                rows={10}
                className="border-border bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
                placeholder="Paste updated JSON to compare..."
              />
            </div>
          </div>

          {/* Diff Result List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                Differences Detected ({diffResults.length})
              </span>
            </div>

            <div className="border-border bg-muted/20 flex max-h-[320px] flex-col gap-2 overflow-y-auto rounded-xl border p-4 font-mono text-xs">
              {diffResults.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  ✓ Both JSON objects are identical or no valid comparison could
                  be made.
                </div>
              ) : (
                diffResults.map((diff, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${
                      diff.type === "added"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : diff.type === "removed"
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Path: {diff.path}</span>
                      <span className="bg-background/50 rounded px-2 py-0.5 text-[10px] tracking-wider uppercase">
                        {diff.type}
                      </span>
                    </div>
                    {diff.oldValue !== undefined && (
                      <div className="mt-1.5 opacity-90">
                        <span className="font-semibold">- Before: </span>
                        <span>{diff.oldValue}</span>
                      </div>
                    )}
                    {diff.newValue !== undefined && (
                      <div className="mt-1 opacity-90">
                        <span className="font-semibold">+ After: </span>
                        <span>{diff.newValue}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Actions & Error Messages */}
      <div className="border-border/60 mt-6 flex flex-col gap-4 border-t pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleFormat}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
          >
            <AlignLeft className="h-4 w-4" />
            Format / Beautify
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all"
          >
            <Minimize className="h-4 w-4" />
            Minify JSON
          </button>
        </div>

        {error && (
          <div className="border-destructive/20 bg-destructive/5 text-destructive animate-fade-in flex items-start gap-2.5 rounded-xl border p-4 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">JSON Validation Failed</p>
              <p className="mt-1 text-xs opacity-90">{error.message}</p>
              {error.line && (
                <span className="bg-destructive/10 mt-1 inline-block rounded px-2 py-0.5 font-mono text-xs">
                  Error location: line {error.line}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
