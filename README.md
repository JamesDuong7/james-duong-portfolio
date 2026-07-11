# Personal Developer Portfolio

![CI](https://github.com/JamesDuong7/james-duong-portfolio/actions/workflows/ci.yml/badge.svg)

A Folio-style personal portfolio — magazine spreads for identity, about/contact, featured work, and case studies — backed by Sanity CMS and Next.js App Router.

## Key Features

- **Folio magazine UI**: Desktop scroll-snap spreads with page-flip affordances; stacked pages on mobile
- **Dynamic Content Management**: Powered by **Sanity.io** for projects, skills, and personal info
- **Case study spreads**: Project pages match the Folio ink/paper layout with next/prev navigation
- **Contact form**: Web3Forms + hCaptcha on the About + Contact page
- **Optimized Performance**: Next.js 16 App Router and Server Components
- **Robust Testing**: Vitest unit tests and Playwright end-to-end flows
- **CI/CD Automation**: GitHub Actions quality gates; Vercel deploys from `main`

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: CSS Modules + Folio design tokens (Archivo, IBM Plex Mono)
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **CI/CD**: [GitHub Actions](https://github.com/JamesDuong7/james-duong-portfolio/actions) & [Vercel](https://vercel.com/)
- **Analytics**: Vercel Speed Insights

## Architecture

Homepage is composed as two Folio spreads (`components/folio/`):

1. **Identity | About + Contact**
2. **Featured Work | Work Index**

Case studies live at `/projects/[slug]` as matching two-page Folio spreads. Content is fetched from Sanity at build/runtime.

## CI/CD Pipeline

Every push and pull request to `main` triggers an automated pipeline:

| Stage | What it checks |
|-------|----------------|
| **Quality** | TypeScript typecheck, ESLint, Vitest unit tests |
| **Build & E2E** | Production Next.js build, then Playwright tests on Chromium and Mobile Safari |

Pull requests get preview deployments on Vercel. Merging to `main` deploys to production at [https://james-duong-portfolio.vercel.app](https://james-duong-portfolio.vercel.app).

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
   Create `.env.local` with Sanity and Web3Forms keys.
4. **Run locally:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run studio:dev` | Start Sanity Studio |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end tests |

## License

Private portfolio project.
