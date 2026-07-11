# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Next.js 16 (App Router, React 19) app — a "Folio" personal
portfolio — whose content is fetched from a hosted **Sanity Content Lake** (SaaS).
There is no local database. Standard commands live in `README.md` and `package.json`
scripts; only the non-obvious caveats are captured here.

### Required env vars (app 500s without them)
The app reads all page content from Sanity at request time. `sanity/lib/client.ts`
throws at startup if the Sanity env vars are missing, and `sanityFetch` throws (→ HTTP
500, not a graceful fallback) if the project/dataset can't be reached. The Folio pages
*do* have empty-content fallbacks (e.g. "James Duong", "Projects coming soon"), but they
only render once the fetch succeeds against a real, reachable project.

Create `.env.local` (gitignored) with the project's **public** Sanity values before
running/building/testing:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=cymt4nd7
NEXT_PUBLIC_SANITY_DATASET=production
```

These are not secrets — `NEXT_PUBLIC_SANITY_PROJECT_ID` is baked into the deployed
client bundle and the `production` dataset is world-readable (no token needed). They
match the live site. `WEB3FORMS_ACCESS_KEY` (contact form) is optional; without it the
form is simply disabled.

### Running / testing notes
- `npm run dev` serves the app on port 3000 (Turbopack). The embedded Sanity Studio is
  at `/studio`; a standalone Studio is available via `npm run studio:dev` (port 3333) but
  is optional (only needed to edit content).
- Playwright (`npm run test:e2e`) uses `reuseExistingServer` when not in CI, so it will
  attach to an already-running `npm run dev` on port 3000 (and auto-start one otherwise).
  It runs both `chromium` and `Mobile Safari` (webkit) projects, so both browsers must be
  installed (`npx playwright install chromium webkit`).
- Do not run `npm run build` while `npm run dev` is running against the same `.next`
  dir if you want to keep dev state clean; restart dev afterward if pages misbehave.
