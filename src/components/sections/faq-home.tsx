import { FAQSection } from "@/components/shared/faq-section";
import type { FAQ } from "@/types/tool";

const homeFAQs: FAQ[] = [
  {
    question: "Is ZORIQ really free to use?",
    answer:
      "Yes, ZORIQ is 100% free to use. All tools are available without any sign-up, subscription, or credit card. We believe essential online tools should be accessible to everyone.",
  },
  {
    question: "Are my files safe? Do you store my data?",
    answer:
      "Absolutely. Most ZORIQ tools run entirely in your browser using client-side processing. Your files never leave your device and are never uploaded to our servers. We take privacy seriously — no data collection, no tracking of your files.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. ZORIQ works completely anonymously. You can use any tool immediately without signing up, logging in, or providing any personal information.",
  },
  {
    question: "What types of tools does ZORIQ offer?",
    answer:
      "ZORIQ offers a growing collection of online utilities including developer tools (JSON formatter, UUID generator, password generator), image tools (compressor, converter), student tools (word counter, age calculator), finance tools (EMI calculator), and more. We're constantly adding new tools.",
  },
  {
    question: "How is ZORIQ different from other online tool platforms?",
    answer:
      "ZORIQ is built with a focus on speed, privacy, and design quality. Unlike most platforms, our tools process everything in your browser — no file uploads, no waiting for server responses. Every tool is designed to be beautiful, accessible, and instant.",
  },
  {
    question: "Can I use ZORIQ on my phone?",
    answer:
      "Yes! ZORIQ is fully responsive and works beautifully on all devices — phones, tablets, and desktops. All tools are optimized for touch interactions and mobile screens.",
  },
];

export function FAQHome() {
  return (
    <FAQSection
      faqs={homeFAQs}
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about ZORIQ"
    />
  );
}
