import CaseStudyInkPage from "./CaseStudyInkPage";
import CaseStudyPaperPage from "./CaseStudyPaperPage";
import FolioSpineMark from "./FolioSpineMark";
import type { ProjectDetail } from "@/sanity/lib/types";
import styles from "./FolioCaseStudy.module.css";

type FolioCaseStudyProps = {
  project: ProjectDetail;
  page?: string;
  pageRight?: string;
  nextTitle?: string | null;
};

/** Standalone two-page case study spread (legacy / loading fallback). */
export default function FolioCaseStudy({
  project,
  page = "01",
  pageRight = "02",
  nextTitle = null,
}: FolioCaseStudyProps) {
  return (
    <div className={styles.spread} aria-label={`${project.title} case study`}>
      <FolioSpineMark />
      <CaseStudyInkPage page={page} project={project} />
      <CaseStudyPaperPage
        page={pageRight}
        project={project}
        nextTitle={nextTitle}
      />
    </div>
  );
}
