import Link from "next/link";
import { Heart, Github, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 bg-muted/10 border-t">
      {/* Main Footer Container */}
      <div className="container-tight py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12">
          {/* Brand Info & Newsletter */}
          <div className="flex flex-col gap-6 md:col-span-4">
            <Link href="/" aria-label="ZORIQ Home">
              <Logo />
            </Link>
            <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
              {siteConfig.tagline}. Handcrafted browser utilities designed for
              speed and total privacy. No downloads, no storage, no tracking.
            </p>

            {/* Premium Newsletter Sign-up Box */}
            <div className="mt-2 flex max-w-sm flex-col gap-2.5">
              <h4 className="text-foreground text-[10px] font-bold tracking-wider uppercase">
                Subscribe to our newsletter
              </h4>
              <NewsletterForm />
            </div>
          </div>

          {/* Navigation Columns Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:pl-8">
            {/* Tools Column */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-foreground text-[10px] font-bold tracking-wider uppercase">
                Tools
              </h4>
              <ul className="text-muted-foreground flex flex-col gap-2.5 text-xs">
                <li>
                  <Link
                    href="/tools?category=developer"
                    className="hover:text-foreground transition-colors"
                  >
                    Developer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools?category=image"
                    className="hover:text-foreground transition-colors"
                  >
                    Image Utilities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools?category=student"
                    className="hover:text-foreground transition-colors"
                  >
                    Student & Writer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools?category=finance"
                    className="hover:text-foreground transition-colors"
                  >
                    Finance Calculators
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-foreground text-[10px] font-bold tracking-wider uppercase">
                Resources
              </h4>
              <ul className="text-muted-foreground flex flex-col gap-2.5 text-xs">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub Docs
                  </a>
                </li>
                <li>
                  <Link
                    href="/api/health"
                    className="hover:text-foreground transition-colors"
                  >
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-foreground text-[10px] font-bold tracking-wider uppercase">
                Legal
              </h4>
              <ul className="text-muted-foreground flex flex-col gap-2.5 text-xs">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy#cookies"
                    className="hover:text-foreground transition-colors"
                  >
                    Cookie settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Details */}
      <div className="border-border/40 bg-muted/20 border-t">
        <div className="container-tight text-muted-foreground flex flex-col items-center justify-between gap-4 py-8 text-xs sm:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              © {currentYear} {siteConfig.name}. All rights reserved.
            </span>
            <span className="bg-muted border-border/30 rounded border px-2 py-0.5 text-[10px]">
              v0.1.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Social Icons */}
            {siteConfig.links.github && (
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {siteConfig.links.twitter && (
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}

            <span className="bg-border/40 h-4 w-px" />

            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" />{" "}
              in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
