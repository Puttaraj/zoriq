import { HeroSection } from "@/components/sections/hero-section";
import { PopularTools } from "@/components/sections/popular-tools";
import { FeaturedTools } from "@/components/sections/featured-tools";
import { CategoriesSection } from "@/components/sections/categories-section";
import { CTASection } from "@/components/sections/cta-section";
import { RoadmapSection } from "@/components/sections/roadmap-section";
import { FAQHome } from "@/components/sections/faq-home";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateFAQSchema,
  generateSiteNavigationSchema,
} from "@/lib/seo";

const homeFAQs = [
  {
    question: "Is ZORIQ really free to use?",
    answer:
      "Yes, ZORIQ is 100% free. All tools are available without sign-up, subscription, or credit card.",
  },
  {
    question: "Are my files safe?",
    answer:
      "Absolutely. Most tools run in your browser. Your files never leave your device.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. ZORIQ works anonymously. No sign-up required.",
  },
  {
    question: "What tools does ZORIQ offer?",
    answer:
      "Developer tools, image tools, student tools, finance tools, and more. Growing every week.",
  },
  {
    question: "Can I use ZORIQ on my phone?",
    answer: "Yes! Fully responsive on all devices.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(homeFAQs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSiteNavigationSchema()),
        }}
      />

      <HeroSection />
      <PopularTools />
      <FeaturedTools />
      <CategoriesSection />
      <CTASection />
      <RoadmapSection />
      <FAQHome />
    </>
  );
}
