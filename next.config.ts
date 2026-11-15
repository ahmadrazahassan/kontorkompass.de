import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Baseline security headers for every response (site, API and admin).
// No script-src CSP on purpose: Next.js and Payload use inline scripts, which would need nonces.
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'" },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Unknown URLs get the German 404 in src/app/global-not-found.tsx (two root layouts: site and Payload admin).
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      // Thin duplicate of the E-Rechnung-2027 guide (audit 2026-11-14). The CMS entry is set to draft, not deleted.
      { source: "/magazin/e-rechnung-fristen-bis-2028", destination: "/ratgeber/e-rechnung-2027-pflicht-unternehmen", permanent: true },
    ];
  },
};

export default withPayload(config);
