import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="gradient-text font-heading text-8xl font-bold">404</div>
      <h1 className="font-heading mt-4 text-2xl font-bold">Page Not Found</h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching for a tool or head back home.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="gradient-brand focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/tools"
          className="border-border hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Tools
        </Link>
      </div>
    </div>
  );
}
