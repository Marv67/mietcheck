/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Verhindert MIME-Type-Sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Kein Einbetten der Seite in Frames (Clickjacking-Schutz)
  { key: "X-Frame-Options", value: "DENY" },
  // Referrer nur an gleiche Origin weitergeben
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Browser-Features deaktivieren, die wir nicht brauchen
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  // HSTS: 1 Jahr, inkl. Subdomains (nur in Produktion sinnvoll, schadet im Dev nicht)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  async headers() {
    return [
      {
        // Alle Routen
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
