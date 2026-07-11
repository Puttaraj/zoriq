import Link from "next/link";
import { Home, Search } from "lucide-react";
import { LogoIcon } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <div className="container-tight relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      {/* Background soft glowing blur */}
      <div className="bg-primary/5 pointer-events-none absolute -z-10 h-[300px] w-[300px] rounded-full blur-[80px]" />

      <div className="flex flex-col items-center gap-6">
        {/* Sleek logo brand identifier */}
        <div className="bg-muted/60 text-foreground shadow-soft flex h-12 w-12 items-center justify-center rounded-xl">
          <LogoIcon className="h-6 w-6" />
        </div>

        <div className="space-y-3">
          <div className="gradient-text font-heading text-6xl font-extrabold tracking-tight sm:text-7xl">
            404
          </div>
          <h1 className="font-heading text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-xs leading-relaxed sm:text-sm">
            We couldn&apos;t find that page. All our standard AI-powered browser
            tools are safe and accessible in the tools directory.
          </p>
        </div>

        {/* Dynamic CTA options */}
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/95 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-sm transition-all sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          <Link
            href="/tools"
            className="border-border bg-card hover:bg-muted focus-ring text-muted-foreground hover:text-foreground inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-semibold transition-all sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Explore Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
