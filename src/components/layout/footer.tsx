import Link from "next/link";
import { Zap, Heart } from "lucide-react";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 bg-muted/30 border-t">
      {/* Main Footer */}
      <div className="container-tight py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2"
              aria-label="ZORIQ Home"
            >
              <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                ZORIQ
              </span>
            </Link>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
              {siteConfig.tagline}. Free online tools for developers, students,
              and everyone.
            </p>
          </div>

          {/* Navigation Columns */}
          {footerNav.map((section) => (
            <div key={section.title}>
              <h3 className="text-foreground mb-4 text-sm font-semibold">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      {...(link.isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-border/40 border-t">
        <div className="container-tight flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> in
            India
          </p>
        </div>
      </div>
    </footer>
  );
}
