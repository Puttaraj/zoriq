/**
 * ZORIQ — Navigation Configuration
 */

import type { NavLink, NavSection } from "@/types/tool";

/** Main header navigation links */
export const mainNav: NavLink[] = [
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/about" },
];

/** Footer navigation sections */
export const footerNav: NavSection[] = [
  {
    title: "Popular Tools",
    links: [
      { label: "Image Compressor", href: "/tools/image-compressor" },
      { label: "Password Generator", href: "/tools/password-generator" },
      { label: "QR Code Generator", href: "/tools/qr-generator" },
      { label: "JSON Formatter", href: "/tools/json-formatter" },
      { label: "EMI Calculator", href: "/tools/emi-calculator" },
      { label: "Word Counter", href: "/tools/word-counter" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Developer Tools", href: "/tools?category=developer" },
      { label: "Image Tools", href: "/tools?category=image" },
      { label: "Student Tools", href: "/tools?category=student" },
      { label: "Finance Tools", href: "/tools?category=finance" },
      { label: "PDF Tools (Coming Soon)", href: "#" },
      { label: "AI Tools (Coming Soon)", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
