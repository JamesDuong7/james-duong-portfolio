import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import HashScrollHandler from "@/components/HashScrollHandler";
import { fetchPersonalInfo } from "@/sanity/lib/fetch";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jamesduong.dev"),
  title: "James Duong | Software Engineer",
  description: "Computer Science student at SDSU and aspiring software engineer focused on building performant web experiences.",
  alternates: {
    canonical: "https://jamesduong.dev"
  },
  openGraph: {
    title: "James Duong | Software Engineer",
    description: "Personal portfolio of James Duong, showcasing software engineering projects.",
    url: "https://jamesduong.dev",
    siteName: "James Duong Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Duong | Software Engineer",
    description: "Computer Science student at SDSU and aspiring software engineer focused on building performant web experiences.",
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const info = await fetchPersonalInfo();

  const sameAs = [info?.github, info?.linkedin].filter(
    (url): url is string => Boolean(url),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: info?.name ?? "James Duong",
    jobTitle: "Software Engineer",
    url: "https://jamesduong.dev",
    ...(info?.email && { email: info.email }),
    ...(info?.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: info.location,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "San Diego State University",
    },
  };

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="layout-wrapper">
          <HashScrollHandler />
          {children}
        </div>
        {/* Real-time content subscriptions — active on every page */}
        <SanityLive />
        {/* Visual editing overlays — only renders in Draft Mode */}
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
