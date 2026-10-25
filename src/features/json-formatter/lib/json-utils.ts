/**
 * JSON Formatter Utility Helpers
 * TypeScript generator, JSON Diff, and escaping utilities
 */

export interface DiffResult {
  path: string;
  type: "added" | "removed" | "changed" | "unchanged";
  oldValue?: string;
  newValue?: string;
}

export function escapeJsonString(jsonStr: string): string {
  try {
    // If it's valid JSON, format it minified first then escape
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(JSON.stringify(parsed));
  } catch {
    return JSON.stringify(jsonStr);
  }
}

export function jsonToTypeScript(
  obj: unknown,
  rootName = "RootObject",
): string {
  const interfaces: Map<string, string> = new Map();

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getType(value: unknown, keyName: string): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") return "string";

    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]";
      const itemType = getType(value[0], keyName + "Item");
      return `${itemType}[]`;
    }

    if (typeof value === "object") {
      const interfaceName = capitalize(keyName);
      generateInterface(value as Record<string, unknown>, interfaceName);
      return interfaceName;
    }

    return "unknown";
  }

  function generateInterface(
    record: Record<string, unknown>,
    name: string,
  ): void {
    if (interfaces.has(name)) return;

    const lines: string[] = [];
    lines.push(`export interface ${name} {`);

    for (const [key, val] of Object.entries(record)) {
      const sanitizedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      const valType = getType(val, key);
      lines.push(`  ${sanitizedKey}: ${valType};`);
    }

    lines.push("}");
    interfaces.set(name, lines.join("\n"));
  }

  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    generateInterface(obj as Record<string, unknown>, rootName);
    return Array.from(interfaces.values()).reverse().join("\n\n");
  } else if (
    Array.isArray(obj) &&
    obj.length > 0 &&
    typeof obj[0] === "object"
  ) {
    generateInterface(obj[0] as Record<string, unknown>, rootName);
    return (
      Array.from(interfaces.values()).reverse().join("\n\n") +
      `\n\nexport type ${rootName}List = ${rootName}[];`
    );
  } else {
    return `export type ${rootName} = ${getType(obj, "Value")};`;
  }
}

export function computeJsonDiff(
  obj1: unknown,
  obj2: unknown,
  path = "",
): DiffResult[] {
  const diffs: DiffResult[] = [];

  const isObject = (val: unknown): val is Record<string, unknown> =>
    typeof val === "object" && val !== null && !Array.isArray(val);

  if (isObject(obj1) && isObject(obj2)) {
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    for (const key of keys) {
      const curPath = path ? `${path}.${key}` : key;
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (!(key in obj1)) {
        diffs.push({
          path: curPath,
          type: "added",
          newValue: JSON.stringify(val2, null, 2),
        });
      } else if (!(key in obj2)) {
        diffs.push({
          path: curPath,
          type: "removed",
          oldValue: JSON.stringify(val1, null, 2),
        });
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        if (isObject(val1) && isObject(val2)) {
          diffs.push(...computeJsonDiff(val1, val2, curPath));
        } else {
          diffs.push({
            path: curPath,
            type: "changed",
            oldValue: JSON.stringify(val1, null, 2),
            newValue: JSON.stringify(val2, null, 2),
          });
        }
      }
    }
  } else if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
    diffs.push({
      path: path || "root",
      type: "changed",
      oldValue: JSON.stringify(obj1, null, 2),
      newValue: JSON.stringify(obj2, null, 2),
    });
  }

  return diffs;
}
