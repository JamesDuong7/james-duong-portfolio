import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // JSON-LD Schema for Person
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "James Duong",
    jobTitle: "Software Engineer",
    url: "https://jamesduong.dev",
    sameAs: [
      "https://github.com/",
      "https://linkedin.com/in/"
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "San Diego State University"
    }
  };

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="layout-wrapper" id="main">
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
