import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { Mail, Clock, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = generatePageMetadata(
  "Contact Us — ZORIQ",
  "Get in touch with ZORIQ. Send us feature requests, feedback, bug reports, or support questions.",
  "/contact",
);

export default function ContactPage() {
  return (
    <div className="container-tight py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Intro */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-base leading-relaxed">
            Have a question, feedback, or feature request? We would love to hear
            from you. Drop us a line and we will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Info Column */}
          <div className="flex flex-col gap-6 md:col-span-5">
            <div className="border-border/60 bg-muted/10 flex flex-col gap-4 rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-muted-foreground text-xs font-semibold">
                    Email Us
                  </h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-foreground text-sm font-semibold transition-all hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="border-border/40 flex items-center gap-3 border-t pt-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-muted-foreground text-xs font-semibold">
                    Response Time
                  </h3>
                  <p className="text-foreground text-sm font-semibold">
                    Within 24-48 Hours
                  </p>
                </div>
              </div>

              <div className="border-border/40 flex items-center gap-3 border-t pt-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-muted-foreground text-xs font-semibold">
                    Bug Reports
                  </h3>
                  <p className="text-foreground text-sm font-semibold">
                    Please specify your device and browser type.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
