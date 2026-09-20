import type { FolioScreenshot } from "@/sanity/lib/types";

type LocalProjectMedia = {
  screenshots: FolioScreenshot[];
  demoVideoUrl?: string;
  demoPosterUrl?: string;
};

/**
 * Repository-owned capture fallbacks for projects that do not yet have Sanity
 * screenshots. Published CMS media remains authoritative when present.
 */
export const localProjectMedia: Record<string, LocalProjectMedia> = {
  "aztec-assess": {
    demoVideoUrl: "/project-media/aztec-assess/product-tour.webm",
    demoPosterUrl: "/project-media/aztec-assess/course-overview.webp",
    screenshots: [
      {
        url: "/project-media/aztec-assess/course-overview.webp",
        alt: "Aztec Assess instructor course overview with question-bank and adaptive quiz controls",
        width: 1440,
        height: 900,
        lqip: null,
      },
      {
        url: "/project-media/aztec-assess/question-bank.webp",
        alt: "Aztec Assess question-bank manager showing questions across easy, medium, and hard difficulty levels",
        width: 1440,
        height: 900,
        lqip: null,
      },
      {
        url: "/project-media/aztec-assess/adaptive-quiz.webp",
        alt: "Aztec Assess student quiz interface presenting a data-structures question and four answer choices",
        width: 1440,
        height: 900,
        lqip: null,
      },
    ],
  },
  "harbor-risk": {
    demoVideoUrl: "/project-media/harbor-risk/product-tour.webm",
    demoPosterUrl: "/project-media/harbor-risk/risk-snapshot.webp",
    screenshots: [
      {
        url: "/project-media/harbor-risk/risk-snapshot.webp",
        alt: "Harbor Risk analysis dashboard translating portfolio data into a plain-English risk summary and four key metrics",
        width: 1440,
        height: 900,
        lqip: null,
      },
      {
        url: "/project-media/harbor-risk/portfolio-builder.webp",
        alt: "Harbor Risk portfolio builder with weighted SPY, QQQ, and AAPL holdings ready for analysis",
        width: 1440,
        height: 900,
        lqip: null,
      },
      {
        url: "/project-media/harbor-risk/risk-breakdown.webp",
        alt: "Harbor Risk results showing the historical portfolio path, simulation range, stress windows, benchmark comparison, and risk contribution",
        width: 1440,
        height: 900,
        lqip: null,
      },
    ],
  },
};
