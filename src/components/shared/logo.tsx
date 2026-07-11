import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function LogoIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Sleek, flat, geometric Z mark with mint accent dot */}
      <path
        d="M7 6h18v4l-11 11.5H25V26H7v-4l11-11.5H7V6z"
        fill="currentColor"
      />
      <circle cx="23.5" cy="7.5" r="2.5" className="fill-mint" />
    </svg>
  );
}

export function Logo({
  className,
  iconClassName,
  textClassName,
  showText = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="text-foreground transition-transform duration-300 hover:rotate-[10deg]">
        <LogoIcon className={cn("h-7 w-7", iconClassName)} />
      </div>
      {showText && (
        <span
          className={cn(
            "font-heading text-foreground text-lg font-bold tracking-tight",
            textClassName,
          )}
        >
          ZORIQ
        </span>
      )}
    </div>
  );
}
