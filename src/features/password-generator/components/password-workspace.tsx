"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/lib/utils";

export function PasswordWorkspace() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [strength, setStrength] = useState({
    score: 0,
    label: "Very Weak",
    color: "bg-destructive",
  });

  const generateSinglePassword = useCallback(
    (
      len: number,
      upper: boolean,
      lower: boolean,
      num: boolean,
      sym: boolean,
    ) => {
      let charSet = "";
      if (upper) charSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lower) charSet += "abcdefghijklmnopqrstuvwxyz";
      if (num) charSet += "0123456789";
      if (sym) charSet += "!@#$%^&*()_+-=[]{}|;:',.<>?";

      if (!charSet) return "";

      let result = "";
      const randomValues = new Uint32Array(len);
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < len; i++) {
        result += charSet[randomValues[i] % charSet.length];
      }
      return result;
    },
    [],
  );

  const calculateStrength = useCallback((pwd: string) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-muted" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 14) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) {
      return { score, label: "Very Weak", color: "bg-destructive" };
    } else if (score <= 4) {
      return { score, label: "Weak", color: "bg-orange-500" };
    } else if (score === 5) {
      return { score, label: "Strong", color: "bg-yellow-500" };
    } else {
      return { score, label: "Very Strong", color: "bg-accent-surface" };
    }
  }, []);

  const handleGenerate = useCallback(() => {
    if (bulkCount > 1) {
      const list = Array.from({ length: bulkCount }, () =>
        generateSinglePassword(
          length,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        ),
      );
      setBulkPasswords(list);
      setPassword(list[0] || "");
    } else {
      const pwd = generateSinglePassword(
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      );
      setPassword(pwd);
      setBulkPasswords([]);
    }
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    bulkCount,
    generateSinglePassword,
  ]);

  useEffect(() => {
    handleGenerate();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    bulkCount,
    handleGenerate,
  ]);

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password, calculateStrength]);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyAll = async () => {
    const text = bulkPasswords.join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-2xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Output Display */}
        <div className="border-border bg-muted/30 relative flex items-center rounded-xl border px-4 py-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="w-full bg-transparent font-mono text-lg font-semibold tracking-wide outline-none"
            aria-label="Generated password"
          />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleGenerate()}
              className="text-muted-foreground hover:bg-muted hover:text-foreground focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              aria-label="Regenerate password"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={() => handleCopy(password)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              aria-label="Copy password"
            >
              {copied ? (
                <Check className="h-4.5 w-4.5" />
              ) : (
                <Copy className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        {bulkCount === 1 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Password Strength</span>
              <span className="text-foreground">{strength.label}</span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <motion.div
                className={`h-full ${strength.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Length Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-foreground">Password Length</span>
            <span className="text-primary font-mono">{length}</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
            aria-label="Password length"
          />
        </div>

        {/* Settings checkboxes */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="border-border/60 bg-muted/10 hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
            />
            <span className="text-foreground text-sm font-medium">
              Uppercase (A-Z)
            </span>
          </label>
          <label className="border-border/60 bg-muted/10 hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
            />
            <span className="text-foreground text-sm font-medium">
              Lowercase (a-z)
            </span>
          </label>
          <label className="border-border/60 bg-muted/10 hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
            />
            <span className="text-foreground text-sm font-medium">
              Numbers (0-9)
            </span>
          </label>
          <label className="border-border/60 bg-muted/10 hover:bg-muted/30 flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
            />
            <span className="text-foreground text-sm font-medium">
              Symbols (!@#$)
            </span>
          </label>
        </div>

        {/* Bulk generation setting */}
        <div className="border-border/60 flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-foreground">Generate Multiple Passwords</span>
            <span className="text-primary font-mono">{bulkCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={bulkCount}
            onChange={(e) => setBulkCount(Number(e.target.value))}
            className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
            aria-label="Generate multiple passwords"
          />
        </div>

        {/* Bulk Password List */}
        {bulkCount > 1 && bulkPasswords.length > 0 && (
          <div className="border-border/60 flex flex-col gap-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                All Generated Passwords
              </span>
              <button
                type="button"
                onClick={handleCopyAll}
                className="text-primary hover:text-primary/80 text-xs font-semibold transition-colors"
              >
                Copy All
              </button>
            </div>
            <div className="border-border bg-muted/20 max-h-48 overflow-y-auto rounded-lg border p-3 font-mono text-sm leading-relaxed">
              {bulkPasswords.map((pwd, idx) => (
                <div
                  key={idx}
                  className="border-border/20 flex items-center justify-between border-b py-1 last:border-0"
                >
                  <span className="break-all select-all">{pwd}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(pwd)}
                    className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                    aria-label={`Copy password ${idx + 1}`}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
