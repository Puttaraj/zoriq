export { ConverterWorkspace } from "./components/converter-workspace";
export const seoContent = `
## Why You Need an Image Converter
Different digital platforms require specific image formats for optimal performance. While PNGs are preferred for logos that require transparency, JPEGs are optimal for photorealistic images to maintain smaller sizes. WebP is a modern web format that combines the benefits of both (lossless compression, transparency support, and small sizes). Having a quick converter lets you adjust files in seconds.

## Browser-Based Canvas conversion
ZORIQ executes all format conversions completely inside your browser using the HTML5 Canvas API.
* **Format Mapping:** We draw the source file into an off-screen canvas and re-sample the pixels into a new destination Blob structure based on your selected MIME format.
* **Transparency Handling:** JPEGs do not support transparency. When converting a transparent PNG or WebP to JPEG, our algorithm automatically fills transparent regions with a white background to avoid rendering them as black blocks.

## Key Features
* **Format Flexibility:** Convert between PNG, JPEG, WebP, and BMP.
* **Lossy Quality Slider:** Control resolution sizes when exporting to JPEG or WebP formats.
* **High Privacy:** Your images are converted client-side in browser memory. No photos are ever uploaded, ensuring total data security.
`;

export const faqs = [
  {
    question: "How does the image converter work?",
    answer:
      "The tool loads your image into browser memory, draws it onto an off-screen HTML5 canvas element, and then exports that canvas to a new file format (Blob) using standard canvas methods.",
  },
  {
    question: "Is there any data sent to servers during conversion?",
    answer:
      "No. Since all canvas operations execute locally in your browser tab, your photos are never uploaded. This means total confidentiality and high processing speeds.",
  },
  {
    question: "What happens to transparency when converting PNG to JPEG?",
    answer:
      "Since JPEGs do not support transparency, our converter automatically paints a white background under any transparent areas before rendering to avoid dark blocks.",
  },
  {
    question: "Can I convert multiple images at once?",
    answer:
      "Our Phase 1 release supports single-file image conversion. Batch conversion capabilities are planned for Phase 2.",
  },
  {
    question: "Which formats can I convert from?",
    answer:
      "You can upload JPEG, PNG, WebP, and BMP images to convert them into any of those target formats.",
  },
];
