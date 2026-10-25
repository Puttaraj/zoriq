"use client";

import { useState, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
  Image as ImageIcon,
  Sliders,
  RefreshCw,
  Download,
  Trash2,
} from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { cn, formatBytes, percentReduction } from "@/lib/utils";

interface CompressorWorkspaceProps {
  defaultTargetKB?: number;
}

export function CompressorWorkspace({
  defaultTargetKB,
}: CompressorWorkspaceProps = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [quality, setQuality] = useState(80); // 80% default
  const [targetKB, setTargetKB] = useState<number | null>(
    defaultTargetKB ?? null,
  ); // null = manual quality slider
  const [processing, setProcessing] = useState(false);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [compressedPreview, setCompressedPreview] = useState<string>("");

  const handleFilesAccepted = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalPreview(URL.createObjectURL(file));
      setCompressedBlob(null);
      setCompressedSize(null);
      setCompressedPreview("");
    }
  }, []);

  // Trigger compression when selected file, quality, or targetKB changes
  useEffect(() => {
    if (!selectedFile) return;

    let active = true;
    setProcessing(true);

    const runCompression = async () => {
      try {
        const options = {
          maxSizeMB: targetKB ? targetKB / 1024 : 5,
          maxWidthOrHeight: targetKB && targetKB <= 50 ? 1280 : 2048,
          useWebWorker: true,
          initialQuality: targetKB ? 0.9 : quality / 100,
        };

        const compressedFile = await imageCompression(selectedFile, options);
        if (!active) return;

        setCompressedBlob(compressedFile);
        setCompressedSize(compressedFile.size);

        setCompressedPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(compressedFile);
        });
      } catch (error) {
        console.error("Compression error:", error);
      } finally {
        if (active) {
          setProcessing(false);
        }
      }
    };

    runCompression();

    return () => {
      active = false;
    };
  }, [selectedFile, quality, targetKB]);

  const handleReset = () => {
    setSelectedFile(null);
    setCompressedBlob(null);
    setCompressedSize(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    setOriginalPreview("");
    setCompressedPreview("");
  };

  const handleDownload = () => {
    if (!compressedBlob || !selectedFile) return;

    // Generate output file name (e.g. photo-compressed.jpg)
    const ext = selectedFile.name.split(".").pop();
    const nameWithoutExt = selectedFile.name.substring(
      0,
      selectedFile.name.lastIndexOf("."),
    );
    const outputName = `${nameWithoutExt}-compressed.${ext}`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(compressedBlob);
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      {!selectedFile ? (
        <FileDropzone
          accept={["image/jpeg", "image/png", "image/webp"]}
          maxSize={10 * 1024 * 1024} // 10 MB
          multiple={false}
          onFilesAccepted={handleFilesAccepted}
          label="Drag & drop your image here"
          helperText="Supports JPEG, PNG, and WebP. Max 10MB."
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Controls & Metrics Column */}
          <div className="flex flex-col gap-6 md:col-span-5">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                Image Settings
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>

            {/* Compression Mode / Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-foreground flex items-center justify-between text-xs font-semibold">
                <span>Target File Size</span>
                {targetKB ? (
                  <span className="text-primary font-mono text-[11px]">
                    Goal: &le; {targetKB} KB
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[11px]">
                    Manual Mode
                  </span>
                )}
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "Slider", kb: null },
                  { label: "20 KB", kb: 20 },
                  { label: "50 KB", kb: 50 },
                  { label: "100 KB", kb: 100 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setTargetKB(preset.kb)}
                    className={cn(
                      "focus-ring rounded-lg border px-2 py-1.5 text-center text-xs font-semibold transition-all",
                      targetKB === preset.kb
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (visible in manual mode) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-foreground flex items-center gap-1.5">
                  <Sliders className="text-primary h-4 w-4" />
                  Compression Quality
                </span>
                <span className="text-primary font-mono">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => {
                  setTargetKB(null);
                  setQuality(Number(e.target.value));
                }}
                className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
                aria-label="Compression quality"
                disabled={processing}
              />
              {targetKB && (
                <p className="text-muted-foreground text-[11px]">
                  * Auto-adjusting resolution &amp; compression to stay under{" "}
                  <strong>{targetKB} KB</strong> for portal forms.
                </p>
              )}
            </div>

            {/* Performance/Comparison Metrics */}
            <div className="border-border/60 flex flex-col gap-3 border-t pt-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                File Size Comparison
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-border/60 bg-muted/10 rounded-xl border p-3.5">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase">
                    Original
                  </span>
                  <p className="text-foreground mt-1 text-sm font-bold">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
                <div className="border-border/60 bg-muted/10 rounded-xl border p-3.5">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase">
                    Compressed
                  </span>
                  <p className="text-foreground mt-1 text-sm font-bold">
                    {processing
                      ? "Compressing..."
                      : compressedSize
                        ? formatBytes(compressedSize)
                        : "-"}
                  </p>
                </div>
              </div>

              {/* Savings Badge */}
              {!processing && compressedSize && (
                <div className="bg-accent-surface/10 border-accent-surface/20 text-accent-surface rounded-xl border p-4 text-center">
                  <p className="text-xs font-semibold tracking-wider uppercase">
                    Total Savings
                  </p>
                  <h4 className="mt-1 text-2xl font-black">
                    {percentReduction(selectedFile.size, compressedSize)}% Saved
                  </h4>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <button
                type="button"
                onClick={handleDownload}
                disabled={processing || !compressedBlob}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Compressed Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual Preview comparison Column */}
          <div className="md:border-border/60 flex flex-col gap-6 md:col-span-7 md:border-l md:pl-8">
            <span className="text-foreground text-sm font-semibold">
              Image Preview
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Original preview */}
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs font-semibold">
                  Original Image
                </span>
                <div className="border-border bg-muted/10 flex h-48 items-center justify-center overflow-hidden rounded-xl border p-2">
                  {originalPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={originalPreview}
                      alt="Original Image Preview"
                      className="h-full w-full rounded object-contain"
                    />
                  ) : (
                    <ImageIcon className="text-muted-foreground/30 h-10 w-10 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Compressed preview */}
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs font-semibold">
                  Compressed Image
                </span>
                <div className="border-border bg-muted/10 relative flex h-48 items-center justify-center overflow-hidden rounded-xl border p-2">
                  {processing ? (
                    <div className="bg-card/60 absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="text-primary h-8 w-8 animate-spin" />
                    </div>
                  ) : compressedPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={compressedPreview}
                      alt="Compressed Image Preview"
                      className="h-full w-full rounded object-contain"
                    />
                  ) : (
                    <ImageIcon className="text-muted-foreground/30 h-10 w-10 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
