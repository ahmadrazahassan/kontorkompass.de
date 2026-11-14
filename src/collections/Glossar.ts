import type { CollectionConfig } from "payload";
import { baseAccess, hooks } from "./shared";

export const Glossar: CollectionConfig = {
  slug: "glossar",
  labels: { singular: "Glossarbegriff", plural: "Glossar" },
  admin: { useAsTitle: "term", defaultColumns: ["term", "slug"] },
  access: baseAccess,
  hooks,
  fields: [
    { name: "term", type: "text", label: "Begriff", required: true },
    { name: "slug", type: "text", label: "URL-Kürzel", required: true, unique: true, index: true },
    { name: "short", type: "textarea", label: "Definition in einem Satz", required: true },
    {
      name: "body",
      type: "array",
      label: "Erklärung (Absätze)",
      fields: [{ name: "text", type: "textarea", label: "Absatz", required: true }],
    },
    { name: "sources", type: "relationship", relationTo: "sources", hasMany: true, label: "Quellen", required: true },
  ],
};
