import type { CollectionConfig } from "payload";
import { isLoggedIn, hooks } from "./shared";

export const AffiliateLinks: CollectionConfig = {
  slug: "affiliate-links",
  labels: { singular: "Partnerlink", plural: "Partnerlinks" },
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "partner", "isAffiliate", "active"],
    description: "Ziele der /go/…-Weiterleitungen. Nach Freigabe im Partnerprogramm (z. B. Sage über Impact) hier die Tracking-URL eintragen.",
  },
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks,
  fields: [
    { name: "slug", type: "text", label: "Kürzel (/go/…)", required: true, unique: true, index: true },
    { name: "partner", type: "text", label: "Partner", required: true },
    { name: "trackingUrl", type: "text", label: "Ziel-URL / Tracking-URL", required: true },
    { name: "isAffiliate", type: "checkbox", label: "Werbelink (Provision möglich)", defaultValue: false },
    { name: "network", type: "text", label: "Netzwerk", admin: { description: "Z. B. Impact" } },
    { name: "active", type: "checkbox", label: "Aktiv", defaultValue: true },
    { name: "notes", type: "textarea", label: "Notizen" },
  ],
};
