export const seoContent = `
## Markdown to Clean HTML Converter & Live Previewer
Write, preview, and convert Markdown documents into clean, semantic HTML5 markup in real time. Perfect for web developers, technical writers, and content creators.

## Key Features
* **Real-Time Split-Screen Preview:** Instant live rendering as you type.
* **Semantic HTML Output:** Generates clean, accessible headings, paragraphs, code blocks, lists, and tables without bloated styling.
* **Copy or Download:** 1-click actions to copy formatted HTML, minified HTML, or download as an \`.html\` file.
* **100% In-Browser Privacy:** Zero network transmission — your drafts and sensitive notes stay strictly on your local device.
`;

export const faqs = [
  {
    question: "Does this converter support GitHub Flavored Markdown (GFM)?",
    answer:
      "Yes. Standard GitHub Flavored Markdown syntax including tables, fenced code blocks with language identifiers, task checklists, and strikethrough are fully supported.",
  },
  {
    question: "Can I download the output as a standalone HTML page?",
    answer:
      "Yes. You can click 'Download .html' to save a standalone HTML document complete with proper doctype, meta charset, and clean semantic structure.",
  },
  {
    question: "Is there any character or document length limit?",
    answer:
      "No. Processing executes entirely inside your browser's memory, allowing you to format large documentation files, READMEs, and blog articles instantly without length restrictions.",
  },
];

export { MarkdownWorkspace } from "./components/markdown-workspace";
