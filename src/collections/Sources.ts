import type { CollectionConfig } from "payload";
import { baseAccess, hooks } from "./shared";

export const Sources: CollectionConfig = {
  slug: "sources",
  labels: { singular: "Quelle", plural: "Quellen" },
  admin: { useAsTitle: "title", defaultColumns: ["number", "publisher", "title", "accessedAt"] },
  access: baseAccess,
  hooks,
  fields: [
    { name: "number", type: "number", label: "Nummer im Text", admin: { description: "Zitiernummer [n] in den Beiträgen. Neue Beiträge nummerieren automatisch nach Reihenfolge." } },
    { name: "publisher", type: "text", label: "Herausgeber", required: true },
    { name: "title", type: "text", label: "Titel", required: true },
    { name: "url", type: "text", label: "Link", required: true },
    { name: "accessedAt", type: "date", label: "Abgerufen am", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    {
      name: "type",
      type: "select",
      label: "Art",
      options: [
        { label: "Behörde", value: "behoerde" },
        { label: "Kammer / Verband", value: "kammer" },
        { label: "Studie", value: "studie" },
        { label: "Anbieter", value: "anbieter" },
        { label: "Fachpresse", value: "presse" },
      ],
    },
  ],
};
