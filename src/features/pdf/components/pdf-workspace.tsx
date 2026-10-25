"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Loader2,
  Download,
  Trash2,
  FileText,
  Settings,
  Lock,
  Unlock as UnlockIcon,
  PenTool,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { PDFPageSelector } from "./pdf-page-selector";
import { SignaturePadModal } from "./signature-pad-modal";
import { pdfEngineService, PageNumberOptions } from "../lib/engine";
import { PDFDocument } from "pdf-lib";
import { formatBytes } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PDFWorkspaceProps {
  slug: string;
}

export function PDFWorkspace({ slug }: PDFWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadBlob, setDownloadBlob] = useState<
    Blob | Blob[] | string[] | null
  >(null);

  // Reusable dynamic settings states
  const [ranges, _setRanges] = useState("1-3"); // Split
  const [quality, setQuality] = useState(80); // Compress
  const [password, setPassword] = useState(""); // Protect/Unlock
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL"); // Watermark
  const [watermarkColor, setWatermarkColor] = useState("#6C3AED"); // Watermark
  const [watermarkOpacity, setWatermarkOpacity] = useState(30); // Watermark
  const watermarkRotation = 45; // Watermark
  const [pageNoPosition, setPageNoPosition] =
    useState<PageNumberOptions["position"]>("bottom-center"); // Page Numbers
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // Page Selector
  const [rotationDegrees, setRotationDegrees] = useState(90); // Rotate

  // Split PDF Settings
  const [totalPages, setTotalPages] = useState(1);
  const [splitMode, setSplitMode] = useState<"custom" | "fixed" | "extract">(
    "custom",
  );
  const [customRanges, setCustomRanges] = useState<
    { from: number; to: number }[]
  >([]);
  const [fixedInterval, setFixedInterval] = useState(1);

  // Signature Pad state
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError(null);
    setSuccess(false);
    setDownloadBlob(null);
    setSelectedPages([]);

    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      const readPages = async () => {
        try {
          const fileBytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(fileBytes);
          const pagesCount = doc.getPageCount();
          setTotalPages(pagesCount);
          setCustomRanges([{ from: 1, to: pagesCount }]);
        } catch (e) {
          console.error("Error reading page count", e);
        }
      };
      readPages();
    }
  }, []);

  const handleReset = () => {
    setFiles([]);
    setProcessing(false);
    setError(null);
    setSuccess(false);
    setDownloadBlob(null);
    setSelectedPages([]);
    setSignatureUrl(null);
    setTotalPages(1);
    setSplitMode("custom");
    setCustomRanges([]);
    setFixedInterval(1);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const sortFilesAlphabetically = (order: "asc" | "desc") => {
    const sorted = [...files].sort((a, b) => {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setFiles(sorted);
  };

  const reverseFilesOrder = () => {
    setFiles([...files].reverse());
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      let result: Blob | Blob[] | string[] | null = null;

      switch (slug) {
        case "merge-pdf":
          result = await pdfEngineService.merge(files);
          break;
        case "split-pdf": {
          let computedRanges = ranges;
          if (splitMode === "custom") {
            computedRanges = customRanges
              .map((r) => `${r.from}-${r.to}`)
              .filter(Boolean)
              .join(", ");
          } else if (splitMode === "fixed") {
            const calculated = [];
            for (let i = 1; i <= totalPages; i += fixedInterval) {
              const end = Math.min(i + fixedInterval - 1, totalPages);
              calculated.push(`${i}-${end}`);
            }
            computedRanges = calculated.join(", ");
          } else if (splitMode === "extract") {
            computedRanges = selectedPages
              .sort((a, b) => a - b)
              .map((p) => `${p}-${p}`)
              .join(", ");
          }
          if (!computedRanges) {
            throw new Error(
              "Please specify at least one valid range or select pages to split.",
            );
          }
          result = await pdfEngineService.split(files[0], computedRanges);
          break;
        }
        case "compress-pdf":
          result = await pdfEngineService.compress(files[0], quality);
          break;
        case "remove-pages":
          result = await pdfEngineService.removePages(files[0], selectedPages);
          break;
        case "extract-pages":
          result = await pdfEngineService.extractPages(files[0], selectedPages);
          break;
        case "rotate-pdf":
          result = await pdfEngineService.rotate(files[0], rotationDegrees);
          break;
        case "crop-pdf":
          // Static margin crop for client preview
          result = await pdfEngineService.crop(files[0], {
            x: 40,
            y: 40,
            width: 500,
            height: 700,
          });
          break;
        case "add-watermark":
          result = await pdfEngineService.watermark(files[0], {
            text: watermarkText,
            color: watermarkColor,
            opacity: watermarkOpacity / 100,
            rotation: watermarkRotation,
          });
          break;
        case "add-page-numbers":
          result = await pdfEngineService.addPageNumbers(files[0], {
            position: pageNoPosition,
          });
          break;
        case "protect-pdf":
          if (!password) throw new Error("Please enter a protection password.");
          result = await pdfEngineService.protect(files[0], password);
          break;
        case "unlock-pdf":
          if (!password)
            throw new Error("Please enter the decryption password.");
          result = await pdfEngineService.unlock(files[0], password);
          break;
        case "sign-pdf":
          if (!signatureUrl)
            throw new Error("Please draw your signature first.");
          const targetPage = selectedPages[0] || 1;
          result = await pdfEngineService.sign(
            files[0],
            signatureUrl,
            targetPage,
            { x: 100, y: 100 },
          );
          break;
        case "jpg-to-pdf":
          result = await pdfEngineService.imageToPdf(files);
          break;
        case "pdf-to-jpg":
          result = await pdfEngineService.pdfToImages(files[0]);
          break;

        // Phase 2 / API stubs
        case "word-to-pdf":
        case "excel-to-pdf":
        case "powerpoint-to-pdf":
        case "html-to-pdf":
          result = await pdfEngineService.convertToPdf(
            files[0],
            slug.split("-")[0],
          );
          break;
        case "pdf-to-word":
        case "pdf-to-excel":
        case "pdf-to-powerpoint":
        case "pdf-to-pdfa":
          result = await pdfEngineService.convertFromPdf(
            files[0],
            slug.split("-").pop() || "word",
          );
          break;
        case "ocr-pdf":
          await pdfEngineService.ocr(files[0]);
          break;
        case "repair-pdf":
          result = await pdfEngineService.repair(files[0]);
          break;

        default:
          throw new Error("Unsupported PDF utility slug.");
      }

      setDownloadBlob(result);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during PDF processing.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadBlob) return;

    const originalName = files[0].name;
    const nameWithoutExt = originalName.substring(
      0,
      originalName.lastIndexOf("."),
    );

    if (Array.isArray(downloadBlob)) {
      // PDF to JPG array output download (strings) or Split PDF output (Blobs)
      downloadBlob.forEach((item, idx) => {
        const link = document.createElement("a");
        let url = "";
        if (typeof item === "string") {
          url = item;
        } else {
          url = URL.createObjectURL(item);
        }
        link.href = url;
        link.download = `${nameWithoutExt}-page-${idx + 1}.${typeof item === "string" ? "png" : "pdf"}`;
        link.click();
        if (typeof item !== "string") {
          URL.revokeObjectURL(url);
        }
      });
      return;
    }

    // Single PDF file download logic
    let ext = "pdf";
    if (slug === "jpg-to-pdf") ext = "pdf";

    let outputName = `${nameWithoutExt}-zoriq.${ext}`;
    if (slug === "split-pdf") {
      outputName = `${nameWithoutExt}-split.${ext}`;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(downloadBlob);
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const isImageToPdf = slug === "jpg-to-pdf";
  const multipleFiles = slug === "merge-pdf" || isImageToPdf;
  const acceptTypes = isImageToPdf
    ? ["image/jpeg", "image/png", "image/webp"]
    : ["application/pdf"];

  const showPageSelector = !multipleFiles && files.length > 0;

  const isPhase2 = [
    "word-to-pdf",
    "excel-to-pdf",
    "powerpoint-to-pdf",
    "html-to-pdf",
    "pdf-to-word",
    "pdf-to-excel",
    "pdf-to-powerpoint",
    "pdf-to-pdfa",
    "ocr-pdf",
    "repair-pdf",
  ].includes(slug);

  if (isPhase2) {
    return (
      <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-8 text-center sm:p-12">
        <div className="border-primary/20 bg-primary/10 text-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <Sparkles className="h-8 w-8" />
        </div>
        <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
          Zero-Retention Cloud Sandbox · Under Active Testing
        </span>
        <h2 className="font-heading text-foreground mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Engine Optimization in Progress
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-relaxed">
          To uphold ZORIQ&apos;s strict privacy standard, high-fidelity office
          format conversion requires an isolated zero-log sandbox engine. We are
          currently performing privacy and security audits to ensure no user
          files are ever stored on a disk or shared.
        </p>

        <div className="border-border/40 bg-muted/5 mt-8 rounded-xl border p-6 text-left">
          <h3 className="font-heading text-foreground mb-3 text-sm font-bold">
            Available 100% In-Browser PDF Tools:
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Link
              href="/tools/merge-pdf"
              className="border-border/60 bg-card hover:border-primary/40 group flex items-center justify-between rounded-lg border p-3 transition-all"
            >
              <span className="text-foreground group-hover:text-primary text-xs font-semibold">
                Merge PDF
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tools/compress-pdf"
              className="border-border/60 bg-card hover:border-primary/40 group flex items-center justify-between rounded-lg border p-3 transition-all"
            >
              <span className="text-foreground group-hover:text-primary text-xs font-semibold">
                Compress PDF
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tools/split-pdf"
              className="border-border/60 bg-card hover:border-primary/40 group flex items-center justify-between rounded-lg border p-3 transition-all"
            >
              <span className="text-foreground group-hover:text-primary text-xs font-semibold">
                Split PDF
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tools/jpg-to-pdf"
              className="border-border/60 bg-card hover:border-primary/40 group flex items-center justify-between rounded-lg border p-3 transition-all"
            >
              <span className="text-foreground group-hover:text-primary text-xs font-semibold">
                JPG to PDF
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tools/pdf-to-jpg"
              className="border-border/60 bg-card hover:border-primary/40 group flex items-center justify-between rounded-lg border p-3 transition-all"
            >
              <span className="text-foreground group-hover:text-primary text-xs font-semibold">
                PDF to JPG
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tools/protect-pdf"
              className="border-border/60 bg-card hover:border-primary/40 group flex items-center justify-between rounded-lg border p-3 transition-all"
            >
              <span className="text-foreground group-hover:text-primary text-xs font-semibold">
                Protect PDF
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      {/* Upload Dropzone */}
      {files.length === 0 ? (
        <FileDropzone
          accept={acceptTypes}
          maxSize={25 * 1024 * 1024} // 25 MB
          multiple={multipleFiles}
          onFilesAccepted={handleFilesAccepted}
          label={
            isImageToPdf
              ? "Drag & drop images to convert to PDF"
              : multipleFiles
                ? "Drag & drop multiple PDFs to merge"
                : "Drag & drop your PDF file to optimize"
          }
          helperText={
            isImageToPdf
              ? "Supports JPEG, PNG, WebP. Max 25MB."
              : "Supports standard PDF documents. Max 25MB."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Settings Panel Column */}
          <div className="flex flex-col gap-6 md:col-span-5">
            <div className="flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                <Settings className="text-primary h-4 w-4" />
                Tool Configurations
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="border-border bg-card text-muted-foreground hover:text-foreground focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>

            {/* Split Settings */}
            {slug === "split-pdf" && (
              <div className="flex flex-col gap-4">
                {/* Mode Selectors */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                    Split Mode
                  </label>
                  <div className="bg-muted/20 border-border/10 grid grid-cols-3 gap-1.5 rounded-lg border p-1">
                    {[
                      { id: "custom", name: "Ranges" },
                      { id: "fixed", name: "Fixed" },
                      { id: "extract", name: "Extract" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setSplitMode(
                            mode.id as "custom" | "fixed" | "extract",
                          );
                          // Reset selection states
                          setSelectedPages([]);
                          if (
                            mode.id === "custom" &&
                            customRanges.length === 0
                          ) {
                            setCustomRanges([{ from: 1, to: totalPages }]);
                          }
                        }}
                        className={cn(
                          "rounded-md py-1.5 text-center text-[10px] font-bold transition-all",
                          splitMode === mode.id
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/40",
                        )}
                      >
                        {mode.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Ranges configuration options */}
                {splitMode === "custom" && (
                  <div className="flex flex-col gap-3">
                    <span className="text-foreground text-[10px] font-bold tracking-wider uppercase">
                      Configure Ranges
                    </span>
                    <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
                      {customRanges.map((range, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-muted-foreground w-12 shrink-0 text-[10px] font-bold">
                            Range {idx + 1}
                          </span>
                          <div className="bg-muted/10 border-border/20 flex w-full items-center gap-1.5 rounded-lg border p-1">
                            <input
                              type="number"
                              min="1"
                              max={totalPages}
                              value={range.from}
                              onChange={(e) => {
                                const val = Math.min(
                                  Math.max(Number(e.target.value), 1),
                                  totalPages,
                                );
                                const next = [...customRanges];
                                next[idx] = { ...next[idx], from: val };
                                setCustomRanges(next);
                              }}
                              className="border-border/20 w-12 border-b bg-transparent text-center text-xs font-semibold focus:outline-none"
                            />
                            <span className="text-muted-foreground text-[10px]">
                              to
                            </span>
                            <input
                              type="number"
                              min="1"
                              max={totalPages}
                              value={range.to}
                              onChange={(e) => {
                                const val = Math.min(
                                  Math.max(Number(e.target.value), 1),
                                  totalPages,
                                );
                                const next = [...customRanges];
                                next[idx] = { ...next[idx], to: val };
                                setCustomRanges(next);
                              }}
                              className="border-border/20 w-12 border-b bg-transparent text-center text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          {customRanges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomRanges(
                                  customRanges.filter((_, i) => i !== idx),
                                );
                              }}
                              className="text-muted-foreground hover:text-destructive hover:bg-muted/40 rounded p-1"
                              title="Delete Range"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const lastRange = customRanges[customRanges.length - 1];
                        const nextStart = lastRange
                          ? Math.min(lastRange.to + 1, totalPages)
                          : 1;
                        setCustomRanges([
                          ...customRanges,
                          { from: nextStart, to: totalPages },
                        ]);
                      }}
                      className="border-border/60 hover:border-primary/40 bg-card hover:bg-primary/5 text-muted-foreground hover:text-primary w-full rounded-lg border border-dashed py-2 text-center text-[10px] font-bold transition-all"
                    >
                      + Add Range
                    </button>
                  </div>
                )}

                {/* Fixed Interval configurations */}
                {splitMode === "fixed" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                      Split in intervals of
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={fixedInterval}
                        onChange={(e) => {
                          const val = Math.min(
                            Math.max(Number(e.target.value), 1),
                            totalPages,
                          );
                          setFixedInterval(val);
                        }}
                        className="border-border bg-background focus:border-primary h-10 w-24 rounded-lg border px-3 py-2 text-center text-xs font-semibold outline-none"
                      />
                      <span className="text-muted-foreground text-xs font-medium">
                        pages
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed">
                      Every {fixedInterval}{" "}
                      {fixedInterval === 1 ? "page" : "pages"} of the uploaded
                      PDF file will be split into a separate document (creating{" "}
                      {Math.ceil(totalPages / fixedInterval)} files).
                    </p>
                  </div>
                )}

                {/* Extract configurations */}
                {splitMode === "extract" && (
                  <div className="bg-primary/5 border-primary/10 text-muted-foreground rounded-lg border p-3.5 text-xs leading-relaxed font-semibold">
                    <p className="text-primary mb-1 font-bold">
                      Interactive Page Selection:
                    </p>
                    Select page checkmarks in the Document Preview panel on the
                    right. Each selected page will be split and extracted into a
                    separate PDF file.
                  </div>
                )}
              </div>
            )}

            {/* Quality Slider Settings (Compress) */}
            {slug === "compress-pdf" && files[0] && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase">
                    <span className="text-foreground">DPI Quality</span>
                    <span className="text-primary font-mono">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
                  />
                </div>
                <div className="border-primary/10 bg-primary/5 rounded-xl border p-3 text-xs leading-relaxed font-semibold">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Original Size:
                    </span>
                    <span className="text-foreground font-mono">
                      {formatBytes(files[0].size)}
                    </span>
                  </div>
                  <div className="text-primary flex items-center justify-between font-bold">
                    <span>Estimated Size:</span>
                    <span className="font-mono">
                      ~
                      {formatBytes(
                        files[0].size * (0.15 + (quality / 100) * 0.8),
                      )}
                    </span>
                  </div>
                  <p className="text-muted-foreground/80 mt-1 text-[10px] leading-relaxed font-medium">
                    Estimated savings:{" "}
                    {Math.round((1 - (0.15 + (quality / 100) * 0.8)) * 100)}%
                  </p>
                </div>
              </div>
            )}

            {/* Watermark Settings */}
            {slug === "add-watermark" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="border-border bg-background focus:border-primary h-10 w-full rounded-lg border px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                      Color
                    </label>
                    <input
                      type="color"
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value)}
                      className="border-border bg-background h-10 w-full cursor-pointer rounded-lg border p-1 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                      Opacity (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={watermarkOpacity}
                      onChange={(e) =>
                        setWatermarkOpacity(Number(e.target.value))
                      }
                      className="border-border bg-background focus:border-primary h-10 w-full rounded-lg border px-3 py-2 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Page Number Settings */}
            {slug === "add-page-numbers" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Page Number Placement
                </label>
                <select
                  value={pageNoPosition}
                  onChange={(e) =>
                    setPageNoPosition(
                      e.target.value as PageNumberOptions["position"],
                    )
                  }
                  className="border-border bg-background focus:border-primary h-10 w-full rounded-lg border px-3 py-2 text-xs font-semibold outline-none"
                >
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
            )}

            {/* Security Crypt Password Settings */}
            {(slug === "protect-pdf" || slug === "unlock-pdf") && (
              <div className="flex flex-col gap-1.5">
                <label className="text-foreground flex items-center gap-1 text-xs font-bold tracking-wider uppercase">
                  {slug === "protect-pdf" ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <UnlockIcon className="h-3.5 w-3.5" />
                  )}
                  Document Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="border-border bg-background focus:border-primary h-10 w-full rounded-lg border px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
            )}

            {/* Sign PDF Settings */}
            {slug === "sign-pdf" && (
              <div className="flex flex-col gap-3">
                <label className="text-foreground flex items-center gap-1 text-xs font-bold tracking-wider uppercase">
                  <PenTool className="h-3.5 w-3.5" />
                  Your Signature
                </label>
                {signatureUrl ? (
                  <div className="border-border relative flex h-24 items-center justify-center rounded-xl border bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={signatureUrl}
                      alt="Signature Preview"
                      className="h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setSignatureUrl(null)}
                      className="text-muted-foreground hover:text-destructive bg-muted/60 absolute top-1.5 right-1.5 rounded p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSigModalOpen(true)}
                    className="border-border hover:border-primary hover:bg-primary/5 focus-ring text-muted-foreground hover:text-primary flex h-24 w-full flex-col items-center justify-center rounded-xl border border-dashed text-xs font-semibold transition-all"
                  >
                    Draw Signature
                  </button>
                )}
              </div>
            )}

            {/* Rotate Settings */}
            {slug === "rotate-pdf" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Rotation Angle
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotationDegrees(deg)}
                      className={cn(
                        "border-border bg-card focus-ring rounded-lg border py-2 text-xs font-bold transition-all",
                        rotationDegrees === deg
                          ? "bg-primary/10 text-primary border-primary"
                          : "hover:bg-muted",
                      )}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 2 Informational banners */}
            {isPhase2 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed font-medium text-amber-600">
                <span className="font-bold">Phase 2 Sandbox Stub:</span> This
                tool configuration is fully registered. Processing engine
                integration requires Vercel server-side APIs (coming in Phase
                2). Click processing to simulate action failure logs.
              </div>
            )}

            {/* File List Summary */}
            <div className="border-border/60 flex flex-col gap-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Files List ({files.length})
                </span>
                {/* Auto sort control pills when multiple files uploaded */}
                {multipleFiles && files.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => sortFilesAlphabetically("asc")}
                      className="text-primary px-1 py-0.5 hover:underline"
                    >
                      A-Z
                    </button>
                    <span className="text-muted-foreground/40">|</span>
                    <button
                      type="button"
                      onClick={() => sortFilesAlphabetically("desc")}
                      className="text-primary px-1 py-0.5 hover:underline"
                    >
                      Z-A
                    </button>
                    <span className="text-muted-foreground/40">|</span>
                    <button
                      type="button"
                      onClick={reverseFilesOrder}
                      className="text-primary px-1 py-0.5 hover:underline"
                    >
                      Reverse
                    </button>
                  </div>
                )}
              </div>
              <div className="border-border/40 bg-muted/10 flex max-h-48 flex-col gap-2 overflow-y-auto rounded-xl border p-3">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs font-semibold"
                  >
                    <span
                      className="text-foreground flex max-w-[150px] items-center gap-1 truncate"
                      title={file.name}
                    >
                      <FileText className="text-primary h-3.5 w-3.5 flex-shrink-0" />
                      {file.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground mr-1 text-[10px]">
                        {formatBytes(file.size)}
                      </span>
                      {/* Manual Up/Down arrow controllers */}
                      {multipleFiles && files.length > 1 && (
                        <div className="border-border/20 bg-card flex items-center rounded border p-0.5">
                          <button
                            type="button"
                            onClick={() => moveFile(idx, "up")}
                            disabled={idx === 0}
                            className="text-muted-foreground hover:text-foreground p-0.5 disabled:opacity-30"
                            aria-label="Move file up"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFile(idx, "down")}
                            disabled={idx === files.length - 1}
                            className="text-muted-foreground hover:text-foreground p-0.5 disabled:opacity-30"
                            aria-label="Move file down"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Button Action */}
            <button
              type="button"
              onClick={handleProcess}
              disabled={
                processing || success || (slug === "sign-pdf" && !signatureUrl)
              }
              className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : success ? (
                "Processed successfully"
              ) : (
                "Run Process"
              )}
            </button>

            {/* Download Button Action */}
            {success && downloadBlob && (
              <button
                type="button"
                onClick={handleDownload}
                className="bg-accent-surface text-accent-surface-foreground hover:bg-accent-surface/95 focus-ring inline-flex w-full animate-bounce items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase shadow-sm transition-all"
              >
                <Download className="h-4 w-4" />
                Download Result
              </button>
            )}

            {/* Reset / Done Button Action */}
            {success && (
              <button
                type="button"
                onClick={handleReset}
                className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex w-full items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-bold tracking-wider uppercase transition-all"
              >
                Reset / Start New
              </button>
            )}

            {/* Error notifications */}
            {error && (
              <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border p-4 text-xs leading-relaxed font-semibold">
                {error}
              </div>
            )}
          </div>

          {/* Preview Panel Column */}
          <div className="md:border-border/40 flex flex-col gap-6 md:col-span-7 md:border-l md:pl-8">
            <span className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
              <ImageIcon className="text-primary h-4 w-4" />
              Document Preview
            </span>
            <div className="border-border bg-muted/10 relative flex min-h-64 flex-col items-center justify-center rounded-xl border p-4 shadow-inner">
              {showPageSelector ? (
                <div className="w-full">
                  <p className="text-muted-foreground mb-3 text-[10px] leading-relaxed font-semibold">
                    {slug === "sign-pdf"
                      ? "Select the page you wish to stamp your signature signature pad placement:"
                      : ["remove-pages", "extract-pages"].includes(slug)
                        ? "Check the pages you wish to manipulate/extract:"
                        : slug === "split-pdf"
                          ? splitMode === "extract"
                            ? "Select the pages you wish to extract as individual PDF files:"
                            : "Page thumbnails reference (all pages will be split according to range parameters defined):"
                          : "Document page reference previews (all edits apply to the entire document):"}
                  </p>
                  <PDFPageSelector
                    file={files[0]}
                    selectedPages={selectedPages}
                    onSelectionChange={setSelectedPages}
                    multiple={slug !== "sign-pdf"}
                    readOnly={
                      !(
                        ["remove-pages", "extract-pages", "sign-pdf"].includes(
                          slug,
                        ) ||
                        (slug === "split-pdf" && splitMode === "extract")
                      )
                    }
                  />
                </div>
              ) : multipleFiles ? (
                <div className="w-full">
                  <p className="text-muted-foreground mb-3 text-[10px] leading-relaxed font-semibold">
                    Visual files list order queue preview:
                  </p>
                  <PDFFilesPreview files={files} />
                </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 text-center">
                  <FileText className="text-primary h-12 w-12" />
                  <div>
                    <p className="text-foreground text-xs font-semibold">
                      {files[0].name}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px]">
                      Settings loaded. Ready to run local PDF processing
                      engines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signature pad drawing modal mount */}
      <SignaturePadModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={setSignatureUrl}
      />
    </div>
  );
}

function PDFFilesPreview({ files }: { files: File[] }) {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    const loadPreviews = async () => {
      for (const file of files) {
        if (previews[file.name]) continue; // Skip already loaded previews

        if (file.type === "application/pdf") {
          setLoading((prev) => ({ ...prev, [file.name]: true }));
          try {
            const url = await pdfEngineService.pdfPageToImage(file, 1);
            if (active) {
              setPreviews((prev) => ({ ...prev, [file.name]: url }));
            }
          } catch (e) {
            console.error("Preview error", e);
          } finally {
            if (active) {
              setLoading((prev) => ({ ...prev, [file.name]: false }));
            }
          }
        } else if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          if (active) {
            setPreviews((prev) => ({ ...prev, [file.name]: url }));
          }
        }
      }
    };

    loadPreviews();

    return () => {
      active = false;
    };
  }, [files, previews]);

  return (
    <div className="grid max-h-[60vh] w-full grid-cols-2 gap-4 overflow-y-auto p-1 sm:grid-cols-3">
      {files.map((file, idx) => (
        <div
          key={idx}
          className="border-border/45 bg-card/60 shadow-soft hover:border-primary/20 relative flex flex-col items-center justify-between rounded-xl border p-3 transition-all duration-300"
        >
          {/* Index indicator */}
          <div className="bg-primary/10 text-primary absolute top-2 left-2 rounded px-1.5 py-0.5 text-[9px] font-bold">
            {idx + 1}
          </div>
          {loading[file.name] ? (
            <div className="bg-muted/40 mt-4 flex aspect-[3/4] h-28 w-full animate-pulse items-center justify-center rounded">
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            </div>
          ) : previews[file.name] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previews[file.name]}
              alt={file.name}
              className="border-border/10 mt-4 aspect-[3/4] h-28 rounded border bg-white object-contain shadow-sm"
            />
          ) : (
            <div className="bg-muted/20 mt-4 flex aspect-[3/4] h-28 w-full flex-col items-center justify-center gap-1 rounded">
              <FileText className="text-muted-foreground/60 h-8 w-8" />
              <span className="text-muted-foreground text-[8px] font-semibold uppercase">
                PDF File
              </span>
            </div>
          )}
          <span
            className="text-foreground mt-3 max-w-[130px] truncate text-center text-[10px] font-bold"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
      ))}
    </div>
  );
}
