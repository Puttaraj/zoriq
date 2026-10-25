export const seoContent = `
## Base64 Image & File Encoder / Decoder
Easily encode any image, file, or string into Base64 format or decode Base64 strings back to their original file formats. Designed for web developers, designers, and software engineers who need inline data URIs for CSS, HTML, and API payloads.

## Key Features
* **Zero Upload Privacy:** 100% in-browser processing via the HTML5 FileReader API. Your images and documents never leave your local machine.
* **Multiple Output Formats:** Instant conversion to Raw Base64, Data URI, CSS \`background-image\`, and HTML \`<img>\` tag.
* **Bidirectional Decoding:** Paste any valid Base64 string to preview the decoded asset and download it as a file.
* **Clipboard Paste Support:** Press Ctrl+V / Cmd+V anywhere to encode screenshots directly from your clipboard.
`;

export const faqs = [
  {
    question: "What is Base64 encoding?",
    answer:
      "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is commonly used to embed images directly into HTML, CSS, or JSON without requiring separate HTTP requests.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. All encoding and decoding runs 100% locally in your browser using client-side JavaScript. ZORIQ never stores, transmits, or inspects your files.",
  },
  {
    question: "Does Base64 increase file size?",
    answer:
      "Yes. Base64 encoding increases binary file size by approximately 33%. It is best used for small icons, fonts, and inline assets under 50KB to reduce HTTP request overhead.",
  },
];

export { Base64Workspace } from "./components/base64-workspace";
