export const seoContent = `
## SVG to PNG & WebP High-DPI Exporter
Convert scalable vector graphics (SVG) into crisp, high-resolution PNG and WebP raster images. Built for designers, developers, and content creators needing pixel-perfect exports for presentations, social media, and native mobile apps.

## Key Features
* **High-DPI Scale Multipliers:** Export crisp raster images at 1x, 2x (Retina), 3x, and 4x (Ultra HD 4K) resolutions without blurriness.
* **Transparent & Custom Backgrounds:** Retain transparent alpha channels or specify custom background fill colors.
* **Raw SVG Code or File Upload:** Drag and drop an \`.svg\` file or paste raw XML code directly.
* **100% Client-Side Canvas Rendering:** Processed locally using the HTML5 Canvas API with zero server uploads.
`;

export const faqs = [
  {
    question: "Why convert SVG to PNG or WebP?",
    answer:
      "While SVGs are ideal for responsive web icons, many third-party apps, social media platforms (Twitter, LinkedIn, Instagram), and video editing suites do not support vector SVG uploads. Converting to a high-DPI PNG provides maximum compatibility while preserving razor-sharp edges.",
  },
  {
    question: "Does this export support transparent backgrounds?",
    answer:
      "Yes. By default, transparency is fully preserved in both PNG and WebP formats. You can also choose solid white or black backgrounds.",
  },
  {
    question: "Can I paste raw SVG code directly?",
    answer:
      "Yes. You can paste raw SVG markup directly into the code tab to immediately render and export the raster image.",
  },
];

export { SvgWorkspace } from "./components/svg-workspace";
