"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { X, RotateCcw, PenTool, Type } from "lucide-react";

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

type SigMode = "draw" | "type";

const CURSIVE_FONTS = [
  {
    id: "brush",
    name: "Classic Cursive",
    font: "italic 38px 'Brush Script MT', cursive",
  },
  {
    id: "segoe",
    name: "Modern Script",
    font: "italic 32px 'Segoe Script', 'Bradley Hand', cursive",
  },
  {
    id: "lucida",
    name: "Formal Calligraphy",
    font: "italic 30px 'Lucida Handwriting', cursive",
  },
  {
    id: "cursive",
    name: "Elegant Hand",
    font: "italic 34px 'Snell Roundhand', cursive",
  },
];

const INK_COLORS = [
  { id: "black", name: "Classic Black", hex: "#000000" },
  { id: "blue", name: "Executive Blue", hex: "#002B7F" },
  { id: "maroon", name: "Burgundy Red", hex: "#7A0019" },
];

export function SignaturePadModal({
  isOpen,
  onClose,
  onSave,
}: SignaturePadModalProps) {
  const [mode, setMode] = useState<SigMode>("draw");
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState(CURSIVE_FONTS[0].id);
  const [inkColor, setInkColor] = useState(INK_COLORS[0].hex);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [_isEmpty, setIsEmpty] = useState(true);

  // Initialize SignaturePad in Draw Mode
  useEffect(() => {
    if (!isOpen || mode !== "draw" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgba(255, 255, 255, 0)",
      penColor: inkColor,
    });

    pad.addEventListener("endStroke", () => {
      setIsEmpty(pad.isEmpty());
    });

    signaturePadRef.current = pad;

    return () => {
      pad.off();
    };
  }, [isOpen, mode, inkColor]);

  // Update Canvas in Type Mode
  useEffect(() => {
    if (!isOpen || mode !== "type" || !typeCanvasRef.current) return;

    const canvas = typeCanvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    if (typedName.trim()) {
      const activeFont =
        CURSIVE_FONTS.find((f) => f.id === selectedFont)?.font ||
        CURSIVE_FONTS[0].font;
      ctx.font = activeFont;
      ctx.fillStyle = inkColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, canvas.offsetWidth / 2, canvas.offsetHeight / 2);
    }
  }, [isOpen, mode, typedName, selectedFont, inkColor]);

  const handleClear = () => {
    if (mode === "draw") {
      signaturePadRef.current?.clear();
      setIsEmpty(true);
    } else {
      setTypedName("");
    }
  };

  const handleSave = () => {
    if (mode === "draw") {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) return;
      const dataUrl = signaturePadRef.current.toDataURL("image/png");
      onSave(dataUrl);
    } else {
      if (!typeCanvasRef.current || !typedName.trim()) return;
      const dataUrl = typeCanvasRef.current.toDataURL("image/png");
      onSave(dataUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="border-border bg-card animate-scale-in w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl">
        {/* Header */}
        <div className="border-border/40 flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-foreground text-sm font-bold">
              Create Your Signature
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            aria-label="Close signature modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="border-border/30 bg-muted/20 border-b px-5 py-2.5">
          <div className="flex items-center justify-between">
            <div className="bg-muted/40 border-border/30 flex items-center rounded-lg border p-0.5">
              <button
                type="button"
                onClick={() => setMode("draw")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === "draw"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                Draw
              </button>
              <button
                type="button"
                onClick={() => setMode("type")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === "type"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Type className="h-3.5 w-3.5" />
                Type Cursive
              </button>
            </div>

            {/* Ink Color Picker */}
            <div className="flex items-center gap-1.5">
              {INK_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setInkColor(c.hex)}
                  className={`h-5 w-5 rounded-full border transition-all ${
                    inkColor === c.hex
                      ? "ring-primary scale-110 ring-2 ring-offset-1"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="flex flex-col gap-4 p-5">
          {mode === "draw" ? (
            <div>
              <div className="border-border relative h-48 w-full overflow-hidden rounded-xl border bg-white dark:bg-zinc-950">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
                />
              </div>
              <p className="text-muted-foreground mt-2 text-center text-[10px] font-semibold">
                Draw your signature above using mouse, stylus, or fingertip.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your full name here..."
                className="border-border bg-background focus:border-primary w-full rounded-xl border p-2.5 text-sm outline-none"
                autoFocus
              />

              {/* Font Choices */}
              <div className="grid grid-cols-2 gap-2">
                {CURSIVE_FONTS.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setSelectedFont(font.id)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      selectedFont === font.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/40 hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold opacity-70">
                      {font.name}
                    </span>
                    <span
                      className="block truncate pt-0.5 text-base"
                      style={{
                        fontFamily: font.font.split("px ")[1],
                        color: inkColor,
                      }}
                    >
                      {typedName || "Your Signature"}
                    </span>
                  </button>
                ))}
              </div>

              {/* High-DPI Output Canvas (hidden off-screen / previewed) */}
              <div className="border-border relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border bg-white dark:bg-zinc-950">
                <canvas
                  ref={typeCanvasRef}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}
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
              disabled={mode === "type" && !typedName.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring rounded-lg px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
            >
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
