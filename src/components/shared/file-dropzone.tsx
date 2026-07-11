"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileIcon, AlertCircle } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
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
              isDragOver
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {isDragOver ? (
              <FileIcon className="h-7 w-7" />
            ) : (
              <Upload className="h-7 w-7" />
            )}
          </div>
        </motion.div>

        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            {isDragOver ? "Drop files here" : label}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {helperText ??
              `${formatNames} · Max ${formatBytes(maxSize)}${multiple ? ` · Up to ${maxFiles} files` : ""}`}
          </p>
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
