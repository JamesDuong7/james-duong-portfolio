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
};
