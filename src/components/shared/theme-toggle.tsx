"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-muted h-9 w-9 animate-pulse rounded-lg" />;
  }

  const modes = [
    { key: "light", icon: Sun, label: "Light mode" },
    { key: "dark", icon: Moon, label: "Dark mode" },
    { key: "system", icon: Monitor, label: "System theme" },
  ] as const;

  const currentIndex = modes.findIndex((m) => m.key === theme);
  const next = modes[(currentIndex + 1) % modes.length];
  const Current = modes[currentIndex >= 0 ? currentIndex : 2].icon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next.key)}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg",
        "text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus-ring",
      )}
      aria-label={`Switch to ${next.label}`}
    >
      <Current className="h-[18px] w-[18px]" />
    </button>
  );
}
