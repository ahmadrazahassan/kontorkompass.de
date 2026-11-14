import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Redakteur", plural: "Redaktion" },
  admin: { useAsTitle: "email" },
  auth: true,
  fields: [{ name: "name", type: "text", label: "Name" }],
};
