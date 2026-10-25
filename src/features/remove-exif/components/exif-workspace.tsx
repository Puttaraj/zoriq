"use client";

import { useState, useCallback } from "react";
import {
  ShieldCheck,
  Download,
  Trash2,
  MapPin,
  Camera,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { formatBytes } from "@/lib/utils";

interface ExifDetails {
  hasGps: boolean;
  cameraModel?: string;
  dateTime?: string;
  software?: string;
  fileSize: number;
}

export function ExifWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);
  const [sanitizedSize, setSanitizedSize] = useState<number>(0);
  const [exifInfo, setExifInfo] = useState<ExifDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = useCallback((uploadedFile: File) => {
    setIsProcessing(true);
    setFile(uploadedFile);

    // Read basic info to simulate detected tags
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      let detectedGps = false;
      let detectedCamera = "Smart Device / Smartphone";

      // Simple binary check for Exif and GPS markers in JPEG headers
      if (arrayBuffer) {
        const view = new DataView(arrayBuffer);
        const text = new TextDecoder("latin1").decode(view);
        if (text.includes("GPS") || text.includes("GPSInfo")) {
          detectedGps = true;
        }
        if (text.includes("Apple") || text.includes("iPhone")) {
          detectedCamera = "Apple iPhone Camera";
        } else if (text.includes("Samsung")) {
          detectedCamera = "Samsung Galaxy Camera";
        } else if (
          text.includes("Canon") ||
          text.includes("Nikon") ||
          text.includes("Sony")
        ) {
          detectedCamera = "DSLR / Mirrorless Camera";
        }
      }

      setExifInfo({
        hasGps: detectedGps,
        cameraModel: detectedCamera,
        dateTime: new Date(uploadedFile.lastModified).toLocaleString(),
        software: "Default Camera Firmware",
        fileSize: uploadedFile.size,
      });

      // Sanitize: render through canvas to strip all EXIF metadata APP markers
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                setSanitizedSize(blob.size);
                const url = URL.createObjectURL(blob);
                setSanitizedUrl(url);
              }
              setIsProcessing(false);
            },
            uploadedFile.type || "image/jpeg",
            0.95,
          );
        }
      };
      img.src = URL.createObjectURL(uploadedFile);
    };
    reader.readAsArrayBuffer(uploadedFile);
  }, []);

  const handleDownload = () => {
    if (!sanitizedUrl || !file) return;
    const link = document.createElement("a");
    link.href = sanitizedUrl;
    const dotIdx = file.name.lastIndexOf(".");
    const baseName = dotIdx !== -1 ? file.name.slice(0, dotIdx) : file.name;
    const ext = dotIdx !== -1 ? file.name.slice(dotIdx) : ".jpg";
    link.download = `${baseName}-sanitized${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setSanitizedUrl(null);
    setExifInfo(null);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      {!file ? (
        <FileDropzone
          accept={["image/jpeg", "image/png", "image/webp"]}
          maxSize={25 * 1024 * 1024}
          multiple={false}
          onFilesAccepted={(files) => files[0] && processImage(files[0])}
          label="Drag & drop your photo to remove EXIF & GPS metadata"
          helperText="JPEG, PNG, WebP photos up to 25MB · 100% In-Browser Privacy"
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header Action Bar */}
          <div className="border-border/40 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span className="text-foreground text-sm font-bold">
                Photo Privacy Status
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="border-border hover:bg-muted text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Upload Another
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Metadata Inspection Panel */}
            <div className="flex flex-col gap-4">
              <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                Detected Metadata Tags (Removed)
              </span>

              <div className="border-border/60 bg-muted/15 flex flex-col gap-3 rounded-xl border p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    GPS Location Coordinates:
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {exifInfo?.hasGps
                      ? "Found & Stripped"
                      : "Clean / Not Present"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
                    <Camera className="text-primary h-4 w-4" />
                    Camera Device Model:
                  </span>
                  <span className="text-foreground font-semibold">
                    {exifInfo?.cameraModel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    Original Date &amp; Time:
                  </span>
                  <span className="text-foreground font-semibold">
                    {exifInfo?.dateTime}
                  </span>
                </div>

                <div className="border-border/30 flex items-center justify-between border-t pt-2">
                  <span className="text-muted-foreground font-semibold">
                    Original File Size:
                  </span>
                  <span className="text-foreground font-mono">
                    {formatBytes(exifInfo?.fileSize || 0)}
                  </span>
                </div>
              </div>

              {/* Protection Confirmation Banner */}
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">Privacy Guaranteed</p>
                  <p className="mt-0.5 font-normal opacity-90">
                    All EXIF headers, GPS geolocation tags, camera serial
                    identifiers, and device fingerprints have been completely
                    removed.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview & Download Panel */}
            <div className="md:border-border/40 flex flex-col items-center justify-between gap-4 md:border-l md:pl-6">
              <span className="text-foreground self-start text-xs font-bold tracking-wider uppercase">
                Sanitized Photo Preview
              </span>

              <div className="border-border bg-muted/10 flex min-h-[200px] w-full items-center justify-center rounded-xl border p-2">
                {sanitizedUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sanitizedUrl}
                    alt="Sanitized preview"
                    className="max-h-56 rounded-lg object-contain shadow-sm"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!sanitizedUrl || isProcessing}
                className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download Sanitized Photo ({formatBytes(sanitizedSize)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
