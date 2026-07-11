export { CompressorWorkspace } from "./components/compressor-workspace";
export const seoContent = `
## Why You Need an Image Compressor
Heavy images are the primary cause of slow page load times. Large file sizes increase bandwidth consumption and hurt your SEO rankings. By using an image size reducer, you can compress JPEGs, PNGs, and WebPs by up to 80% without losing visible quality.

## How Browser-Based Compression Works
Unlike older tools that upload files to their servers, ZORIQ uses modern web technologies (HTML5 Canvas and Web Workers) to compress your photos directly within your web browser. 
* **Web Workers:** The processing runs on a separate browser thread. Your active browser tab won't freeze or lag while handling high-resolution photos.
* **Canvas API:** The algorithm rescales and re-samples pixels, stripping unnecessary metadata and optimization layers to rebuild a lighter image.

## Benefits of ZORIQ Image Compressor
* **Zero Uploads:** Complete safety and confidentiality. Your private photos, screenshots, or design assets are never uploaded or stored on our servers.
* **Adjustable Quality:** Tweak the slider to balance file size against visual resolution. Setting the slider around 80% yields high compression ratios with virtually no noticeable difference.
* **Speed:** Images compress instantly in milliseconds without server queues or download delays.
`;

export const faqs = [
  {
    question: "Will my compressed image lose visual quality?",
    answer:
      "Our compressor uses lossy compression algorithms which selectively discard non-essential data. Setting the quality slider to 75%-85% achieves up to an 80% file size reduction with almost zero visible loss of clarity.",
  },
  {
    question: "Is there an upload limit?",
    answer:
      "Our limit is set to 10 MB per file. High-resolution images from cameras can be processed as long as they stay below this threshold.",
  },
  {
    question: "Do you store any copy of my uploaded photos?",
    answer:
      "No. Since all operations run locally inside your browser tab (client-side), no server ever receives your images. Your privacy is fully guaranteed.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "We support the three most popular web image formats: JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp).",
  },
  {
    question: "How does ZORIQ handle batch compression?",
    answer:
      "In Phase 1, we optimize for single file compression. Batch compression (processing up to 20 files at once and downloading them as a ZIP) is planned in our next release roadmap.",
  },
];
