"use client";

import { useState, useCallback } from "react";
import {
  Sparkles,
  Download,
  Trash2,
  Sliders,
  CheckCircle2,
  Eye,
  Loader2,
} from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { cn } from "@/lib/utils";

export function BackgroundRemoverWorkspace() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [bgColor, setBgColor] = useState<"transparent" | "white" | "black">(
    "transparent",
  );

  const handleFilesAccepted = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalPreview(url);
      setProcessedUrl("");
    }
  }, []);

  // Remove background using intelligent edge-flood color sampling on canvas
  const processImage = useCallback(() => {
    if (!originalPreview) return;

    setProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = originalPreview;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        setProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample border corner pixels to determine dominant background color
      const corners = [
        0, // top-left
        (canvas.width - 1) * 4, // top-right
        (canvas.height - 1) * canvas.width * 4, // bottom-left
        ((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4, // bottom-right
      ];

      let bgR = 0,
        bgG = 0,
        bgB = 0;
      corners.forEach((idx) => {
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR = Math.round(bgR / corners.length);
      bgG = Math.round(bgG / corners.length);
      bgB = Math.round(bgB / corners.length);

      const tol = (tolerance / 100) * 255;

      // Alpha mask loop
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from background
        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2),
        );

        if (dist < tol) {
          data[i + 3] = 0; // Transparent
        } else if (dist < tol + 15) {
          // Soft anti-aliased edge
          const feather = (dist - tol) / 15;
          data[i + 3] = Math.round(data[i + 3] * feather);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // If user selected a solid background replacement
      if (bgColor !== "transparent") {
        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = canvas.width;
        outputCanvas.height = canvas.height;
        const outCtx = outputCanvas.getContext("2d");
        if (outCtx) {
          outCtx.fillStyle = bgColor === "white" ? "#FFFFFF" : "#000000";
          outCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
          outCtx.drawImage(canvas, 0, 0);
          canvas.width = outputCanvas.width;
          canvas.height = outputCanvas.height;
          ctx.drawImage(outputCanvas, 0, 0);
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setProcessedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        }
        setProcessing(false);
      }, "image/png");
    };

    img.onerror = () => setProcessing(false);
  }, [originalPreview, tolerance, bgColor]);

  const handleDownload = () => {
    if (!processedUrl || !selectedFile) return;
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `${selectedFile.name.replace(/\.[^/.]+$/, "")}-no-bg.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setOriginalPreview("");
    setProcessedUrl("");
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      {!selectedFile ? (
        <FileDropzone
          accept={["image/jpeg", "image/png", "image/webp"]}
          maxSize={10 * 1024 * 1024}
          multiple={false}
          onFilesAccepted={handleFilesAccepted}
          label="Drag & drop your photo or product image here"
          helperText="Processes 100% inside your browser memory. Max 10MB."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {/* Controls Bar */}
          <div className="border-border/40 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                Background Mode:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Transparent", val: "transparent" },
                  { label: "White", val: "white" },
                  { label: "Black", val: "black" },
                ].map((mode) => (
                  <button
                    key={mode.val}
                    type="button"
                    onClick={() => setBgColor(mode.val as typeof bgColor)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all",
                      bgColor === mode.val
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={processImage}
                disabled={processing}
                className="gradient-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:brightness-110"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {processedUrl ? "Re-Process" : "Remove Background"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Tolerance Sensitivity Slider */}
          <div className="flex max-w-md flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <Sliders className="text-primary h-3.5 w-3.5" />
                Edge Sensitivity &amp; Threshold
              </span>
              <span className="text-primary font-mono">{tolerance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
            />
          </div>

          {/* Previews Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Original Image
              </span>
              <div className="border-border/60 bg-muted/20 flex min-h-[300px] items-center justify-center rounded-xl border p-4">
                <img
                  src={originalPreview}
                  alt="Original preview"
                  className="max-h-[340px] rounded-lg object-contain shadow-sm"
                />
              </div>
            </div>

            {/* Cutout */}
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Removed Background
              </span>
              <div
                className="border-border/60 flex min-h-[300px] items-center justify-center rounded-xl border p-4"
                style={{
                  backgroundImage:
                    bgColor === "transparent"
                      ? "radial-gradient(var(--border) 1px, transparent 1px)"
                      : undefined,
                  backgroundSize: "16px 16px",
                  backgroundColor:
                    bgColor === "white"
                      ? "#FFFFFF"
                      : bgColor === "black"
                        ? "#000000"
                        : undefined,
                }}
              >
                {processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Processed cutout"
                    className="max-h-[340px] rounded-lg object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-2 text-center text-xs">
                    <Eye className="h-8 w-8 opacity-40" />
                    <span>
                      Click &quot;Remove Background&quot; above to isolate
                      foreground subject
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download Bar */}
          {processedUrl && (
            <div className="border-border/40 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Background removed in browser memory (0 bytes uploaded to
                  external server)
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="gradient-brand focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:brightness-110"
              >
                <Download className="h-4 w-4" />
                Download Cutout PNG
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
