# Kontorkompass

German B2B software guides (Ratgeber, Magazin, Software-Profile) at [kontorkompass.de](https://www.kontorkompass.de).
Next.js 16 + Payload CMS 3 (admin at `/admin`).

## Local development

```bash
pnpm install
pnpm build && pnpm start   # or: pnpm dev
```

Without `DATABASE_URL` the site uses a local SQLite file (`kontorkompass.db`, not in git).

## Content and database

All articles, software profiles, sources and settings live in the Payload database, not in this repo.
The seed loaders in `src/seed/` can rebuild the content (`pnpm seed`, then the other loaders with
`pnpm exec payload run src/seed/<file>.ts`).

## Production (Vercel + Supabase)

Set these environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | `https://www.kontorkompass.de` |
| `DATABASE_URL` | Supabase Postgres connection string (region Central EU / Frankfurt) |
| `PAYLOAD_SECRET` | long random string |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NEWSLETTER_FROM`, `NEWSLETTER_SECRET` | newsletter double opt-in |

The Postgres database must contain the content before the first build, because pages are pre-rendered from it.
