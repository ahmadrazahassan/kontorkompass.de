# Kontorkompass

German B2B software guides (Ratgeber, Magazin, Software-Profile) at [kontorkompass.de](https://www.kontorkompass.de).
Next.js 16 + Payload CMS 3 (admin at `/admin`), content in Supabase Postgres (West EU / Ireland).

## Local development

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm build && pnpm start      # or: pnpm dev
```

With `DATABASE_URL` set, the site reads and writes the Supabase database. Without it, it falls back to a local SQLite
file (`kontorkompass.db`, never committed).

## Database

- All articles, software profiles, sources and settings live in the database, not in this repo.
- Schema changes go through migrations in `src/migrations` (auto-push is off for Postgres):
  `pnpm payload migrate:create <name>`, then `pnpm payload migrate`.
- Connect through the Supabase **transaction pooler** (port 6543). The session pooler allows only 15 clients, which a
  build with many workers exceeds; the direct `db.<ref>.supabase.co` host is IPv6-only.
- TLS is verified against Supabase's root certificate in `certs/supabase-root-ca.pem` ("Supabase Root 2021 CA").
- Supabase's REST/GraphQL Data API has no access to Payload's tables (migration `lock_supabase_data_api`).

## Production (Vercel)

Set these environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | `https://www.kontorkompass.de` |
| `DATABASE_URL` | Supabase transaction pooler URL (port 6543) |
| `PAYLOAD_SECRET` | long random string (keep the same value everywhere, or admin logins break) |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NEWSLETTER_FROM`, `NEWSLETTER_SECRET` | newsletter double opt-in |

Run `pnpm payload migrate` before deploying a change that adds a migration.
