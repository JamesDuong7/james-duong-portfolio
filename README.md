# Personal Developer Portfolio

![CI](https://github.com/JamesDuong7/james-duong-portfolio/actions/workflows/ci.yml/badge.svg)

A Folio-style personal portfolio — a continuous magazine you flip through on the homepage — backed by Sanity CMS and Next.js App Router.

Live site: [https://james-duong-portfolio.vercel.app](https://james-duong-portfolio.vercel.app)

## Key Features

- **Continuous magazine UI**: Cover, table of contents, about, hobbies, works catalog, in-book case studies, and contact — all on `/`
- **Page-turn navigation**: Desktop 3D leaf flips with hash-stable deep links; stacked scroll pages on mobile
- **Dynamic content**: Projects, skills, hobbies, and personal info from **Sanity.io**
- **In-book case studies**: Selecting a work flips to its ink/paper spread inside the magazine (legacy `/projects/[slug]` routes redirect in)
- **Contact form**: Web3Forms + hCaptcha on the contact spread
- **Optimized performance**: Next.js 16 App Router and Server Components
- **Testing**: Vitest unit tests and Playwright end-to-end flows (Chromium + Mobile Safari)
- **CI/CD**: GitHub Actions quality gates; Vercel deploys from `main`

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: CSS Modules + Folio design tokens (Archivo, IBM Plex Mono)
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **CI/CD**: [GitHub Actions](https://github.com/JamesDuong7/james-duong-portfolio/actions) & [Vercel](https://vercel.com/)
- **Analytics**: Vercel Speed Insights

## Architecture

The homepage (`components/folio/`) is one `FolioBook` of paired spreads:

1. **Cover** (opens into the issue)
2. **Table of Contents | About Me**
3. **Hobbies** (from Sanity; paired leaves)
4. **Works opener | Works catalog** (featured + rest)
5. **Case study spreads** — one ink | paper pair per project
6. **Contact intro | Contact form**

Hash targets (`#contents`, `#works`, `#project-<slug>`, `#contact`, …) drive flips on desktop and scroll jumps on mobile. Content is fetched from Sanity at request time.

## CI/CD Pipeline

Every push and pull request to `main` triggers an automated pipeline:

| Stage | What it checks |
|-------|----------------|
| **Quality** | TypeScript typecheck, ESLint, Vitest unit tests |
| **Build & E2E** | Production Next.js build, then Playwright on Chromium and Mobile Safari |

Pull requests get preview deployments on Vercel. Merging to `main` deploys to production.

View live runs: [GitHub Actions](https://github.com/JamesDuong7/james-duong-portfolio/actions)

### GitHub Actions secrets

CI requires these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Required | Description |
|--------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID (same as local `.env.local`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset, usually `production` |
| `WEB3FORMS_ACCESS_KEY` | No | Contact form key; build works without it but form submission is disabled |

To set secrets from your local `.env.local`:

```bash
grep '^NEXT_PUBLIC_SANITY_PROJECT_ID=' .env.local | cut -d= -f2- | gh secret set NEXT_PUBLIC_SANITY_PROJECT_ID
grep '^NEXT_PUBLIC_SANITY_DATASET=' .env.local | cut -d= -f2- | gh secret set NEXT_PUBLIC_SANITY_DATASET
grep '^WEB3FORMS_ACCESS_KEY=' .env.local | cut -d= -f2- | gh secret set WEB3FORMS_ACCESS_KEY
```

### Dependabot

Automated weekly PRs for npm and GitHub Actions dependency updates are enabled via `.github/dependabot.yml`.

## Getting Started

### Prerequisites

- Node.js 20+
- A Sanity.io account (for CMS management)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JamesDuong7/james-duong-portfolio.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   Create `.env.local` with:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   WEB3FORMS_ACCESS_KEY=optional_contact_form_key
   ```
4. **Run locally:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). Embedded Sanity Studio is at `/studio`; optional standalone Studio via `npm run studio:dev` (port 3333).

For Playwright locally: `npx playwright install chromium webkit`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run studio:dev` | Start Sanity Studio (standalone) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end tests |

## License

Private portfolio project.
