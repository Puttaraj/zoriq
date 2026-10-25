"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface JsonTreeViewProps {
  data: unknown;
  name?: string;
  isLast?: boolean;
}

export function JsonTreeView({ data, name, isLast = true }: JsonTreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (data === null) {
    return (
      <div className="font-mono text-xs leading-relaxed">
        {name && (
          <span className="text-foreground font-semibold">"{name}": </span>
        )}
        <span className="font-bold text-amber-500">null</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <div className="font-mono text-xs leading-relaxed">
        {name && (
          <span className="text-foreground font-semibold">"{name}": </span>
        )}
        <span className="font-bold text-purple-500">
          {data ? "true" : "false"}
        </span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (typeof data === "number") {
    return (
      <div className="font-mono text-xs leading-relaxed">
        {name && (
          <span className="text-foreground font-semibold">"{name}": </span>
        )}
        <span className="font-bold text-blue-500">{data}</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (typeof data === "string") {
    return (
      <div className="font-mono text-xs leading-relaxed">
        {name && (
          <span className="text-foreground font-semibold">"{name}": </span>
        )}
        <span className="text-emerald-600 dark:text-emerald-400">"{data}"</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div className="font-mono text-xs leading-relaxed">
          {name && (
            <span className="text-foreground font-semibold">"{name}": </span>
          )}
          <span className="text-muted-foreground">[]</span>
          {!isLast && <span className="text-muted-foreground">,</span>}
        </div>
      );
    }

    return (
      <div className="font-mono text-xs leading-relaxed">
        <div
          onClick={toggleExpand}
          className="hover:bg-muted/40 inline-flex cursor-pointer items-center gap-1 rounded px-1 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="text-muted-foreground h-3 w-3" />
          ) : (
            <ChevronRight className="text-muted-foreground h-3 w-3" />
          )}
          {name && (
            <span className="text-foreground font-semibold">"{name}": </span>
          )}
          <span className="text-muted-foreground font-semibold">
            Array[{data.length}]
          </span>
        </div>
        {isExpanded && (
          <div className="border-border/40 ml-3.5 border-l pl-3">
            {data.map((item, idx) => (
              <JsonTreeView
                key={idx}
                data={item}
                name={String(idx)}
                isLast={idx === data.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return (
        <div className="font-mono text-xs leading-relaxed">
          {name && (
            <span className="text-foreground font-semibold">"{name}": </span>
          )}
          <span className="text-muted-foreground">{"{}"}</span>
          {!isLast && <span className="text-muted-foreground">,</span>}
        </div>
      );
    }

    return (
      <div className="font-mono text-xs leading-relaxed">
        <div
          onClick={toggleExpand}
          className="hover:bg-muted/40 inline-flex cursor-pointer items-center gap-1 rounded px-1 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="text-muted-foreground h-3 w-3" />
          ) : (
            <ChevronRight className="text-muted-foreground h-3 w-3" />
          )}
          {name && (
            <span className="text-foreground font-semibold">"{name}": </span>
          )}
          <span className="text-muted-foreground font-semibold">
            {"{"}...{"}"} ({keys.length} keys)
          </span>
        </div>
        {isExpanded && (
          <div className="border-border/40 ml-3.5 border-l pl-3">
            {keys.map((key, idx) => (
              <JsonTreeView
                key={key}
                data={(data as Record<string, unknown>)[key]}
                name={key}
                isLast={idx === keys.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
