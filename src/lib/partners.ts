/**
 * Order and short copy for the advertising block "Anzeige · Partnerangebote" (components/content/PartnerOffers.tsx).
 * An entry only appears while its software's /go link is an active Werbelink (isAffiliate in the CMS), so the block can never show a non-partner as an ad.
 * Copy uses only facts from the vendors' own pages that are also in the software profiles.
 */

/** Switch for the whole "Partnerangebote" block (home, /software, topic pages, articles). Hidden on user request 16.11.2026; set to true to show it again. */
export const SHOW_PARTNER_OFFERS = false;

export const PARTNER_OFFERS: { slug: string; pitch: string }[] = [
  {
    slug: "easybill",
    pitch: "Rechnungen und E-Rechnungen im Format XRechnung und ZUGFeRD schon im kostenlosen Paket, DATEV-Schnittstelle und Server in Deutschland.",
  },
  {
    slug: "lexware-office",
    pitch: "Cloud-Lösung in vier Versionen von der Belegerfassung bis zur Buchhaltung; E-Rechnungen erstellen und übermitteln ab Version M.",
  },
  {
    slug: "pipedrive",
    pitch: "CRM für Vertriebsteams: Leads und Deals verwalten, E-Mails und Follow-ups automatisieren, Apps für iPhone und Android.",
  },
  {
    slug: "weclapp",
    pitch: "Cloud-ERP mit Datenhaltung in Deutschland, Pakete von Rechnungen und Buchhaltung bis zu Lager und Produktion.",
  },
];
