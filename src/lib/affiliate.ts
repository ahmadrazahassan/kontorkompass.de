// Affiliate links resolve via /go/[slug]. Until a programme approves us, trackingUrl is the plain vendor URL.
// After approval (e.g. Sage via Impact) replace trackingUrl with the Impact link and set isAffiliate: true (CMS: "Werbelink"). Labels (*, "Anzeige", notice) then appear automatically.
export type AffiliateLink = { slug: string; partner: string; trackingUrl: string; isAffiliate: boolean };

export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  "sage-active-testen": {
    slug: "sage-active-testen",
    partner: "Sage",
    trackingUrl: "https://www.sage.com/de-de/produkte/sage-active/",
    isAffiliate: false, // until Impact approval: plain link, no * label
  },
  "sage-active-preise": {
    slug: "sage-active-preise",
    partner: "Sage",
    trackingUrl: "https://www.sage.com/de-de/produkte/sage-active/#preis",
    isAffiliate: false, // until Impact approval: plain link, no * label
  },
  "lexware-office": { slug: "lexware-office", partner: "Lexware", trackingUrl: "https://www.lexware.de/preise/", isAffiliate: false },
  sevdesk: { slug: "sevdesk", partner: "sevdesk", trackingUrl: "https://sevdesk.de/preise/", isAffiliate: false },
};
