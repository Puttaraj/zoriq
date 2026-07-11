"use client";

import { useState, useCallback, useEffect } from "react";
import { Image as ImageIcon, Download, Trash2, RefreshCw } from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { formatBytes, getFileExtension } from "@/lib/utils";

type OutputFormat = "jpeg" | "png" | "webp" | "bmp";

export function ConverterWorkspace() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(90); // 90% default for lossy formats
  const [converting, setConverting] = useState(false);
  const [originalPreview, setOriginalPreview] = useState("");
  const [convertedPreview, setConvertedPreview] = useState("");

  const handleFilesAccepted = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalPreview(URL.createObjectURL(file));
      setConvertedBlob(null);
      setConvertedPreview("");
    }
  }, []);

  // Trigger conversion when settings or original file changes
  useEffect(() => {
    if (!selectedFile) return;

    setConverting(true);
    const img = new window.Image();
    img.src = originalPreview;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setConverting(false);
        return;
      }

      // If output is JPEG, draw white background to prevent transparency rendering as black
      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeMap: Record<OutputFormat, string> = {
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        bmp: "image/bmp",
      };

      const mimeType = mimeMap[outputFormat];
      const q =
        outputFormat === "jpeg" || outputFormat === "webp"
          ? quality / 100
          : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedBlob(blob);
            setConvertedPreview((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return URL.createObjectURL(blob);
            });
          }
          setConverting(false);
        },
        mimeType,
        q,
      );
    };

    img.onerror = () => {
      console.error("Failed to load image for conversion.");
      setConverting(false);
    };
  }, [selectedFile, originalPreview, outputFormat, quality]);

  const handleReset = () => {
    setSelectedFile(null);
    setConvertedBlob(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (convertedPreview) URL.revokeObjectURL(convertedPreview);
    setOriginalPreview("");
    setConvertedPreview("");
  };

  const handleDownload = () => {
    if (!convertedBlob || !selectedFile) return;

    const nameWithoutExt = selectedFile.name.substring(
      0,
      selectedFile.name.lastIndexOf("."),
    );
    const outputName = `${nameWithoutExt}.${outputFormat}`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(convertedBlob);
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
          accept={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
          maxSize={10 * 1024 * 1024} // 10 MB
          multiple={false}
          onFilesAccepted={handleFilesAccepted}
          label="Drag & drop your image to convert"
          helperText="Supports JPEG, PNG, WebP, and BMP. Max 10MB."
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Controls Column */}
          <div className="flex flex-col gap-6 md:col-span-5">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                Conversion Settings
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

            {/* Target format selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-semibold">
                Convert To
              </label>
              <select
                value={outputFormat}
                onChange={(e) =>
                  setOutputFormat(e.target.value as OutputFormat)
                }
                className="border-border bg-background focus:border-primary h-10 w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none"
                aria-label="Target format"
                disabled={converting}
              >
                {(() => {
                  const originalExt = getFileExtension(
                    selectedFile.name,
                  ).toLowerCase();
                  return (
                    <>
                      <option value="png">
                        PNG (.png){originalExt === "png" ? " (Original)" : ""}
                      </option>
                      <option value="jpeg">
                        JPEG (.jpg)
                        {originalExt === "jpg" || originalExt === "jpeg"
                          ? " (Original)"
                          : ""}
                      </option>
                      <option value="webp">
                        WebP (.webp)
                        {originalExt === "webp" ? " (Original)" : ""}
                      </option>
                      <option value="bmp">
                        BMP (.bmp){originalExt === "bmp" ? " (Original)" : ""}
                      </option>
                    </>
                  );
                })()}
              </select>
            </div>

            {/* Quality Slider (visible only for jpeg/webp) */}
            {(outputFormat === "jpeg" || outputFormat === "webp") && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground">Output Quality</span>
                  <span className="text-primary font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
                  aria-label="Output quality"
                  disabled={converting}
                />
              </div>
            )}

            {/* Summary Details */}
            <div className="border-border/60 flex flex-col gap-3 border-t pt-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                File Details
              </span>
              <div className="border-border/60 bg-muted/10 flex flex-col gap-2 rounded-xl border p-3.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Original Name</span>
                  <span className="text-foreground max-w-[150px] text-right break-all">
                    {selectedFile.name}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Original Format</span>
                  <span className="text-foreground uppercase">
                    {getFileExtension(selectedFile.name)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Original Size</span>
                  <span className="text-foreground">
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>
                {convertedBlob && !converting && (
                  <div className="border-border/20 flex justify-between border-t pt-2 text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Converted Size
                    </span>
                    <span className="text-primary">
                      {formatBytes(convertedBlob.size)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Download */}
            <div className="mt-auto">
              <button
                type="button"
                onClick={handleDownload}
                disabled={converting || !convertedBlob}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {converting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Converted Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Comparison Column */}
          <div className="md:border-border/60 flex flex-col gap-6 md:col-span-7 md:border-l md:pl-8">
            <span className="text-foreground text-sm font-semibold">
              Converted Preview
            </span>
            <div className="border-border bg-muted/10 relative flex h-64 flex-col items-center justify-center rounded-xl border p-4 shadow-inner">
              {converting ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="text-primary h-8 w-8 animate-spin" />
                  <span className="text-muted-foreground text-xs">
                    Converting image...
                  </span>
                </div>
              ) : convertedPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={convertedPreview}
                  alt="Converted Image Preview"
                  className="h-full w-full rounded object-contain"
                />
              ) : (
                <div className="text-muted-foreground/30 flex flex-col items-center gap-2">
                  <ImageIcon className="h-12 w-12" />
                  <span className="text-xs">No converted preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
