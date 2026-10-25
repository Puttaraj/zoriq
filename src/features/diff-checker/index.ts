export const seoContent = `
## Diff / Text Compare Online
Compare two text blocks or code snippets side-by-side with instant, color-coded line-by-line difference detection. Fast, private, and 100% browser-based.

## Key Features
* **Side-by-Side & Unified Modes:** View comparisons in dual-pane columns or a unified single-feed changelog.
* **Character & Line Precision:** Pinpoint additions (+), deletions (-), and modified lines with line numbering.
* **Whitespace & Case Options:** Toggle ignore whitespace or ignore case for cleaner comparisons.
* **100% In-Browser Privacy:** Your text is compared in memory without ever hitting a remote server.
`;

export const faqs = [
  {
    question: "Can I use this tool for source code diffs?",
    answer:
      "Yes. The diff checker works seamlessly on Python, JavaScript, CSS, HTML, SQL, and plain text files.",
  },
  {
    question: "Is there a limit on how much text I can compare?",
    answer:
      "Because processing executes client-side using an optimized diff algorithm, you can compare documents with thousands of lines instantaneously.",
  },
  {
    question: "Are my comparisons saved anywhere?",
    answer:
      "No. Everything is stored strictly in your browser's temporary memory and is erased as soon as you close or refresh the tab.",
  },
];

export { DiffWorkspace } from "./components/diff-workspace";
