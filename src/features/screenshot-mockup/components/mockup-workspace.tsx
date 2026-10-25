"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, RotateCcw } from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";

const GRADIENTS = [
  {
    id: "purple",
    name: "Nebula Violet",
    css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    start: "#667eea",
    end: "#764ba2",
  },
  {
    id: "sunset",
    name: "Sunset Horizon",
    css: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
    start: "#ff7e5f",
    end: "#feb47b",
  },
  {
    id: "ocean",
    name: "Cyber Teal",
    css: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
    start: "#0ba360",
    end: "#3cba92",
  },
  {
    id: "dark",
    name: "Midnight Charcoal",
    css: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    start: "#1f2937",
    end: "#111827",
  },
  {
    id: "transparent",
    name: "Transparent",
    css: "transparent",
    start: "transparent",
    end: "transparent",
  },
];

export function MockupWorkspace() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [frameStyle, setFrameStyle] = useState<"mac" | "glass" | "simple">(
    "mac",
  );
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0].id);
  const [padding, setPadding] = useState<number>(40);
  const [borderRadius, setBorderRadius] = useState<number>(12);
  const [shadow, setShadow] = useState<boolean>(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFilesAccepted = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const url = URL.createObjectURL(f);
    setImageSrc(url);
  }, []);

  const renderMockup = useCallback(() => {
    if (!imageSrc) {
      setDownloadUrl(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const scale = 2; // High-DPI export
      const headerHeight = frameStyle === "mac" ? 36 : 0;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const innerWidth = imgWidth;
      const innerHeight = imgHeight + headerHeight;

      const canvasWidth = (innerWidth + padding * 2) * scale;
      const canvasHeight = (innerHeight + padding * 2) * scale;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(scale, scale);

      // 1. Draw Background
      const gradConfig =
        GRADIENTS.find((g) => g.id === selectedGradient) || GRADIENTS[0];
      if (gradConfig.id !== "transparent") {
        const bgGradient = ctx.createLinearGradient(
          0,
          0,
          innerWidth + padding * 2,
          innerHeight + padding * 2,
        );
        bgGradient.addColorStop(0, gradConfig.start);
        bgGradient.addColorStop(1, gradConfig.end);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, innerWidth + padding * 2, innerHeight + padding * 2);
      }

      const x = padding;
      const y = padding;
      const w = innerWidth;
      const h = innerHeight;
      const r = borderRadius;

      // 2. Draw Shadow
      if (shadow) {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 15;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.restore();
      }

      // 3. Clip Window Container
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.clip();

      // 4. Draw Header (if macOS style)
      if (frameStyle === "mac") {
        ctx.fillStyle = "#2d3748";
        ctx.fillRect(x, y, w, headerHeight);

        // macOS Traffic Lights
        const lightY = y + headerHeight / 2;
        const lights = [
          { color: "#ff5f56", xOffset: 16 },
          { color: "#ffbd2e", xOffset: 34 },
          { color: "#27c93f", xOffset: 52 },
        ];
        lights.forEach((l) => {
          ctx.beginPath();
          ctx.arc(x + l.xOffset, lightY, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = l.color;
          ctx.fill();
        });
      }

      // 5. Draw Screenshot
      ctx.drawImage(img, x, y + headerHeight, imgWidth, imgHeight);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      setDownloadUrl(dataUrl);
    };

    img.src = imageSrc;
  }, [imageSrc, frameStyle, selectedGradient, padding, borderRadius, shadow]);

  useEffect(() => {
    renderMockup();
  }, [renderMockup]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "zoriq-mockup-export.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      {!imageSrc ? (
        <FileDropzone
          accept={["image/png", "image/jpeg", "image/webp"]}
          maxSize={15 * 1024 * 1024}
          multiple={false}
          onFilesAccepted={handleFilesAccepted}
          label="Drop your screenshot here (or paste with Ctrl+V / ⌘V)"
          helperText="Upload any app screenshot, web page capture, or mobile design"
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Controls Column */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <div className="border-border/40 flex items-center justify-between border-b pb-3">
              <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                Mockup Customizer
              </span>
              <button
                type="button"
                onClick={() => {
                  setImageSrc(null);
                }}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-semibold"
              >
                <RotateCcw className="h-3 w-3" />
                Change Image
              </button>
            </div>

            {/* Frame Style Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                Window Frame Style
              </label>
              <div className="bg-muted/20 border-border/40 grid grid-cols-3 gap-1 rounded-xl border p-1">
                {[
                  { id: "mac", label: "macOS" },
                  { id: "glass", label: "Glass" },
                  { id: "simple", label: "Clean" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() =>
                      setFrameStyle(st.id as "mac" | "glass" | "simple")
                    }
                    className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      frameStyle === st.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                Canvas Backdrop
              </label>
              <div className="grid grid-cols-5 gap-2">
                {GRADIENTS.map((grad) => (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => setSelectedGradient(grad.id)}
                    className={`h-10 rounded-xl border transition-all ${
                      selectedGradient === grad.id
                        ? "ring-primary scale-105 ring-2"
                        : "border-border/60 opacity-80 hover:opacity-100"
                    }`}
                    style={{ background: grad.css }}
                    title={grad.name}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="border-border/40 flex flex-col gap-4 border-t pt-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-foreground">Canvas Padding</span>
                  <span className="text-primary font-mono">{padding}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-foreground">Corner Radius</span>
                  <span className="text-primary font-mono">
                    {borderRadius}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={shadow}
                  onChange={(e) => setShadow(e.target.checked)}
                  className="text-primary focus:ring-primary h-4 w-4 rounded"
                />
                <span className="text-foreground text-xs font-semibold">
                  Enable Drop Shadow
                </span>
              </label>
            </div>
          </div>

          {/* Preview & Download Column */}
          <div className="md:border-border/40 flex flex-col gap-4 md:col-span-7 md:border-l md:pl-8">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Mockup Preview (Retina 2x Export)
            </span>

            <div className="border-border bg-muted/15 relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border p-4 shadow-inner">
              {downloadUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={downloadUrl}
                  alt="Rendered mockup"
                  className="max-h-[360px] max-w-full rounded-lg object-contain shadow-sm"
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!downloadUrl}
              className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase transition-all"
            >
              <Download className="h-4 w-4" />
              Download High-Res Mockup (.PNG)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
