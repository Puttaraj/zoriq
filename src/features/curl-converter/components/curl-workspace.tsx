"use client";

import { useState, useMemo } from "react";
import { Terminal, Copy, Check, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type TargetLang = "fetch" | "axios" | "python" | "go" | "node";

const SAMPLE_CURL = `curl -X POST https://api.zoriq.co.in/v1/tools \\
  -H "Authorization: Bearer sk-sample-token-123" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "compress", "quality": 85}'`;

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data: string | null;
}

function parseCurl(curlCommand: string): ParsedCurl {
  const clean = curlCommand.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim();
  let method = "GET";
  let url = "https://example.com";
  const headers: Record<string, string> = {};
  let data: string | null = null;

  // Extract URL
  const urlMatch = clean.match(
    /(?:curl\s+)?(?:['"])(https?:\/\/[^'"]+)(?:['"])|(?:curl\s+)(https?:\/\/\S+)/i,
  );
  if (urlMatch) {
    url = urlMatch[1] || urlMatch[2];
  } else {
    const rawUrl = clean
      .split(" ")
      .find((arg) => arg.startsWith("http://") || arg.startsWith("https://"));
    if (rawUrl) url = rawUrl.replace(/['"]/g, "");
  }

  // Extract Method
  const methodMatch = clean.match(/(?:-X|--request)\s+([A-Z]+)/i);
  if (methodMatch) {
    method = methodMatch[1].toUpperCase();
  }

  // Extract Headers
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
  let hMatch: RegExpExecArray | null;
  while ((hMatch = headerRegex.exec(clean)) !== null) {
    const headerPair = hMatch[1];
    const colonIndex = headerPair.indexOf(":");
    if (colonIndex !== -1) {
      const key = headerPair.slice(0, colonIndex).trim();
      const val = headerPair.slice(colonIndex + 1).trim();
      headers[key] = val;
    }
  }

  // Extract Data
  const dataMatch = clean.match(
    /(?:-d|--data|--data-raw|--data-binary)\s+['"]([\s\S]*?)['"](?:\s+-[a-zA-Z]|$)/,
  );
  if (dataMatch) {
    data = dataMatch[1];
    if (method === "GET") method = "POST";
  }

  return { url, method, headers, data };
}

function generateCode(parsed: ParsedCurl, lang: TargetLang): string {
  const { url, method, headers, data } = parsed;

  let parsedJson: unknown = null;
  if (data) {
    try {
      parsedJson = JSON.parse(data);
    } catch {
      parsedJson = null;
    }
  }

  switch (lang) {
    case "fetch": {
      const headerLines = Object.entries(headers)
        .map(([k, v]) => `    "${k}": "${v}",`)
        .join("\n");

      let bodyLine = "";
      if (data) {
        bodyLine = parsedJson
          ? `\n  body: JSON.stringify(${JSON.stringify(parsedJson, null, 2).replace(/\n/g, "\n  ")}),`
          : `\n  body: ${JSON.stringify(data)},`;
      }

      return `async function sendRequest() {
  const response = await fetch("${url}", {
    method: "${method}",
    headers: {
${headerLines || '    "Content-Type": "application/json",'}
    },${bodyLine}
  });

  const data = await response.json();
  console.log(data);
  return data;
}

sendRequest();`;
    }

    case "axios": {
      const headerLines = Object.entries(headers)
        .map(([k, v]) => `      "${k}": "${v}",`)
        .join("\n");

      const dataLine = parsedJson
        ? `\n    data: ${JSON.stringify(parsedJson, null, 2).replace(/\n/g, "\n    ")},`
        : data
          ? `\n    data: ${JSON.stringify(data)},`
          : "";

      return `import axios from "axios";

async function sendRequest() {
  const response = await axios({
    method: "${method.toLowerCase()}",
    url: "${url}",${dataLine}
    headers: {
${headerLines}
    },
  });

  console.log(response.data);
  return response.data;
}

sendRequest();`;
    }

    case "python": {
      const headerLines = Object.entries(headers)
        .map(([k, v]) => `    "${k}": "${v}",`)
        .join("\n");

      let payloadLine = "";
      if (parsedJson) {
        payloadLine = `\npayload = ${JSON.stringify(parsedJson, null, 4)}\n`;
      } else if (data) {
        payloadLine = `\npayload = "${data}"\n`;
      }

      const param = parsedJson
        ? ", json=payload"
        : data
          ? ", data=payload"
          : "";

      return `import requests
${payloadLine}
headers = {
${headerLines}
}

response = requests.${method.toLowerCase()}(
    "${url}",
    headers=headers${param}
)

print(response.status_code)
print(response.json())`;
    }

    case "go": {
      let bodyReader = "nil";
      let bodySetup = "";
      if (data) {
        bodySetup = `\n\tpayload := strings.NewReader(\`${data}\`)\n`;
        bodyReader = "payload";
      }

      const headerLines = Object.entries(headers)
        .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
        .join("\n");

      return `package main

import (
\t"fmt"
\t"io"
\t"net/http"
\t"strings"
)

func main() {${bodySetup}
\treq, err := http.NewRequest("${method}", "${url}", ${bodyReader})
\tif err != nil {
\t\tpanic(err)
\t}

${headerLines}

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`;
    }

    case "node": {
      const headerLines = Object.entries(headers)
        .map(([k, v]) => `    "${k}": "${v}",`)
        .join("\n");

      return `const https = require("https");

const data = ${data ? JSON.stringify(data) : '""'};

const options = {
  method: "${method}",
  headers: {
${headerLines}
  },
};

const req = https.request("${url}", options, (res) => {
  let chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => console.log(Buffer.concat(chunks).toString()));
});

${data ? "req.write(data);" : ""}
req.end();`;
    }
  }
}

export function CurlWorkspace() {
  const [curlInput, setCurlInput] = useState(SAMPLE_CURL);
  const [activeLang, setActiveLang] = useState<TargetLang>("fetch");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    return parseCurl(curlInput);
  }, [curlInput]);

  const outputCode = useMemo(() => {
    return generateCode(parsed, activeLang);
  }, [parsed, activeLang]);

  const handleCopy = async () => {
    const success = await copyToClipboard(outputCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Input Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Terminal className="text-primary h-4 w-4" />
              Raw cURL Command Input
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurlInput(SAMPLE_CURL)}
                className="text-primary text-xs font-semibold hover:underline"
              >
                Load Sample
              </button>
              <button
                type="button"
                onClick={() => setCurlInput("")}
                className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-xs font-semibold"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            rows={5}
            className="border-border/80 bg-muted/10 focus:border-primary w-full rounded-xl border p-3 font-mono text-xs leading-relaxed outline-none"
            placeholder="Paste your cURL command here (e.g. curl -X POST https://...)"
          />
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex flex-col gap-3">
          <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div className="bg-muted/30 border-border/40 flex items-center rounded-xl border p-1">
              {[
                { id: "fetch", label: "JavaScript (Fetch)" },
                { id: "axios", label: "Axios" },
                { id: "python", label: "Python (Requests)" },
                { id: "go", label: "Go (net/http)" },
                { id: "node", label: "Node.js (https)" },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setActiveLang(lang.id as TargetLang)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeLang === lang.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied Snippet" : "Copy Code"}
            </button>
          </div>

          {/* Generated Code Output Box */}
          <div className="relative">
            <pre className="border-border bg-muted/20 text-foreground max-h-[380px] overflow-auto rounded-xl border p-4 font-mono text-xs leading-relaxed">
              {outputCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
