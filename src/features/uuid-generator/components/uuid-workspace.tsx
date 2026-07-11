"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export function UuidWorkspace() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuid = useCallback(() => {
    // Cryptographically secure UUID v4 helper
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);

    // Set version to 4
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    // Set variant to RFC 4122
    buffer[8] = (buffer[8] & 0x3f) | 0x80;

    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      const byte = buffer[i];
      if (byte !== undefined) {
        hex.push(byte.toString(16).padStart(2, "0"));
      }
    }

    const uuid = [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10, 16).join(""),
    ].join("-");

    return uuid;
  }, []);

  const handleGenerate = useCallback(() => {
    const list = Array.from({ length: count }, () => {
      let val = generateUuid();
      if (noHyphens) val = val.replace(/-/g, "");
      if (uppercase) val = val.toUpperCase();
      return val;
    });
    setUuids(list);
  }, [count, uppercase, noHyphens, generateUuid]);

  useEffect(() => {
    handleGenerate();
  }, [count, uppercase, noHyphens, handleGenerate]);

  const handleCopyAll = async () => {
    const text = uuids.join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopySingle = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-2xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Settings options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="border-border/60 bg-muted/10 hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
            />
            <span className="text-foreground text-sm font-medium">
              Uppercase (A-Z)
            </span>
          </label>
          <label className="border-border/60 bg-muted/10 hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
              className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
            />
            <span className="text-foreground text-sm font-medium">
              Remove Hyphens
            </span>
          </label>
        </div>

        {/* Count selection */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-foreground">Number of UUIDs to Generate</span>
            <span className="text-primary font-mono">{count}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
            aria-label="Number of UUIDs"
          />
        </div>

        {/* Controls */}
        <div className="border-border/60 flex items-center justify-between gap-4 border-t pt-4">
          <button
            type="button"
            onClick={handleGenerate}
            className="border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copy All
          </button>
        </div>

        {/* UUID List Output */}
        <div className="flex flex-col gap-3">
          <span className="text-foreground text-sm font-semibold">
            Generated UUIDs
          </span>
          <div className="border-border bg-muted/20 max-h-80 overflow-y-auto rounded-lg border p-3.5 font-mono text-sm leading-relaxed">
            {uuids.map((uuid, idx) => (
              <div
                key={idx}
                className="border-border/20 flex items-center justify-between border-b py-1.5 last:border-0"
              >
                <span className="pr-4 break-all select-all">{uuid}</span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(uuid, idx)}
                  className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                  aria-label={`Copy UUID ${idx + 1}`}
                >
                  {copiedIndex === idx ? (
                    <Check className="text-accent-surface h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
