import type { CollectionConfig } from "payload";
import { baseAccess, hooks } from "./shared";

export const ICONS = ["Calculator", "Receipt", "Money", "IdentificationBadge", "Package", "Clock"] as const;

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Themenwelt", plural: "Themenwelten" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "order"] },
  access: baseAccess,
  hooks,
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "slug", type: "text", label: "URL-Kürzel", required: true, unique: true, index: true },
    { name: "icon", type: "select", label: "Icon", options: [...ICONS], defaultValue: "Calculator", required: true },
    { name: "description", type: "text", label: "Kurzbeschreibung", required: true },
    { name: "intro", type: "textarea", label: "Einleitung", required: true },
    { name: "order", type: "number", label: "Reihenfolge", defaultValue: 0 },
  ],
};
