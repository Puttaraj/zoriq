"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, WifiOff } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isOnline = useOnlineStatus();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/40 bg-background/80 h-14 backdrop-blur-xl"
          : "h-16 border-transparent bg-transparent",
      )}
    >
      <div className="container-tight flex h-full items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-90"
          aria-label="ZORIQ Home"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-muted hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="active-nav"
                  className="bg-primary absolute inset-x-1 -bottom-[17px] h-[2px] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <span className="hidden items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-500 sm:inline-flex">
              <WifiOff className="h-3.5 w-3.5" />
              Offline Mode
            </span>
          )}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-border/40 border-t md:hidden"
          >
            <nav
              className="container-tight flex flex-col gap-1 py-4"
              aria-label="Mobile navigation"
            >
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    "hover:bg-muted",
                    pathname === link.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
