"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, Image as ImageIcon, Trash2 } from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad)" />
  <circle cx="100" cy="100" r="50" fill="#ffffff" fill-opacity="0.9" />
  <path d="M85 80 L130 100 L85 120 Z" fill="#8B5CF6" />
</svg>`;

export function SvgWorkspace() {
  const [svgInput, setSvgInput] = useState(SAMPLE_SVG);
  const [scale, setScale] = useState<number>(2);
  const [format, setFormat] = useState<"png" | "webp">("png");
  const [bgColor, setBgColor] = useState<"transparent" | "white" | "black">(
    "transparent",
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 200, height: 200 });

  const renderRaster = useCallback(() => {
    if (!svgInput.trim()) {
      setPreviewUrl(null);
      return;
    }

    try {
      const blob = new Blob([svgInput], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const baseWidth = img.naturalWidth || 400;
        const baseHeight = img.naturalHeight || 400;
        const exportWidth = Math.round(baseWidth * scale);
        const exportHeight = Math.round(baseHeight * scale);

        setDimensions({ width: exportWidth, height: exportHeight });

        const canvas = document.createElement("canvas");
        canvas.width = exportWidth;
        canvas.height = exportHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          if (bgColor === "white") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, exportWidth, exportHeight);
          } else if (bgColor === "black") {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, exportWidth, exportHeight);
          }

          ctx.drawImage(img, 0, 0, exportWidth, exportHeight);
          const mime = format === "png" ? "image/png" : "image/webp";
          const dataUrl = canvas.toDataURL(mime, 0.95);
          setPreviewUrl(dataUrl);
        }

        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (err) {
      console.error("SVG render error", err);
    }
  }, [svgInput, scale, format, bgColor]);

  useEffect(() => {
    renderRaster();
  }, [renderRaster]);

  const handleFilesAccepted = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setSvgInput(text);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `zoriq-export-${scale}x.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Input & Settings Column */}
        <div className="flex flex-col gap-5 md:col-span-6">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              SVG Source
            </span>
            <button
              type="button"
              onClick={() => setSvgInput("")}
              className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-xs font-semibold"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <FileDropzone
              accept={["image/svg+xml"]}
              maxSize={5 * 1024 * 1024}
              multiple={false}
              onFilesAccepted={handleFilesAccepted}
              label="Drop .svg file or paste code below"
              helperText="SVG files up to 5MB"
            />

            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              rows={6}
              className="border-border/80 bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
              placeholder="Or paste <svg> XML markup directly..."
            />
          </div>

          {/* Scale Resolution Factor */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Output Scale Multiplier</span>
              <span className="text-primary font-mono">
                {scale}x ({dimensions.width} × {dimensions.height} px)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { factor: 1, label: "1x (Standard)" },
                { factor: 2, label: "2x (Retina)" },
                { factor: 3, label: "3x (Hi-DPI)" },
                { factor: 4, label: "4x (Ultra HD)" },
              ].map((s) => (
                <button
                  key={s.factor}
                  type="button"
                  onClick={() => setScale(s.factor)}
                  className={`rounded-lg border py-2 text-center text-xs font-semibold transition-all ${
                    scale === s.factor
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.factor}x
                </button>
              ))}
            </div>
          </div>

          {/* Format & Background Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                Output Format
              </label>
              <div className="border-border/60 bg-muted/20 flex rounded-lg border p-1">
                {(["png", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-bold uppercase transition-all ${
                      format === fmt
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                Background Fill
              </label>
              <select
                value={bgColor}
                onChange={(e) =>
                  setBgColor(
                    e.target.value as "transparent" | "white" | "black",
                  )
                }
                className="border-border bg-background h-9 rounded-lg border px-2.5 text-xs font-semibold outline-none"
              >
                <option value="transparent">Transparent</option>
                <option value="white">Solid White</option>
                <option value="black">Solid Black</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Preview & Download Column */}
        <div className="md:border-border/40 flex flex-col gap-4 md:col-span-6 md:border-l md:pl-8">
          <span className="text-foreground text-xs font-bold tracking-wider uppercase">
            Raster Preview ({format.toUpperCase()})
          </span>

          <div className="border-border bg-muted/15 relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border p-6 shadow-inner">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Rendered output"
                className="max-h-64 rounded-lg object-contain shadow-sm"
                style={{
                  backgroundImage:
                    bgColor === "transparent"
                      ? "radial-gradient(#888 1px, transparent 1px)"
                      : undefined,
                  backgroundSize: "16px 16px",
                }}
              />
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2">
                <ImageIcon className="h-10 w-10 opacity-40" />
                <p className="text-xs">Provide SVG input to generate preview</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!previewUrl}
            className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download {format.toUpperCase()} ({dimensions.width} ×{" "}
            {dimensions.height})
          </button>
        </div>
      </div>
    </div>
  );
}
