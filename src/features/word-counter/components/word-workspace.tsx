"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  Copy,
  Check,
  FileText,
  Hash,
  AlignLeft,
  Clock,
  Mic,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export function WordWorkspace() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();

    // Character counts
    const charWithSpaces = text.length;
    const charNoSpaces = text.replace(/\s/g, "").length;

    // Word count
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    // Sentences
    const sentences =
      trimmed === ""
        ? 0
        : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // Paragraphs
    const paragraphs =
      trimmed === ""
        ? 0
        : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    // Estimates (Words per minute: Reading = 225, Speaking = 150)
    const readingTime = Math.ceil(words / 225);
    const speakingTime = Math.ceil(words / 150);

    return {
      words,
      charWithSpaces,
      charNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  }, [text]);

  const keywordDensity = useMemo(() => {
    if (!text.trim()) return [];

    // Clean up text: lowercase, remove punctuation
    const words = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2); // Filter short words (prepositions/pronouns)

    const counts: Record<string, number> = {};
    words.forEach((w) => {
      counts[w] = (counts[w] ?? 0) + 1;
    });

    const totalWords = words.length || 1;

    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        density: Math.round((count / totalWords) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [text]);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const statCards = [
    { label: "Words", value: stats.words, icon: FileText },
    {
      label: "Characters (with spaces)",
      value: stats.charWithSpaces,
      icon: Hash,
    },
    {
      label: "Characters (no spaces)",
      value: stats.charNoSpaces,
      icon: AlignLeft,
    },
    { label: "Sentences", value: stats.sentences, icon: AlignLeft },
    { label: "Paragraphs", value: stats.paragraphs, icon: AlignLeft },
  ];

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Editor Area */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-semibold">
              Type or Paste Text
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClear}
                disabled={!text}
                className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear text"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Copy text"
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

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing, or copy and paste your document here..."
            rows={15}
            className="border-border bg-muted/10 focus:border-primary w-full resize-y rounded-xl border p-4 text-sm leading-relaxed outline-none"
            aria-label="Word counter text input"
          />

          {/* Reading / Speaking Estimates */}
          <div className="border-border/40 bg-muted/20 grid grid-cols-2 gap-4 rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Reading Time
                </p>
                <p className="text-foreground text-sm font-semibold">
                  ~ {stats.readingTime}{" "}
                  {stats.readingTime === 1 ? "minute" : "minutes"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Speaking Time
                </p>
                <p className="text-foreground text-sm font-semibold">
                  ~ {stats.speakingTime}{" "}
                  {stats.speakingTime === 1 ? "minute" : "minutes"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Info & Keyword Density */}
        <div className="lg:border-border/60 flex flex-col gap-6 lg:col-span-4 lg:border-l lg:pl-6">
          <span className="text-foreground text-sm font-semibold">
            Live Statistics
          </span>

          {/* Count metrics list */}
          <div className="flex flex-col gap-3">
            {statCards.map((c) => {
              const StatIcon = c.icon;
              return (
                <div
                  key={c.label}
                  className="border-border/60 bg-muted/10 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <StatIcon className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-xs font-medium">
                      {c.label}
                    </span>
                  </div>
                  <span className="text-foreground font-mono text-sm font-bold">
                    {c.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Keyword Density */}
          <div className="border-border/60 flex flex-col gap-3 border-t pt-4">
            <span className="text-foreground text-sm font-semibold">
              Keyword Density
            </span>
            {keywordDensity.length > 0 ? (
              <div className="flex flex-col gap-2">
                {keywordDensity.map((item) => (
                  <div key={item.word} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-foreground font-mono">
                        {item.word}
                      </span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.density}%)
                      </span>
                    </div>
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${item.density}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs italic">
                Enter text longer than 2 characters to analyze density
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
