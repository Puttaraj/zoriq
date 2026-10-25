export const seoContent = `
## Regex Tester & Visualizer Online
Test, debug, and validate JavaScript regular expressions with real-time pattern matching, visual capture group breakdowns, and string substitution preview.

## Supported Flags
* **g (Global):** Find all matches rather than stopping after the first match.
* **i (Case Insensitive):** Match characters regardless of uppercase or lowercase.
* **m (Multiline):** Treat beginning and end assertions (\`^\` and \`$\`) as working across each line.
* **s (dotAll):** Allows \`.\` to match newline characters.
* **u (Unicode):** Treat the pattern as a sequence of Unicode code points.

## Key Features
* **Real-Time Match Highlighting:** Instant visual feedback as you type your pattern or test string.
* **Capturing Groups Breakdown:** View indexed capture groups (\`$1\`, \`$2\`) and named capture groups with exact string slices.
* **Replacement Preview:** Test regex find-and-replace patterns interactively.
* **100% Client-Side:** Evaluated directly in your browser's JavaScript V8 engine with zero data uploaded.
`;

export const faqs = [
  {
    question: "Which Regex flavor does this tester use?",
    answer:
      "This tool uses the standard ECMAScript (JavaScript) RegExp engine built into your web browser, which is directly compatible with Node.js, modern web browsers, and frontend frameworks.",
  },
  {
    question: "How do I reference capture groups in replacement strings?",
    answer:
      "Use $1, $2, etc., to refer to parenthesized capture groups. For example, replacing '(\\w+) (\\w+)' with '$2, $1' inverts first and last names.",
  },
  {
    question:
      "Is there any risk of ReDoS (Regular Expression Denial of Service)?",
    answer:
      "Because computation runs 100% client-side in your own browser tab, your machine is in complete control. We include automatic timeout safeguards to prevent runaway backtracking.",
  },
];

export { RegexWorkspace } from "./components/regex-workspace";
