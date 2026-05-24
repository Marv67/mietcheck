"use client";

/**
 * Client-Insel fuer den Musterschreiben-Editor.
 *
 * Bekommt Vorlagen-Template und Platzhalter-Liste als Props (Server-
 * rendered). Rendert pro Platzhalter ein Input/Textarea, baut den
 * fertigen Brief live in einer Preview. Plus Copy- und Download-
 * Button.
 */

import { useMemo, useState } from "react";

type Platzhalter = { key: string; label: string; hint?: string; multiline: boolean };

export default function TemplateForm({
  template,
  placeholders,
  filename,
}: {
  template: string;
  placeholders: Platzhalter[];
  filename: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const rendered = useMemo(() => {
    return template.replace(/\[([^\]]+)\]/g, (full, inner) => {
      const v = values[inner.trim()];
      return v && v.trim() ? v : full;
    });
  }, [template, values]);

  const filled = placeholders.filter((p) => values[p.key]?.trim()).length;
  const total = placeholders.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rendered);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: textarea select
      const ta = document.createElement("textarea");
      ta.value = rendered;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rendered], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!doctype html>
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 680px; margin: 40px auto; padding: 24px; line-height: 1.6; color: #1C1B19; }
            pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 14px; }
          </style>
        </head>
        <body>
          <pre>${rendered.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* ───── Formular ───── */}
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>
          Felder ausfüllen ({filled} von {total})
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "grid", gap: 14 }}
        >
          {placeholders.map((p) => {
            const id = `f-${p.key.replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <div key={p.key} style={{ display: "grid", gap: 4 }}>
                <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {p.label}
                </label>
                {p.hint && (
                  <p style={{ fontSize: 11, color: "var(--dim)", fontStyle: "italic" }}>{p.hint}</p>
                )}
                {p.multiline ? (
                  <textarea
                    id={id}
                    value={values[p.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: 14,
                      lineHeight: 1.5,
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      background: "var(--card)",
                      color: "var(--fg)",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <input
                    id={id}
                    type="text"
                    value={values[p.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: 14,
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      background: "var(--card)",
                      color: "var(--fg)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </form>
      </section>

      {/* ───── Live-Preview ───── */}
      <section aria-labelledby="preview-heading">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <h2 id="preview-heading" style={{ fontSize: 18, fontWeight: 600 }}>Vorschau</h2>
          <p style={{ fontSize: 12, color: "var(--dim)" }}>
            {filled < total ? `Noch ${total - filled} Feld${total - filled === 1 ? "" : "er"} offen` : "Alle Felder ausgefüllt ✓"}
          </p>
        </div>
        <pre
          aria-live="polite"
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "18px 22px",
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: 14.5,
            lineHeight: 1.7,
            color: "var(--fg)",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowX: "auto",
            margin: 0,
          }}
        >
          {rendered}
        </pre>
      </section>

      {/* ───── Aktionen ───── */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" style={{ position: "absolute", left: -9999 }}>Schreiben verwenden</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: "var(--fg)",
              color: "var(--bg)",
              border: "none",
              padding: "12px 22px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: -0.2,
            }}
          >
            {copied ? "✓ Kopiert" : "In Zwischenablage kopieren"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              background: "var(--card)",
              color: "var(--fg)",
              border: "1px solid var(--line)",
              padding: "12px 22px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Als .txt herunterladen
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              background: "var(--card)",
              color: "var(--fg)",
              border: "1px solid var(--line)",
              padding: "12px 22px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Drucken / als PDF speichern
          </button>
        </div>
      </section>
    </div>
  );
}
