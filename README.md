# Personal Developer Portfolio

A high-performance, dynamic personal portfolio web application designed to showcase software engineering projects, technical skills, and professional experience. This project leverages a headless CMS architecture to decouple content from code, ensuring seamless maintenance and scalability.

## 🚀 Key Features

- **Dynamic Content Management**: Powered by **Sanity.io**, allowing for real-time updates to projects, roles, and descriptions without code changes.
- **Optimized Performance**: Built with **Next.js 16** (App Router) and Server Components for ultra-fast load times and superior SEO.
- **Responsive Design**: Mobile-first UI crafted with **Tailwind CSS v4**, ensuring a premium experience across all devices.
- **Robust Testing**: Comprehensive testing suite including **Vitest** for unit logic and **Playwright** for end-to-end user flows.
- **Type Safety**: Fully implemented in **TypeScript** with strict linting to ensure code reliability.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Analytics**: Vercel Speed Insights

## 🏗️ Architecture & Implementation

This portfolio is engineered using the **Next.js App Router** to minimize client-side JavaScript. Data is fetched dynamically from Sanity.io at runtime, allowing the UI to stay updated instantly. The migration to **Tailwind CSS v4** provides a modern, high-performance styling layer with a custom-tuned design system.

The project follows a "Documentation as Code" philosophy, with automated quality assurance via ESLint and strict TypeScript configurations to catch errors before deployment.

## 💻 Getting Started

### Prerequisites

- Node.js 20+
- A Sanity.io account (for CMS management)

### Installation

1. **Clone the repository:**
  ```bash
   git clone https://github.com/your-username/james-duong-portfolio.git
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

- **Unit Tests**: `npm run test` (Vitest)
- **E2E Tests**: `npm run test:e2e` (Playwright)

---

Developed with ❤️ by James Duong.