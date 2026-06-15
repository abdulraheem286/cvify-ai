import type { ReactNode } from "react";

// Lightweight, safe rich-text rendering for CV content.
// Supports **bold**, *italic*, and [text](url) — parsed into real React nodes
// (no dangerouslySetInnerHTML, so user input can't inject markup).
// renderRich also turns lines starting with "- " / "* " into bullet lines and
// keeps line breaks — and stays valid inside a <p> (uses "•" + <br>, not <ul>).

const TOKEN = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      nodes.push(<strong key={`${keyPrefix}-${i}`}>{m[2]}</strong>);
    } else if (m[3]) {
      nodes.push(<em key={`${keyPrefix}-${i}`}>{m[4]}</em>);
    } else if (m[5]) {
      const href = /^https?:\/\//.test(m[7]) ? m[7] : `https://${m[7]}`;
      nodes.push(
        <a key={`${keyPrefix}-${i}`} href={href} target="_blank" rel="noreferrer" className="text-[var(--primary)] underline">
          {m[6]}
        </a>,
      );
    }
    last = TOKEN.lastIndex;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Single line / inline only (used for experience bullets, titles).
export function renderInline(text: string): ReactNode {
  if (!text) return text;
  return inline(text, "i");
}

// Multi-line block (used for summary, custom-section descriptions).
export function renderRich(text: string): ReactNode {
  if (!text) return text;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const bullet = /^\s*[-*]\s+/.test(line);
    const content = bullet ? line.replace(/^\s*[-*]\s+/, "") : line;
    return (
      <span key={idx}>
        {bullet ? "• " : null}
        {inline(content, `l${idx}`)}
        {idx < lines.length - 1 ? <br /> : null}
      </span>
    );
  });
}
