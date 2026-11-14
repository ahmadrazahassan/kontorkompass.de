import type { CollectionConfig } from "payload";
import { isLoggedIn } from "./shared";

// Proof of double opt-in consent (Art. 7 Abs. 1 DSGVO): who asked when, and when the link was confirmed.
// Written only by /api/newsletter/confirm; visible to logged-in editors only. Covered in the Datenschutzerklärung (Newsletter).
export const NewsletterConsents: CollectionConfig = {
  slug: "newsletter-consents",
  labels: { singular: "Newsletter-Einwilligung", plural: "Newsletter-Einwilligungen" },
  admin: { useAsTitle: "email", defaultColumns: ["email", "requestedAt", "confirmedAt"], group: "Newsletter" },
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: "email", type: "email", label: "E-Mail-Adresse", required: true, index: true },
    { name: "requestedAt", type: "date", label: "Anmeldung angefordert", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "confirmedAt", type: "date", label: "Bestätigt", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
  ],
};
