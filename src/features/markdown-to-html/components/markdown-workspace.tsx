"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Download,
  Trash2,
  Code,
  Eye,
  Bold,
  Italic,
  Heading2,
  List,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const SAMPLE_MD = `# Welcome to ZORIQ Markdown Previewer

ZORIQ provides **fast**, *private*, and modern developer tools right in your browser.

## Features
* 100% Client-side execution
* Real-time HTML generation
* Clean semantic HTML5 output

### Quick Code Example
\`\`\`javascript
const greeting = "Hello, ZORIQ!";
console.log(greeting);
\`\`\`

> "Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra

Visit [ZORIQ Tools](https://www.zoriq.co.in) for more utilities.
`;

function markdownToHtml(md: string): string {
  let html = md
    // Escape special HTML chars in regular text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks
  html = html.replace(
    /```([a-z0-9_-]*)\n([\s\S]*?)```/g,
    (_match, _lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    },
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Blockquotes
  html = html.replace(/^\&gt; (.*$)/gim, "<blockquote>$1</blockquote>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Unordered list items
  html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gim, "<ul>$1</ul>");

  // Paragraphs
  const blocks = html.split(/\n\s*\n/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<blockquote")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n\n");

  return html;
}

export function MarkdownWorkspace() {
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const [activeTab, setActiveTab] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  const rawHtml = useMemo(() => {
    return markdownToHtml(markdown);
  }, [markdown]);

  const handleCopyHtml = async () => {
    const success = await copyToClipboard(rawHtml);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const fullHtmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a202c; }
    pre { background: #f7fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; }
    blockquote { border-left: 4px solid #8b5cf6; margin: 0; padding-left: 16px; color: #4a5568; }
    code { font-family: monospace; background: #edf2f7; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
${rawHtml}
</body>
</html>`;

    const blob = new Blob([fullHtmlDoc], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "zoriq-document.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insertSyntax = (before: string, after: string = "") => {
    setMarkdown((prev) => prev + `\n${before}Text${after}`);
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-5">
        {/* Top Action & Toolbar */}
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          {/* Quick Insert Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertSyntax("**", "**")}
              className="border-border bg-muted/20 hover:bg-muted text-foreground rounded-lg border p-2 text-xs"
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("*", "*")}
              className="border-border bg-muted/20 hover:bg-muted text-foreground rounded-lg border p-2 text-xs"
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("## ")}
              className="border-border bg-muted/20 hover:bg-muted text-foreground rounded-lg border p-2 text-xs"
              title="Heading"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("* ")}
              className="border-border bg-muted/20 hover:bg-muted text-foreground rounded-lg border p-2 text-xs"
              title="Bullet List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("```javascript\n", "\n```")}
              className="border-border bg-muted/20 hover:bg-muted text-foreground rounded-lg border p-2 text-xs"
              title="Code Block"
            >
              <Code className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              Download .html
            </button>
            <button
              type="button"
              onClick={handleCopyHtml}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied HTML" : "Copy HTML"}
            </button>
            <button
              type="button"
              onClick={() => setMarkdown("")}
              className="text-muted-foreground hover:text-destructive rounded p-1.5"
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Split Screen Editor & Output */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Markdown Input */}
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              Markdown Editor
            </span>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={18}
              className="border-border bg-muted/10 focus:border-primary w-full resize-y rounded-xl border p-4 font-mono text-xs leading-relaxed outline-none sm:text-sm"
              placeholder="Write your markdown here..."
            />
          </div>

          {/* Live Preview / HTML Tab */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="bg-muted/30 border-border/40 flex items-center rounded-lg border p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${
                    activeTab === "preview"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  Visual Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("html")}
                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${
                    activeTab === "html"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="h-3 w-3" />
                  Raw HTML
                </button>
              </div>
            </div>

            {activeTab === "preview" ? (
              <div
                className="border-border bg-muted/15 prose dark:prose-invert max-h-[460px] min-h-[360px] max-w-none overflow-auto rounded-xl border p-5 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: rawHtml }}
              />
            ) : (
              <textarea
                readOnly
                value={rawHtml}
                rows={18}
                className="border-border bg-muted/20 text-foreground w-full resize-y rounded-xl border p-4 font-mono text-xs leading-relaxed outline-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
