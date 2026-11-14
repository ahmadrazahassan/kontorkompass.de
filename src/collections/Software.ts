import type { CollectionConfig } from "payload";
import { baseAccess, hooks } from "./shared";

const list = (name: string, label: string) => ({
  name,
  type: "array" as const,
  label,
  fields: [{ name: "text", type: "text" as const, label: "Eintrag", required: true }],
});

export const Software: CollectionConfig = {
  slug: "software",
  labels: { singular: "Software-Profil", plural: "Software" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "vendor", "entryPrice", "verified"],
    description: "Sachliche Profile. Preise in Euro zzgl. MwSt. mit Quelle und Stand. Nicht Öffentliches als „nicht öffentlich angegeben“ vermerken.",
  },
  access: baseAccess,
  hooks,
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "slug", type: "text", label: "URL-Kürzel", required: true, unique: true, index: true },
    { name: "vendor", type: "text", label: "Anbieter", required: true },
    { name: "categories", type: "relationship", relationTo: "categories", hasMany: true, label: "Themenwelten", required: true },
    { name: "summary", type: "textarea", label: "Ein neutraler Satz", required: true },
    { name: "logo", type: "upload", relationTo: "media", label: "Offizielles Logo (unverändert!)", admin: { description: "Nur Originaldatei aus dem Pressekit bzw. Partnernetzwerk. Nicht umfärben oder beschneiden." } },
    {
      type: "row",
      fields: [
        { name: "affiliateLink", type: "relationship", relationTo: "affiliate-links", label: "Partnerlink (/go/…)", required: true },
        { name: "ctaLabel", type: "text", label: "Button-Text", defaultValue: "Zum Anbieter", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "trial", type: "text", label: "Testphase (Kurzform)", required: true },
        { name: "entryPrice", type: "number", label: "Einstiegspreis / Monat (EUR netto)", admin: { description: "Leer = auf Anfrage. 0 = kostenloser Tarif." } },
      ],
    },
    {
      name: "facts",
      type: "array",
      label: "Auf einen Blick",
      fields: [
        { name: "label", type: "text", label: "Merkmal", required: true },
        { name: "value", type: "text", label: "Wert", required: true },
      ],
    },
    {
      name: "plans",
      type: "array",
      label: "Tarife (EUR, zzgl. MwSt.)",
      fields: [
        { name: "name", type: "text", label: "Tarif", required: true },
        { name: "monthlyNet", type: "number", label: "Preis / Monat netto (regulär)", admin: { description: "Leer = auf Anfrage." } },
        { name: "billing", type: "text", label: "Abrechnung", required: true },
        { name: "includes", type: "textarea", label: "Enthalten", required: true },
        { name: "promo", type: "text", label: "Aktion (zum Stand-Datum)" },
        {
          type: "collapsible",
          label: "Preismodell für Rechner und Diagramme",
          admin: { initCollapsed: true, description: "Nur veröffentlichte Anbieterpreise eintragen. Leer lassen, was der Anbieter nicht nennt." },
          fields: [
            {
              name: "unit",
              type: "select",
              label: "Der Preis gilt …",
              defaultValue: "flat",
              options: [
                { label: "pauschal pro Monat", value: "flat" },
                { label: "pro Nutzer und Monat", value: "perUser" },
                { label: "pro Beschäftigte und Monat", value: "perEmployee" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "includedUsers", type: "number", label: "Nutzende inklusive" },
                { name: "extraUserMonthly", type: "number", label: "je weitere Nutzende (€)" },
                { name: "includedEmployees", type: "number", label: "Beschäftigte inklusive" },
                { name: "extraEmployeeMonthly", type: "number", label: "je weitere Beschäftigte (€)" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "minMonthly", type: "number", label: "Mindestbetrag / Monat (€)" },
                { name: "annualMonthly", type: "number", label: "Monatspreis bei Jahresabrechnung (€)" },
                { name: "promoMonthly", type: "number", label: "Aktionspreis / Monat (€)" },
                { name: "promoMonths", type: "number", label: "Aktion gilt Monate" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "scenarioBasis",
      type: "select",
      label: "Kostenrechnung nach",
      defaultValue: "users",
      options: [
        { label: "Anzahl Nutzende", value: "users" },
        { label: "Anzahl Beschäftigte", value: "employees" },
        { label: "keine Staffel (Pauschalpreise)", value: "none" },
      ],
    },
    { name: "priceNote", type: "textarea", label: "Preishinweis" },
    {
      type: "collapsible",
      label: "Profil",
      fields: [
        { name: "verdict", type: "textarea", label: "Unser Eindruck in Kürze (2–3 Sätze)" },
        { name: "review", type: "richText", label: "Ausführliches Profil" },
        {
          name: "checks",
          type: "array",
          label: "Prüfkriterien (nur belegte Angaben)",
          fields: [
            { name: "criterion", type: "text", label: "Kriterium", required: true },
            {
              name: "status",
              type: "select",
              label: "Ergebnis",
              required: true,
              options: [
                { label: "erfüllt", value: "yes" },
                { label: "teilweise", value: "partial" },
                { label: "nicht erfüllt / nicht enthalten", value: "no" },
                { label: "nicht öffentlich angegeben", value: "unknown" },
                { label: "nicht relevant", value: "na" },
              ],
            },
            { name: "note", type: "text", label: "Beleg / Hinweis" },
          ],
        },
      ],
    },
    list("fits", "Geeignet für"),
    list("notFits", "Weniger geeignet für"),
    { name: "alternatives", type: "relationship", relationTo: "software", hasMany: true, label: "Alternativen" },
    { name: "sources", type: "relationship", relationTo: "sources", hasMany: true, label: "Quellen", required: true },
    { name: "verified", type: "date", label: "Zuletzt geprüft (Stand)", required: true, admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } } },
  ],
};
