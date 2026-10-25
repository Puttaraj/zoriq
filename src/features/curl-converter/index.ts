export const seoContent = `
## cURL to Fetch, Python, Axios & Go Code Converter
Instantly translate raw cURL command lines into production-ready client code for JavaScript (Fetch API & Axios), Python (Requests), Node.js, and Go.

## Supported cURL Flags
* **-X, --request:** HTTP Method (GET, POST, PUT, DELETE, PATCH).
* **-H, --header:** Custom headers, Authorization tokens, and Content-Types.
* **-d, --data, --data-raw:** JSON bodies and URL-encoded form payloads.
* **-u, --user:** Basic HTTP Authentication credentials.

## Key Features
* **Zero Network Requests:** Parsing and code generation execute 100% inside your browser. Your API keys and secrets are never logged or transmitted.
* **Modern Idiomatic Code:** Generates clean async/await Fetch API and Pythonic Requests snippets with proper error handling and typed headers.
* **1-Click Copy:** Fast clipboard copying for immediate pasting into Postman, IDEs, or codebase repositories.
`;

export const faqs = [
  {
    question: "Can I convert cURL commands copied from Chrome DevTools?",
    answer:
      "Yes. Right-click any network request in Chrome/Firefox DevTools, select 'Copy as cURL', and paste it directly into this tool. It will automatically extract the URL, method, headers, and body.",
  },
  {
    question: "Are my authorization tokens and API keys safe?",
    answer:
      "Yes. All conversion logic runs strictly client-side in your browser. Nothing is ever sent to a server.",
  },
  {
    question: "Does it support JSON request payloads?",
    answer:
      "Yes. If your cURL command includes JSON data via --data or -d, it will be automatically parsed and formatted into native JSON objects in JavaScript and Python dictionaries.",
  },
];

export { CurlWorkspace } from "./components/curl-workspace";
