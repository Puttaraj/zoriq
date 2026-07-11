import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { Shield, Zap, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = generatePageMetadata(
  "About Us — ZORIQ",
  "Learn more about ZORIQ, our mission, privacy values, and why we build browser-based utility tools.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="container-tight py-12 md:py-16">
      {/* Intro */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          We build tools that <span className="gradient-text">Respect You</span>
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
          ZORIQ was born out of a simple idea: online tools shouldn&apos;t be
          slow, bloated with intrusive ads, or require you to upload your
          private files to someone else&apos;s servers. We build lightning-fast,
          beautiful utilities that run entirely on your local machine.
        </p>
      </div>

      {/* Grid Values */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="border-border/60 bg-card shadow-soft rounded-2xl border p-6">
          <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-foreground text-lg font-bold">
            100% Privacy
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Most online utility platforms upload your files (images, PDFs,
            documents) to their backend, which creates storage costs and
            security liabilities. At ZORIQ, your files never leave your device.
            All calculations, compression, and formatting run locally in your
            browser tab.
          </p>
        </div>

        <div className="border-border/60 bg-card shadow-soft rounded-2xl border p-6">
          <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-foreground text-lg font-bold">
            Instant Processing
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            By shifting the computation work off servers and into your browser,
            there is no network queue, uploading delay, or server queue delay.
            Your files process instantly in milliseconds — even with slow
            internet.
          </p>
        </div>

        <div className="border-border/60 bg-card shadow-soft rounded-2xl border p-6">
          <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-foreground text-lg font-bold">
            World-Class UI/UX
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            We believe that free web utilities shouldn&apos;t look like spam
            directories from 2010. ZORIQ is built on modern visual design
            systems, dark mode integration, clear spacing, and accessibility
            (WCAG 2.1 AA) standards.
          </p>
        </div>

        <div className="border-border/60 bg-card shadow-soft rounded-2xl border p-6">
          <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-foreground text-lg font-bold">
            Free & Accessible
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            No signup requirements, credit card holds, or access limits. We want
            ZORIQ to be your handy bookmarkable utility belt that you can return
            to whenever you need to resize a photo, format JSON, or generate a
            safe password.
          </p>
        </div>
      </div>
    </div>
  );
}
