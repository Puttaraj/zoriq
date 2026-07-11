import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata(
  "Privacy Policy — ZORIQ",
  "Privacy policy for ZORIQ. Read about how our client-side browser tools respect your files and personal data.",
  "/privacy",
);

export default function PrivacyPage() {
  const lastUpdated = "July 11, 2026";

  return (
    <div className="container-tight py-12 md:py-16">
      <div className="prose dark:prose-invert mx-auto max-w-3xl">
        <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Last Updated: {lastUpdated}
        </p>

        <div className="text-muted-foreground mt-8 flex flex-col gap-6 text-sm leading-relaxed">
          <p>
            At ZORIQ, we value your privacy above everything else. This Privacy
            Policy outlines how we handle files, data, and information when you
            access our online utility platform located at{" "}
            <a
              href="https://zoriq.co.in"
              className="text-primary hover:underline"
            >
              https://zoriq.co.in
            </a>
            .
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            1. Client-Side Processing (Your Files Remain Local)
          </h2>
          <p>
            The core philosophy of ZORIQ is **client-side computation**. For the
            vast majority of our tools — including the Image Compressor, Image
            Converter, Password Generator, UUID Generator, JSON Formatter, QR
            Code Generator, Word Counter, Age Calculator, and EMI Calculator —
            all processing takes place entirely within your browser memory.
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>Your files are **never uploaded** to our backend servers.</li>
            <li>We do not store, copy, or cache your text inputs or files.</li>
            <li>
              Once you close the browser tab, the files are cleared from memory.
            </li>
          </ul>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            2. Personal Information We Collect
          </h2>
          <p>
            Since all tools are available anonymously, you are not required to
            log in, register, or create an account to use ZORIQ. If you contact
            us via email or using our feedback form, we collect your name, email
            address, and message text to respond to your support request.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            3. Web Analytics and Cookies
          </h2>
          <p>
            We use analytics services (such as Google Analytics 4 and Microsoft
            Clarity) to understand platform performance, traffic sources, and
            user navigation patterns. These cookies collect anonymous usage data
            (like browser versions, country locations, and page views) to help
            us optimize page load times and core web vitals.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            4. Google AdSense Advertising
          </h2>
          <p>
            We may display third-party advertisements on ZORIQ via Google
            AdSense. Google uses cookies to serve ads based on your visits to
            our site and other sites on the internet. You can opt out of
            personalized advertising by visiting your Google Ads Settings panel.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            5. Changes to This Policy
          </h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time. Any
            updates will be reflected on this page with the updated &quot;Last
            Updated&quot; timestamp at the top.
          </p>

          <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
            6. Contact Us
          </h2>
          <p>
            If you have any questions or feedback regarding this policy or our
            data handling practices, please reach out to us at{" "}
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
