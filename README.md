# Personal Developer Portfolio

![CI](https://github.com/JamesDuong7/james-duong-portfolio/actions/workflows/ci.yml/badge.svg)

A high-performance, dynamic personal portfolio web application designed to showcase software engineering projects, technical skills, and professional experience. This project leverages a headless CMS architecture to decouple content from code, ensuring seamless maintenance and scalability.

## 🚀 Key Features

- **Dynamic Content Management**: Powered by **Sanity.io**, allowing for real-time updates to projects, roles, and descriptions without code changes.
- **Optimized Performance**: Built with **Next.js 16** (App Router) and Server Components for ultra-fast load times and superior SEO.
- **Responsive Design**: Mobile-first UI with CSS Modules, ensuring a premium experience across all devices.
- **Robust Testing**: Comprehensive testing suite including **Vitest** for unit logic and **Playwright** for end-to-end user flows.
- **Type Safety**: Fully implemented in **TypeScript** with strict linting to ensure code reliability.
- **CI/CD Automation**: GitHub Actions runs quality gates on every push; **Vercel** deploys production automatically from `main`.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: CSS Modules
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **CI/CD**: [GitHub Actions](https://github.com/JamesDuong7/james-duong-portfolio/actions) & [Vercel](https://vercel.com/)
- **Analytics**: Vercel Speed Insights

## 🏗️ Architecture & Implementation

This portfolio is engineered using the **Next.js App Router** to minimize client-side JavaScript. Data is fetched dynamically from Sanity.io at runtime, allowing the UI to stay updated instantly.

The project follows a "Documentation as Code" philosophy, with automated quality assurance via ESLint, TypeScript, and a multi-stage CI pipeline that catches errors before deployment.

## 🔄 CI/CD Pipeline

Every push and pull request to `main` triggers an automated pipeline:

| Stage | What it checks |
|-------|----------------|
| **Quality** | TypeScript typecheck, ESLint, Vitest unit tests |
| **Build & E2E** | Production Next.js build, then Playwright tests on Chromium and Mobile Safari |

Pull requests get preview deployments on Vercel. Merging to `main` deploys to production at [jamesduong.dev](https://jamesduong.dev).

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

## 💻 Getting Started

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
3. **Set up environment variables:**
   Create a `.env.local` file in the root and add your Sanity project IDs and contact form key:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   WEB3FORMS_ACCESS_KEY=your_web3forms_access_key  # Web3Forms requires client-side submission; this key is exposed in the browser bundle
   ```
   Enable **hCaptcha** for your form in the [Web3Forms dashboard](https://app.web3forms.com) so the contact form verification check works.
4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Sanity Studio (CMS)

**Recommended** — Studio embedded in the Next.js app:

```bash
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio) to edit content.

**Optional** — Standalone Studio on port 3333 (requires Node 22):

```bash
nvm use 22
npm run studio:dev
```

Open [http://localhost:3333](http://localhost:3333).

For standalone Studio, `.env.local` must include `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` (same values as the `NEXT_PUBLIC_SANITY_*` vars).

## 🧪 Testing

- **Unit Tests**: `npm run test:unit` (or `npm test`)
- **E2E Tests**: `npm run test:e2e` (Playwright)

---

Developed with ❤️ by James Duong.
