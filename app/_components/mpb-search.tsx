"use client";

/**
 * Client-side Gemeinde-Suche fuer /mietpreisbremse.
 *
 * Bekommt den vorbereiteten Index als Prop (Server-rendered im HTML),
 * sucht clientseitig per `startsWith` + `includes` mit Limit 10.
 * Keine API-Calls, keine Fuzzy-Lib — schlank und blitzschnell.
 */

import { useMemo, useState } from "react";
import Link from "next/link";

type IndexEntry = { name: string; bl: string; slug: string; mpb: boolean };

export default function MpbSearch({ index }: { index: IndexEntry[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (needle.length < 2) return [];
    const starts: IndexEntry[] = [];
    const contains: IndexEntry[] = [];
    for (const e of index) {
      const n = e.name.toLowerCase();
      if (n.startsWith(needle)) starts.push(e);
      else if (n.includes(needle)) contains.push(e);
      if (starts.length >= 10) break;
    }
    return [...starts, ...contains].slice(0, 10);
  }, [index, needle]);

  // Exakt-Treffer (gleicher String, case-insensitive)
  const exact = useMemo(() => {
    if (needle.length < 2) return null;
    return index.find((e) => e.name.toLowerCase() === needle) ?? null;
  }, [index, needle]);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <label htmlFor="mpb-search" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
        Stadt oder Gemeinde
      </label>
      <input
        id="mpb-search"
        type="search"
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="z. B. München, Berlin, Köln …"
        style={{
          width: "100%",
          padding: "14px 18px",
          fontSize: 16,
          border: "1px solid var(--line)",
          borderRadius: 12,
          background: "var(--card)",
          color: "var(--fg)",
          outline: "none",
        }}
        aria-describedby="mpb-search-hint"
      />
      <p id="mpb-search-hint" style={{ fontSize: 12, color: "var(--dim)", marginTop: 8 }}>
        {needle.length === 0
          ? `Durchsuche ${index.length.toLocaleString("de-DE")} Gemeinden in 13 Bundesländern.`
          : needle.length < 2
            ? "Mindestens 2 Zeichen eingeben …"
            : results.length === 0
              ? "Keine Treffer. Mietpreisbremse gilt nur in ausgewählten Gemeinden."
              : `${results.length} Treffer${results.length === 10 ? " (weitere existieren)" : ""}`}
      </p>

      {/* Live-Result-Banner: exakter Treffer prominent darstellen */}
      {exact && (
        <div
          role="status"
          style={{
            marginTop: 16,
            padding: "16px 20px",
            background: exact.mpb ? "#FEF2F2" : "#F0FDF4",
            border: `1px solid ${exact.mpb ? "#FECACA" : "#BBF7D0"}`,
            color: exact.mpb ? "#B91C1C" : "#15803D",
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
            {exact.mpb ? `✓ ${exact.name} unterliegt der Mietpreisbremse` : `${exact.name}: Mietpreisbremse aktuell nicht aktiv`}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.55 }}>
            Bundesland: <strong>{exact.bl}</strong>.{" "}
            <Link href={`/mietpreisbremse/${exact.slug}`} style={{ color: "inherit", textDecoration: "underline" }}>
              Details zu {exact.bl} ansehen →
            </Link>
          </p>
        </div>
      )}

      {/* Mehrere Treffer als Suggest-Liste */}
      {!exact && results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: 4 }}>
          {results.map((r) => (
            <li key={`${r.bl}-${r.name}`}>
              <button
                type="button"
                onClick={() => setQ(r.name)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13.5,
                  color: "var(--fg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontWeight: 550 }}>{r.name}</span>
                <span style={{ fontSize: 11, color: "var(--dim)" }}>{r.bl}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
