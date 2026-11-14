// Tiny builder that turns a simple article description into Payload Lexical JSON.
/* eslint-disable @typescript-eslint/no-explicit-any */
const text = (t: string, bold = false) => ({ type: "text", version: 1, text: t, format: bold ? 1 : 0, mode: "normal", style: "", detail: 0 });

// "Text mit **Fettdruck** und [Link](/pfad)" -> text and link nodes
const link = (label: string, url: string) => ({
  type: "link",
  version: 3,
  format: "",
  indent: 0,
  direction: "ltr",
  fields: { linkType: "custom", url, newTab: url.startsWith("http") },
  children: [text(label)],
});
const inline = (s: string) =>
  s
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("**")) return text(part.slice(2, -2), true);
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) return link(m[1], m[2]);
      return text(part);
    });

const base = { version: 1, format: "", indent: 0, direction: "ltr" };

export const h2 = (s: string) => ({ ...base, type: "heading", tag: "h2", children: [text(s)] });
export const h3 = (s: string) => ({ ...base, type: "heading", tag: "h3", children: [text(s)] });
export const p = (s: string) => ({ ...base, type: "paragraph", children: inline(s) });
export const ul = (items: string[]) => list(items, "bullet");
export const ol = (items: string[]) => list(items, "number");

function list(items: string[], listType: "bullet" | "number") {
  return {
    ...base,
    type: "list",
    listType,
    tag: listType === "bullet" ? "ul" : "ol",
    start: 1,
    children: items.map((s, i) => ({ ...base, type: "listitem", value: i + 1, children: inline(s) })),
  };
}

export const table = (rows: string[][]) => ({
  ...base,
  type: "table",
  children: rows.map((r, ri) => ({
    version: 1,
    type: "tablerow",
    children: r.map((c) => ({ version: 1, type: "tablecell", headerState: ri === 0 ? 1 : 0, colSpan: 1, rowSpan: 1, backgroundColor: null, children: [p(c)] })),
  })),
});

let n = 0;
const id = () => `b${Date.now().toString(36)}${n++}`;
const block = (fields: Record<string, unknown>) => ({ type: "block", version: 2, format: "", fields: { id: id(), ...fields } });

export const callout = (kind: "info" | "tip" | "warn" | "legal", title: string, t: string) => block({ blockType: "callout", kind, title, text: t });
export const steps = (items: string[]) => block({ blockType: "steps", steps: items.map((t) => ({ text: t })) });
export const affiliateCta = (softwareId: number | string, t: string) => block({ blockType: "affiliateCta", software: softwareId, text: t });

export const doc = (children: any[]) => ({ root: { type: "root", version: 1, format: "", indent: 0, direction: "ltr", children } });
