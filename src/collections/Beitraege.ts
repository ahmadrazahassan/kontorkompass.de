import type { Block, CollectionConfig } from "payload";
import { BlocksFeature, EXPERIMENTAL_TableFeature, FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { hooks, publicReadPublished, isLoggedIn } from "./shared";

export const CalloutBlock: Block = {
  slug: "callout",
  labels: { singular: "Infobox", plural: "Infoboxen" },
  fields: [
    {
      name: "kind",
      type: "select",
      label: "Art",
      defaultValue: "info",
      options: [
        { label: "Hinweis", value: "info" },
        { label: "Praxistipp", value: "tip" },
        { label: "Achtung", value: "warn" },
        { label: "Rechtlicher Hinweis", value: "legal" },
      ],
    },
    { name: "title", type: "text", label: "Titel", required: true },
    { name: "text", type: "textarea", label: "Text", required: true },
  ],
};

export const AffiliateCtaBlock: Block = {
  slug: "affiliateCta",
  labels: { singular: "Partner-Empfehlung", plural: "Partner-Empfehlungen" },
  fields: [
    { name: "software", type: "relationship", relationTo: "software", label: "Software", required: true },
    { name: "text", type: "textarea", label: "Kurztext (sachlich)", required: true },
  ],
};

export const StepsBlock: Block = {
  slug: "steps",
  labels: { singular: "Schritt-für-Schritt-Liste", plural: "Schritt-für-Schritt-Listen" },
  fields: [
    {
      name: "steps",
      type: "array",
      label: "Schritte",
      minRows: 2,
      fields: [{ name: "text", type: "textarea", label: "Text", required: true }],
    },
  ],
};

export const Beitraege: CollectionConfig = {
  slug: "beitraege",
  labels: { singular: "Beitrag", plural: "Beiträge" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "category", "_status", "lastVerifiedAt"],
    description: "Ratgeber und Magazin-Artikel. Jede Zahl braucht eine Quelle und ein Stand-Datum.",
  },
  access: { read: publicReadPublished, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks,
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Inhalt",
          fields: [
            { name: "title", type: "text", label: "Titel (H1)", required: true },
            { name: "slug", type: "text", label: "URL-Kürzel", required: true, unique: true, index: true, admin: { description: "Deutsch, Umlaute umschreiben (ä→ae, ö→oe, ü→ue, ß→ss)." } },
            {
              name: "kind",
              type: "select",
              label: "Art",
              required: true,
              defaultValue: "ratgeber",
              options: [
                { label: "Ratgeber", value: "ratgeber" },
                { label: "Magazin", value: "magazin" },
              ],
            },
            { name: "category", type: "relationship", relationTo: "categories", label: "Themenwelt", required: true },
            { name: "lead", type: "textarea", label: "Einleitung", required: true },
            {
              name: "takeaways",
              type: "array",
              label: "Das Wichtigste in Kürze",
              admin: { description: "Format „Stichwort: Aussage“ – der Teil vor dem Doppelpunkt wird fett." },
              fields: [{ name: "text", type: "text", label: "Punkt", required: true }],
            },
            {
              name: "body",
              type: "richText",
              label: "Text",
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                  EXPERIMENTAL_TableFeature(),
                  BlocksFeature({ blocks: [CalloutBlock, AffiliateCtaBlock, StepsBlock] }),
                ],
              }),
              admin: { description: "Überschriften der Ebene 2 erscheinen automatisch im Inhaltsverzeichnis." },
            },
            {
              name: "legacyBody",
              type: "select",
              label: "Vorlage (Altbestand)",
              admin: { description: "Nur für die ersten Beiträge, deren Text noch im Code liegt. Neue Beiträge: leer lassen und das Textfeld nutzen.", position: "sidebar" },
              options: [
                { label: "E-Rechnung 2027", value: "e-rechnung-2027" },
                { label: "E-Rechnung Fristen", value: "fristen" },
              ],
            },
            {
              name: "legacyToc",
              type: "array",
              label: "Inhaltsverzeichnis (Altbestand)",
              admin: { condition: (d) => Boolean(d?.legacyBody) },
              fields: [
                { name: "anchor", type: "text", label: "Anker-ID", required: true },
                { name: "label", type: "text", label: "Beschriftung", required: true },
              ],
            },
            {
              name: "faqs",
              type: "array",
              label: "Häufige Fragen",
              fields: [
                { name: "q", type: "text", label: "Frage", required: true },
                { name: "a", type: "textarea", label: "Antwort", required: true },
              ],
            },
          ],
        },
        {
          label: "Quellen & Prüfung",
          fields: [
            { name: "sources", type: "relationship", relationTo: "sources", hasMany: true, label: "Quellen", required: true },
            { name: "lastVerifiedAt", type: "date", label: "Zuletzt fachlich geprüft", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
            { name: "nextReviewAt", type: "date", label: "Wiedervorlage", admin: { description: "Preise: ca. 3 Monate. Rechtsthemen: bei jeder Änderung.", date: { pickerAppearance: "dayOnly" } } },
            { name: "legalDisclaimer", type: "checkbox", label: "Hinweis „ersetzt keine Rechts- oder Steuerberatung“ anzeigen", defaultValue: true },
            { name: "hasAffiliate", type: "checkbox", label: "Enthält Werbelinks (Hinweis oben anzeigen)", defaultValue: false },
          ],
        },
        {
          label: "SEO & Darstellung",
          fields: [
            { name: "seoTitle", type: "text", label: "SEO-Titel (max. 60 Zeichen)", maxLength: 70 },
            { name: "description", type: "textarea", label: "Meta-Beschreibung (max. 155 Zeichen)", required: true, maxLength: 200 },
            { name: "readingMinutes", type: "number", label: "Lesezeit (Min.)", required: true, defaultValue: 5, min: 1 },
            { name: "coverSeed", type: "number", label: "Muster-Zahl für das Titelbild", defaultValue: 1, admin: { description: "Verändert das generierte Konturmuster." } },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              label: "Titelbild / Thumbnail (optional)",
              admin: {
                description:
                  "Querformat 16:9, mindestens 1600 × 900 px. Erscheint auf Karten, im Beitragskopf und beim Teilen. Ohne Upload nutzt die Seite das hinterlegte Motiv oder ein automatisch gestaltetes Titelbild. Der Hinweis auf KI-erstellte Symbolbilder steht gesammelt im Impressum unter „Bildnachweise“.",
              },
            },
          ],
        },
      ],
    },
    { name: "publishedAt", type: "date", label: "Veröffentlicht am", admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } } },
  ],
};
