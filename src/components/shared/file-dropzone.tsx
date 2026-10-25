"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileIcon, AlertCircle, ClipboardCheck } from "lucide-react";
import { cn, formatBytes, isValidFileType, isValidFileSize } from "@/lib/utils";

interface FileDropzoneProps {
  /** Accepted MIME types (e.g., ["image/jpeg", "image/png"]) */
  accept: string[];
  /** Max file size in bytes */
  maxSize: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Max number of files */
  maxFiles?: number;
  /** Callback when valid files are dropped/selected */
  onFilesAccepted: (files: File[]) => void;
  /** Custom label text */
  label?: string;
  /** Custom helper text */
  helperText?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function FileDropzone({
  accept,
  maxSize,
  multiple = true,
  maxFiles = 20,
  onFilesAccepted,
  label = "Drag & drop files here",
  helperText,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastedFeedback, setPastedFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | File[] | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);

      const files = Array.from(fileList).slice(0, maxFiles);
      const invalidType = files.find((f) => !isValidFileType(f, accept));
      if (invalidType) {
        setError(`Invalid file type: ${invalidType.name}`);
        return;
      }

      const invalidSize = files.find((f) => !isValidFileSize(f, maxSize));
      if (invalidSize) {
        setError(
          `File too large: ${invalidSize.name} (max ${formatBytes(maxSize)})`,
        );
        return;
      }

      onFilesAccepted(files);
    },
    [accept, maxSize, maxFiles, onFilesAccepted],
  );

  // Global Clipboard Paste Listener for instant one-step image/PDF uploads
  useEffect(() => {
    if (disabled) return;

    const handlePaste = (e: ClipboardEvent) => {
      // Ignore if user is currently typing inside an active input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!e.clipboardData) return;

      const clipboardFiles: File[] = [];

      // 1. Check direct files attached to clipboard
      if (e.clipboardData.files && e.clipboardData.files.length > 0) {
        for (let i = 0; i < e.clipboardData.files.length; i++) {
          clipboardFiles.push(e.clipboardData.files[i]);
        }
      } else if (e.clipboardData.items && e.clipboardData.items.length > 0) {
        // 2. Check items (screenshots, copied image bitmap blobs from web/system)
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.kind === "file") {
            const blobFile = item.getAsFile();
            if (blobFile) {
              clipboardFiles.push(blobFile);
            }
          }
        }
      }

      if (clipboardFiles.length > 0) {
        e.preventDefault();
        handleFiles(clipboardFiles);
        setPastedFeedback(true);
        setTimeout(() => setPastedFeedback(false), 2500);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [disabled, handleFiles]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const acceptString = accept.join(",");
  const formatNames = accept
    .map((t) => t.split("/")[1]?.toUpperCase())
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-200",
          isDragOver
            ? "border-primary bg-primary/5 shadow-lg"
            : "border-border hover:border-primary/40 hover:bg-muted/30",
          disabled && "pointer-events-none opacity-50",
          error && "border-destructive/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-hidden="true"
          disabled={disabled}
        />

        <motion.div
          animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
              pastedFeedback
                ? "bg-emerald-500 text-white"
                : isDragOver
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {pastedFeedback ? (
              <ClipboardCheck className="h-7 w-7" />
            ) : isDragOver ? (
              <FileIcon className="h-7 w-7" />
            ) : (
              <Upload className="h-7 w-7" />
            )}
          </div>
        </motion.div>

        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            {pastedFeedback
              ? "✓ Uploaded from clipboard!"
              : isDragOver
                ? "Drop files here"
                : label}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {helperText ??
              `${formatNames} · Max ${formatBytes(maxSize)}${multiple ? ` · Up to ${maxFiles} files` : ""}`}
          </p>

          {/* Clipboard Paste Hint badge */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <span className="bg-muted/60 border-border/40 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors">
              <kbd className="font-mono font-semibold">Ctrl + V</kbd> or{" "}
              <kbd className="font-mono font-semibold">⌘V</kbd> to paste
              screenshot / file
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-destructive mt-3 flex items-center gap-2 text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
