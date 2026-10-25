import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata(
  "Terms of Service — ZORIQ",
  "Terms of service for ZORIQ. Read about our rules, usage policies, and liability disclaimers.",
  "/terms",
);

export default function TermsPage() {
  const lastUpdated = "July 11, 2026";

  return (
    <div className="container-tight py-12 md:py-16">
      <div className="prose dark:prose-invert mx-auto max-w-3xl">
        <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Last Updated: {lastUpdated}
        </p>

        <div className="text-muted-foreground mt-8 flex flex-col gap-6 text-sm leading-relaxed">
          <p>
            Welcome to ZORIQ (&quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). By accessing or using our platform at{" "}
            <a
              href="https://www.zoriq.co.in"
              className="text-primary hover:underline"
            >
              https://www.zoriq.co.in
            </a>{" "}
            (the &quot;Site&quot;) and its associated browser-based tools, you
            agree to comply with and be bound by the following Terms of Service.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            1. Acceptance of Terms
          </h2>
          <p>
            By using ZORIQ, you confirm that you have read, understood, and
            agreed to these Terms. If you do not agree to these terms, please do
            not use the platform or its tools.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            2. Permitted Use of Tools
          </h2>
          <p>
            ZORIQ grants you a personal, non-transferable, and non-exclusive
            license to use our suite of utility tools for personal, academic, or
            professional reasons.
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>
              You may not use our tools to process malicious or illegal files.
            </li>
            <li>
              You may not reverse-engineer, scrape, or extract source code.
            </li>
            <li>
              You may not run automated scripts (bots) to spam the utility
              inputs.
            </li>
          </ul>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            3. Disclaimer of Warranties
          </h2>
          <p>
            ZORIQ and all of its tools are provided on an **&quot;as is&quot;**
            and **&quot;as available&quot;** basis. We make no warranty that:
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>The tools will meet your exact requirements.</li>
            <li>The conversions or formatting will be 100% accurate.</li>
            <li>The platform will remain uninterrupted or error-free.</li>
          </ul>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            4. Limitation of Liability
          </h2>
          <p>
            Under no circumstances shall ZORIQ, its founders, or affiliates be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of the Site or any of our tools. This
            includes, without limitation, data loss, business interruption, or
            financial loss due to calculations (like loan EMI estimates).
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            5. Governing Law
          </h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of India, without regard to its conflict of
            law principles.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            6. Contact
          </h2>
          <p>
            If you have any questions, feedback, or concerns regarding these
            terms, please write to us at{" "}
            <a
              href="mailto:hello@zoriq.co.in"
              className="text-primary font-semibold hover:underline"
            >
              hello@zoriq.co.in
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
