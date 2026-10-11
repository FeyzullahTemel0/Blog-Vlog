import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    );
}

/** Basit içerik biçimlendirici: ## başlık, ### alt başlık, > alıntı, - liste, **kalın**, boş satır paragraf ayırıcı. */
export function renderContent(source: string): ReactNode[] {
  return source
    .trim()
    .split(/\n\s*\n/)
    .map((block, i) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length === 0) return null;
      const key = `block-${i}`;
      const first = lines[0];

      if (first.startsWith("### ")) {
        return <h3 key={key}>{inline(first.slice(4), key)}</h3>;
      }
      if (first.startsWith("## ")) {
        return <h2 key={key}>{inline(first.slice(3), key)}</h2>;
      }
      if (lines.every((line) => line.startsWith("> "))) {
        return <blockquote key={key}>{inline(lines.map((l) => l.slice(2)).join(" "), key)}</blockquote>;
      }
      if (lines.every((line) => line.startsWith("- "))) {
        return (
          <ul key={key}>
            {lines.map((line, j) => (
              <li key={`${key}-${j}`}>{inline(line.slice(2), `${key}-${j}`)}</li>
            ))}
          </ul>
        );
      }
      return <p key={key}>{inline(lines.join(" "), key)}</p>;
    });
}
