import type { CollectionConfig } from "payload";
import { baseAccess, hooks } from "./shared";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Medium", plural: "Medien" },
  access: baseAccess,
  hooks,
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      { name: "card", width: 800, height: 500, position: "centre" },
      { name: "hero", width: 1600, height: 900, position: "centre" },
    ],
  },
  fields: [
    { name: "alt", type: "text", label: "Alt-Text (Deutsch)", required: true, admin: { description: "Max. 125 Zeichen, ohne „Bild von“. Für rein dekorative Muster leer lassen und „Dekorativ“ aktivieren." } },
    { name: "decorative", type: "checkbox", label: "Dekorativ", defaultValue: false },
    { name: "credit", type: "text", label: "Quelle / Urheber", admin: { description: "Z. B. „KI-generiert“, Fotograf oder Anbieter-Pressekit." } },
    { name: "licence", type: "text", label: "Lizenz" },
  ],
};
