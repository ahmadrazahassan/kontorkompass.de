import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { de } from "@payloadcms/translations/languages/de";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Categories } from "./src/collections/Categories";
import { Sources } from "./src/collections/Sources";
import { Beitraege } from "./src/collections/Beitraege";
import { Glossar } from "./src/collections/Glossar";
import { Software } from "./src/collections/Software";
import { AffiliateLinks } from "./src/collections/AffiliateLinks";
import { NewsletterConsents } from "./src/collections/NewsletterConsents";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Production: DATABASE_URL = Supabase Postgres (West EU / Ireland), via the Supavisor pooler.
// Without DATABASE_URL the site falls back to the local SQLite file.
// Schema changes go through migrations in src/migrations (push: false), never through dev auto-push:
//   pnpm payload migrate:create <name>   then   pnpm payload migrate
const databaseUrl = process.env.DATABASE_URL ?? "";
const db = databaseUrl.startsWith("postgres")
  ? postgresAdapter({
      pool: {
        connectionString: databaseUrl,
        // Supabase signs its pooler certificate with its own root ("Supabase Root 2021 CA", certs/supabase-root-ca.pem),
        // which is not in Node's default CA list. Pin it so the connection stays encrypted AND verified.
        ssl: databaseUrl.includes("supabase.com")
          ? { ca: fs.readFileSync(path.resolve(dirname, "certs/supabase-root-ca.pem"), "utf8"), rejectUnauthorized: true }
          : undefined,
        // Use the transaction pooler (port 6543): next build runs ~20 workers in parallel and Vercel opens one pool per function.
        max: 3,
      },
      push: false,
      migrationDir: path.resolve(dirname, "src/migrations"),
    })
  : sqliteAdapter({ client: { url: process.env.SQLITE_URL ?? "file:./kontorkompass.db" } });

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " | Kontorkompass Redaktion" },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { fallbackLanguage: "de", supportedLanguages: { de } },
  collections: [Beitraege, Software, Glossar, Categories, Sources, AffiliateLinks, NewsletterConsents, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-only-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "src/payload-types.ts") },
  db,
  sharp,
});
