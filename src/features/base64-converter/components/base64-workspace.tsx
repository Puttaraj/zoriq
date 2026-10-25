"use client";

import { useState, useCallback } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  Trash2,
  Image as ImageIcon,
  ArrowRightLeft,
} from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { copyToClipboard, formatBytes } from "@/lib/utils";

type Mode = "encode" | "decode";
type FormatType = "raw" | "dataUri" | "css" | "html";

export function Base64Workspace() {
  const [mode, setMode] = useState<Mode>("encode");

  // Encode state
  const [file, setFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState("");
  const [mimeType, setMimeType] = useState("image/png");
  const [copiedFormat, setCopiedFormat] = useState<FormatType | null>(null);

  // Decode state
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedPreview, setDecodedPreview] = useState<string | null>(null);
  const [decodedMime, setDecodedMime] = useState<string>("text/plain");

  const handleFilesAccepted = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setMimeType(selected.type || "application/octet-stream");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Result is data:mime;base64,DATA
      const commaIndex = result.indexOf(",");
      if (commaIndex !== -1) {
        setBase64String(result.substring(commaIndex + 1));
      } else {
        setBase64String(result);
      }
    };
    reader.readAsDataURL(selected);
  }, []);

  const handleCopy = async (format: FormatType) => {
    let text = base64String;
    const dataUri = `data:${mimeType};base64,${base64String}`;

    if (format === "dataUri") {
      text = dataUri;
    } else if (format === "css") {
      text = `background-image: url("${dataUri}");`;
    } else if (format === "html") {
      text = `<img src="${dataUri}" alt="${file?.name || "base64 image"}" />`;
    }

    const success = await copyToClipboard(text);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  const handleDecode = useCallback((raw: string) => {
    setDecodeInput(raw);
    const trimmed = raw.trim();
    if (!trimmed) {
      setDecodedPreview(null);
      return;
    }

    let cleanBase64 = trimmed;
    let detectedMime = "text/plain";

    if (trimmed.startsWith("data:")) {
      const match = trimmed.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        cleanBase64 = match[2];
      }
    }

    setDecodedMime(detectedMime);

    if (
      detectedMime.startsWith("image/") ||
      (!trimmed.startsWith("data:") && isLikelyImage(cleanBase64))
    ) {
      setDecodedPreview(
        trimmed.startsWith("data:")
          ? trimmed
          : `data:image/png;base64,${cleanBase64}`,
      );
    } else {
      try {
        const decodedText = atob(cleanBase64);
        setDecodedPreview(decodedText);
      } catch {
        setDecodedPreview(null);
      }
    }
  }, []);

  const isLikelyImage = (b64: string) => {
    return (
      b64.startsWith("/9j/") ||
      b64.startsWith("iVBORw") ||
      b64.startsWith("R0lGOD") ||
      b64.startsWith("UklGR")
    );
  };

  const handleDownloadDecoded = () => {
    if (!decodedPreview) return;
    const link = document.createElement("a");
    if (decodedPreview.startsWith("data:")) {
      link.href = decodedPreview;
      link.download = `zoriq-decoded.${decodedMime.split("/")[1] || "png"}`;
    } else {
      const blob = new Blob([decodedPreview], { type: decodedMime });
      link.href = URL.createObjectURL(blob);
      link.download = "zoriq-decoded.txt";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setBase64String("");
    setDecodeInput("");
    setDecodedPreview(null);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      {/* Mode Toggle Bar */}
      <div className="border-border/40 mb-6 flex items-center justify-between border-b pb-4">
        <div className="bg-muted/30 border-border/40 flex items-center rounded-xl border p-1">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === "encode"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            File / Image to Base64
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === "decode"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Base64 to File / Text
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {mode === "encode" ? (
        <div className="flex flex-col gap-6">
          {!file ? (
            <FileDropzone
              accept={[
                "image/png",
                "image/jpeg",
                "image/webp",
                "image/svg+xml",
                "image/gif",
                "application/pdf",
                "text/plain",
                "application/json",
              ]}
              maxSize={10 * 1024 * 1024}
              multiple={false}
              onFilesAccepted={handleFilesAccepted}
              label="Drop an image or file to encode to Base64"
              helperText="PNG, JPEG, WebP, SVG, PDF, JSON up to 10MB"
            />
          ) : (
            <div className="flex flex-col gap-5">
              {/* File Info Card */}
              <div className="border-border/40 bg-muted/20 flex items-center justify-between rounded-xl border p-4 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary h-6 w-6" />
                  <div>
                    <p className="text-foreground font-bold">{file.name}</p>
                    <p className="text-muted-foreground text-[11px] font-normal">
                      Original: {formatBytes(file.size)} · Base64: ~
                      {formatBytes(Math.round(base64String.length * 0.75))}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="border-border bg-card hover:bg-muted text-foreground rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                >
                  Change File
                </button>
              </div>

              {/* Output Formats Action Grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    { id: "raw", label: "Raw Base64" },
                    { id: "dataUri", label: "Data URI" },
                    { id: "css", label: "CSS Background" },
                    { id: "html", label: "HTML <img>" },
                  ] as const
                ).map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleCopy(fmt.id)}
                    className="border-border/60 bg-muted/15 hover:bg-primary/5 hover:border-primary/40 focus-ring flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all"
                  >
                    {copiedFormat === fmt.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="text-primary h-4 w-4" />
                    )}
                    <span>
                      {copiedFormat === fmt.id ? "Copied!" : fmt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Base64 Preview Output */}
              <div className="flex flex-col gap-2">
                <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Base64 Payload String
                </span>
                <textarea
                  readOnly
                  value={base64String}
                  rows={8}
                  className="border-border/80 bg-muted/10 w-full rounded-xl border p-3 font-mono text-xs leading-relaxed break-all outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Decode Mode */
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-foreground text-xs font-bold tracking-wider uppercase">
              Paste Base64 or Data URI String
            </label>
            <textarea
              value={decodeInput}
              onChange={(e) => handleDecode(e.target.value)}
              placeholder="Paste Base64 data here (e.g. data:image/png;base64,iVBORw... or raw Base64 string)"
              rows={6}
              className="border-border/80 bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed break-all outline-none"
            />
          </div>

          {decodedPreview && (
            <div className="border-border/50 bg-muted/10 flex flex-col gap-4 rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Decoded Preview
                </span>
                <button
                  type="button"
                  onClick={handleDownloadDecoded}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Asset
                </button>
              </div>

              {decodedPreview.startsWith("data:image/") ||
              decodedPreview.startsWith("data:image/svg+xml") ? (
                <div className="flex justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={decodedPreview}
                    alt="Decoded output"
                    className="border-border max-h-64 rounded-lg border bg-white object-contain shadow-sm dark:bg-zinc-950"
                  />
                </div>
              ) : (
                <pre className="border-border bg-card text-foreground max-h-64 overflow-auto rounded-lg border p-4 font-mono text-xs">
                  {decodedPreview}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
