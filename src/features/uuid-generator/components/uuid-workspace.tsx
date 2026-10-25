"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  FileText,
  Code2,
  Database,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type UuidVersion = "v4" | "v7";
type ExportFormat = "text" | "json" | "sql";

export function UuidWorkspace() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("text");
  const [tableName, setTableName] = useState("records");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuidV4 = useCallback(() => {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);

    buffer[6] = (buffer[6] & 0x0f) | 0x40; // v4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // RFC 4122 variant

    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      hex.push(buffer[i].toString(16).padStart(2, "0"));
    }

    return [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10, 16).join(""),
    ].join("-");
  }, []);

  const generateUuidV7 = useCallback(() => {
    // RFC 9562 standard UUID v7 (Unix Epoch millisecond timestamp + 74 bits entropy)
    const now = Date.now();
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);

    // 48-bit timestamp in milliseconds
    buffer[0] = Math.floor(now / 2 ** 40) & 0xff;
    buffer[1] = Math.floor(now / 2 ** 32) & 0xff;
    buffer[2] = Math.floor(now / 2 ** 24) & 0xff;
    buffer[3] = Math.floor(now / 2 ** 16) & 0xff;
    buffer[4] = Math.floor(now / 2 ** 8) & 0xff;
    buffer[5] = now & 0xff;

    // Version 7
    buffer[6] = (buffer[6] & 0x0f) | 0x70;
    // RFC 4122 / 9562 variant
    buffer[8] = (buffer[8] & 0x3f) | 0x80;

    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      hex.push(buffer[i].toString(16).padStart(2, "0"));
    }

    return [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10, 16).join(""),
    ].join("-");
  }, []);

  const handleGenerate = useCallback(() => {
    const generator = version === "v7" ? generateUuidV7 : generateUuidV4;
    const list = Array.from({ length: count }, () => {
      let val = generator();
      if (noHyphens) val = val.replace(/-/g, "");
      if (uppercase) val = val.toUpperCase();
      return val;
    });
    setUuids(list);
  }, [count, version, uppercase, noHyphens, generateUuidV4, generateUuidV7]);

  useEffect(() => {
    handleGenerate();
  }, [count, version, uppercase, noHyphens, handleGenerate]);

  const formattedExport = useMemo(() => {
    if (exportFormat === "json") {
      return JSON.stringify(uuids, null, 2);
    }
    if (exportFormat === "sql") {
      const values = uuids.map((id) => `('${id}')`).join(",\n  ");
      return `INSERT INTO ${tableName || "records"} (id) VALUES\n  ${values};`;
    }
    return uuids.join("\n");
  }, [uuids, exportFormat, tableName]);

  const handleCopyAll = async () => {
    const success = await copyToClipboard(formattedExport);
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

  const handleDownload = () => {
    const ext =
      exportFormat === "json" ? "json" : exportFormat === "sql" ? "sql" : "txt";
    const mime =
      exportFormat === "json"
        ? "application/json"
        : exportFormat === "sql"
          ? "application/sql"
          : "text/plain";
    const blob = new Blob([formattedExport], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zoriq-uuids-${version}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-3xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Version Switcher Tabs */}
        <div className="flex flex-col gap-2">
          <label className="text-foreground text-xs font-bold tracking-wider uppercase">
            UUID Standard
          </label>
          <div className="bg-muted/20 border-border/40 grid grid-cols-2 gap-2 rounded-xl border p-1.5">
            <button
              type="button"
              onClick={() => setVersion("v4")}
              className={`rounded-lg px-3 py-2.5 text-left transition-all ${
                version === "v4"
                  ? "bg-card text-foreground border-border/50 border shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">UUID v4 (Random)</span>
                <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-[10px] font-semibold">
                  Classic
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                RFC 4122 cryptographic random distribution.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setVersion("v7")}
              className={`rounded-lg px-3 py-2.5 text-left transition-all ${
                version === "v7"
                  ? "bg-card text-foreground border-border/50 border shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">
                  UUID v7 (Time-Sortable)
                </span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Modern Standard
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                RFC 9562 timestamp-ordered index for SQL / B-Trees.
              </p>
            </button>
          </div>
        </div>

        {/* Options */}
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
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
            aria-label="Number of UUIDs"
          />
        </div>

        {/* Export Format Selector */}
        <div className="border-border/40 flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Bulk Export Format
            </span>
            {exportFormat === "sql" && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Table:</span>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="border-border/80 bg-background h-6 w-28 rounded border px-1.5 font-mono text-xs outline-none"
                  placeholder="records"
                />
              </div>
            )}
          </div>
          <div className="bg-muted/20 border-border/30 flex items-center rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setExportFormat("text")}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                exportFormat === "text"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Plain Text
            </button>
            <button
              type="button"
              onClick={() => setExportFormat("json")}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                exportFormat === "json"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              JSON Array
            </button>
            <button
              type="button"
              onClick={() => setExportFormat("sql")}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                exportFormat === "sql"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              SQL INSERT
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <button
            type="button"
            onClick={handleGenerate}
            className="border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate ({version.toUpperCase()})
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all"
              title="Download formatted UUID file"
            >
              <Download className="h-3.5 w-3.5" />
              Download .
              {exportFormat === "json"
                ? "json"
                : exportFormat === "sql"
                  ? "sql"
                  : "txt"}
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
              {copied ? "Copied All" : "Copy Export"}
            </button>
          </div>
        </div>

        {/* Formatted Output Box */}
        {exportFormat !== "text" ? (
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              {exportFormat === "json"
                ? "JSON Array Payload"
                : "SQL Statements"}
            </span>
            <pre className="border-border bg-muted/20 text-foreground max-h-72 overflow-y-auto rounded-lg border p-3.5 font-mono text-xs leading-relaxed">
              {formattedExport}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="text-foreground text-sm font-semibold">
              Generated UUIDs ({uuids.length})
            </span>
            <div className="border-border bg-muted/20 max-h-80 overflow-y-auto rounded-lg border p-3.5 font-mono text-sm leading-relaxed">
              <div className="flex flex-col gap-2">
                {uuids.map((id, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/40 group flex items-center justify-between rounded p-1 transition-colors"
                  >
                    <span className="text-foreground text-xs select-all sm:text-sm">
                      {id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(id, index)}
                      className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Copy UUID"
                    >
                      {copiedIndex === index ? (
                        <Check className="text-primary h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
