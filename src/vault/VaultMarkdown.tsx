import { Fragment } from "react";

// ── Inline rendering ────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) {
      parts.push(<strong key={key++}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      parts.push(<em key={key++}>{m[2]}</em>);
    } else if (m[3] !== undefined) {
      parts.push(
        <span key={key++} className="text-phosphor">
          {m[3]}
        </span>,
      );
    } else if (m[4] !== undefined) {
      parts.push(
        <a
          key={key++}
          href={m[5]}
          className="text-phosphor hover:text-phosphor/70 transition-colors"
        >
          {m[4]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// ── Document parser ──────────────────────────────────────────────────────────

type DocNode =
  | { kind: "rule"; text: string }
  | { kind: "head"; text: string }
  | { kind: "para"; text: string }
  | { kind: "br" }
  | { kind: "dim"; text: string }
  | { kind: "quote"; text: string };

function parse(md: string): DocNode[] {
  const nodes: DocNode[] = [];
  const lines = md.split("\n");
  let paraLines: string[] = [];

  function flushPara() {
    const t = paraLines.join(" ").trim();
    if (t) nodes.push({ kind: "para", text: t });
    paraLines = [];
  }

  for (const raw of lines) {
    if (raw.startsWith("## ")) {
      flushPara();
      nodes.push({ kind: "head", text: raw.slice(3) });
    } else if (raw.startsWith("> ")) {
      flushPara();
      nodes.push({ kind: "rule", text: raw.slice(2) });
    } else if (raw.startsWith("-- ")) {
      flushPara();
      nodes.push({ kind: "dim", text: raw.slice(3) });
    } else if (raw.startsWith("| ")) {
      flushPara();
      nodes.push({ kind: "quote", text: raw.slice(2) });
    } else if (raw === "|") {
      flushPara();
      nodes.push({ kind: "br" });
    } else if (raw.trim() === "[br]") {
      flushPara();
      nodes.push({ kind: "br" });
    } else if (raw.trim() === "") {
      flushPara();
    } else {
      paraLines.push(raw);
    }
  }
  flushPara();
  return nodes;
}

// ── Renderer ─────────────────────────────────────────────────────────────────

interface VaultMarkdownProps {
  text: string;
  sectionClass?: string; // default "mb-8"
}

export function VaultMarkdown({ text, sectionClass = "mb-8" }: VaultMarkdownProps) {
  const nodes = parse(text);
  const rendered: React.ReactNode[] = [];
  let k = 0;

  // Group rule nodes into consecutive blocks (intro paragraphs separated by blank lines)
  // and sections demarcated by heads
  let i = 0;

  // Collect leading rule groups (before first head)
  while (i < nodes.length && nodes[i].kind !== "head") {
    const node = nodes[i];
    if (node.kind === "rule") {
      // Collect consecutive rule nodes into a group
      const group: string[] = [];
      while (i < nodes.length && nodes[i].kind === "rule") {
        group.push((nodes[i] as { kind: "rule"; text: string }).text);
        i++;
      }
      rendered.push(
        <div key={k++} className="pl-2 mb-6">
          {group.map((t, gi) => (
            <p key={gi} className="mb-1">
              <span className="text-phosphor">&gt; </span>
              {renderInline(t)}
            </p>
          ))}
        </div>,
      );
    } else if (node.kind === "para") {
      rendered.push(<p key={k++}>{renderInline(node.text)}</p>);
      i++;
    } else {
      i++;
    }
  }

  // Process sections
  while (i < nodes.length) {
    const node = nodes[i];
    if (node.kind !== "head") { i++; continue; }

    const headText = (node as { kind: "head"; text: string }).text;
    i++;

    // Collect body nodes until next head
    const bodyNodes: DocNode[] = [];
    while (i < nodes.length && nodes[i].kind !== "head") {
      bodyNodes.push(nodes[i]);
      i++;
    }

    // Determine if body uses space-y-4 (only para/br nodes) or br-separated paragraphs
    const hasBr = bodyNodes.some((n) => n.kind === "br");

    const bodyElems = bodyNodes.map((bn, bi) => {
      switch (bn.kind) {
        case "para":
          return <p key={bi}>{renderInline(bn.text)}</p>;
        case "br":
          return <br key={bi} />;
        case "dim":
          return (
            <p key={bi} className="text-phosphor-dim mt-4">
              {renderInline(bn.text)}
            </p>
          );
        case "quote":
          return (
            <p key={bi} className="text-foreground/70 pl-3 border-l border-border/50">
              {renderInline(bn.text)}
            </p>
          );
        case "rule":
          return (
            <p key={bi} className="mb-1">
              <span className="text-phosphor">&gt; </span>
              {renderInline(bn.text)}
            </p>
          );
        default:
          return null;
      }
    });

    rendered.push(
      <div key={k++} className={sectionClass}>
        <p className="text-phosphor-dim mb-3">// {headText}</p>
        <div className={`pl-2${hasBr ? "" : " space-y-4"}`}>{bodyElems}</div>
      </div>,
    );
  }

  return <>{rendered}</>;
}
