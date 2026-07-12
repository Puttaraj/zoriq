"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { X, Check, RotateCcw } from "lucide-react";

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export function SignaturePadModal({
  isOpen,
  onClose,
  onSave,
}: SignaturePadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // Scale canvas pixels for high-DPI displays
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
    });

    pad.addEventListener("endStroke", () => {
      setIsEmpty(pad.isEmpty());
    });

    signaturePadRef.current = pad;

    return () => {
      pad.off();
    };
  }, [isOpen]);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) return;

    // Convert signature drawing canvas to transparent base64 png
    const dataUrl = signaturePadRef.current.toDataURL("image/png");
    onSave(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="border-border bg-card animate-scale-in w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl">
        {/* Header */}
        <div className="border-border/40 flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-heading text-foreground text-sm font-bold">
            Draw Your Signature
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            aria-label="Close signature modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Canvas Body */}
        <div className="p-5">
          <div className="border-border relative h-48 w-full overflow-hidden rounded-xl border bg-white">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            />
          </div>
          <p className="text-muted-foreground mt-2 text-center text-[10px] font-semibold">
            Use your mouse or touch screen to draw your signature inside the
            box.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="border-border/40 bg-muted/20 flex items-center justify-between border-t px-5 py-4">
          <button
            type="button"
            onClick={handleClear}
            className="border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground focus-ring inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground focus-ring rounded-lg border px-3 py-2 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isEmpty}
              className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
