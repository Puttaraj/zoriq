"use client";

import { Download } from "lucide-react";
import { cn, downloadBlob } from "@/lib/utils";

interface DownloadButtonProps {
  /** Blob data to download */
  blob: Blob | null;
  /** Output filename */
  fileName: string;
  /** Button label */
  label?: string;
  /** Additional class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function DownloadButton({
  blob,
  fileName,
  label = "Download",
  className,
  disabled = false,
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!blob) return;
    downloadBlob(blob, fileName);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || !blob}
      className={cn(
        "focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        "gradient-brand text-white shadow-md hover:shadow-lg",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        className,
      )}
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
}
