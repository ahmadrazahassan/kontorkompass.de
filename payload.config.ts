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

// Production: set DATABASE_URL to a Postgres connection string (EU region, e.g. Frankfurt).
// Local development falls back to a SQLite file.
const db = process.env.DATABASE_URL?.startsWith("postgres")
  ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })
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
