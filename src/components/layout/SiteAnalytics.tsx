"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics (cookieless, aggregated). Described in /datenschutz § 8 — keep that text in sync.
 * Query strings and hashes are dropped before sending, so tokens (e.g. /newsletter/bestaetigen?token=…) or
 * search terms never reach Vercel. Only the product selection of the comparison page (?p=…) is kept.
 */
function stripUrl(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  const products = url.pathname === "/software/vergleich" ? url.searchParams.get("p") : null;
  url.search = "";
  url.hash = "";
  if (products && /^[a-z0-9,-]+$/.test(products)) url.searchParams.set("p", products);
  return { ...event, url: url.toString() };
}

export function SiteAnalytics() {
  return <Analytics beforeSend={stripUrl} />;
}
