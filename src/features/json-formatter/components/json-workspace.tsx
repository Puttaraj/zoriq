"use client";

import { useState, useCallback } from "react";
import {
  Copy,
  Check,
  Trash2,
  AlignLeft,
  Minimize,
  AlertCircle,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export function JsonWorkspace() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState<number | string>(2);
  const [error, setError] = useState<{ message: string; line?: number } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

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

      // Parse line number from browser JSON error message
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

  const handleCopy = async () => {
    const success = await copyToClipboard(output || input);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Input Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-semibold">
              Raw Input JSON
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClear}
                className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all"
                aria-label="Clear input"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON string here...\nExample: {"name": "ZORIQ", "active": true}'
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
                onClick={handleCopy}
                disabled={!output && !input}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Copy output"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              rows={15}
              className="border-border bg-muted/20 focus:border-primary w-full resize-y rounded-xl border p-4 font-mono text-sm leading-relaxed outline-none"
              aria-label="JSON Output"
            />
          </div>
        </div>
      </div>

      {/* Settings Panel & Error Messages */}
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
