import { LogoIcon } from "@/components/shared/logo";

export default function Loading() {
  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center py-10"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo mark block */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Subtle outer ping ring */}
          <div className="bg-primary/10 absolute inset-0 animate-ping rounded-full opacity-75" />
          {/* Subtle spinning border ring */}
          <div
            className="border-primary/20 border-t-primary absolute inset-0 animate-spin rounded-full border"
            style={{ animationDuration: "1.2s" }}
          />
          {/* Central Logo */}
          <div className="text-foreground relative animate-pulse">
            <LogoIcon className="h-8 w-8" />
          </div>
        </div>

        {/* Loading text caption */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="font-heading text-foreground text-sm font-bold tracking-wide">
            ZORIQ
          </span>
          <span className="text-muted-foreground text-[11px] font-medium">
            Initializing secure local workspace...
          </span>
        </div>
      </div>
    </div>
  );
}
