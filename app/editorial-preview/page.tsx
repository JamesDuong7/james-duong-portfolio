import type { Metadata } from "next";
import Link from "next/link";
import {
  EditorialFolio,
  EditorialMasthead,
  EditorialMediaFrame,
  EditorialPullQuote,
  EditorialRule,
  EditorialSpread,
} from "@/components/folio/editorial/EditorialSpread";
import { parseYouTubeVideoId, youtubePosterUrl } from "@/lib/youtube";
import { fetchProjectBySlug } from "@/sanity/lib/fetch";
import { primaryScreenshot } from "@/sanity/lib/types";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Editorial System Preview | James Duong",
  robots: { index: false, follow: false },
};

export default async function EditorialPreviewPage() {
  const project = await fetchProjectBySlug("harbor-risk", { stega: false });
  const screenshot = primaryScreenshot(project?.screenshots);
  const videoId = parseYouTubeVideoId(project?.demoVideoUrl);
  const mediaSrc = screenshot?.url ?? (videoId ? youtubePosterUrl(videoId) : null);
  const title = project?.title ?? "Harbor Risk";
  const description =
    project?.description ??
    "A portfolio risk engine that turns complex market data into clear decisions.";
  const tech = project?.tech?.slice(0, 5) ?? ["React", "FastAPI", "C++"];

  return (
    <main className={styles.preview}>
      <nav className={styles.reviewBar} aria-label="Preview navigation">
        <span>Editorial system · proof 01</span>
        <span className={styles.reviewNote}>Isolated review — live folio unchanged</span>
        <Link href="/">Return to portfolio ↗</Link>
      </nav>

      <EditorialSpread
        archetype="feature"
        label="Feature spread archetype preview for Harbor Risk"
      >
        <article className={styles.inkPage}>
          <EditorialMasthead
            page="05"
            section="Field report"
            note="Systems / 2026"
            onInk
          />

          <div className={styles.inkTitle} aria-hidden="true">
            <span>HAR</span>
            <span>BOR</span>
          </div>

          <div className={styles.mediaWrap}>
            <EditorialMediaFrame
              src={mediaSrc}
              alt={`${title} risk dashboard interface`}
              caption="Fig. 01 — Interface study / live product capture"
              crop="landscape"
              priority
            />
          </div>

          <div className={styles.spineCopy} aria-hidden="true">
            VOL. 01 · SOFTWARE WITH CONSEQUENCE
          </div>

          <div className={styles.inkFooter}>
            <span>James Duong</span>
            <span>Solo full-stack build</span>
          </div>
        </article>

        <article className={styles.paperPage}>
          <EditorialMasthead
            page="06"
            section="Featured work"
            note="Read time / 04 min"
          />

          <div className={styles.headlineBlock}>
            <p className={styles.eyebrow}>Risk, translated</p>
            <h1>See the storm before it hits.</h1>
            <p className={styles.deck}>{description}</p>
          </div>

          <EditorialRule label="The brief" />

          <div className={styles.storyGrid}>
            <div className={styles.projectIdentity}>
              <span className={styles.ordinal}>01</span>
              <div>
                <h2>{title}</h2>
                <p>
                  A calm interface over a serious quantitative core. Every
                  number comes from the analysis pipeline; the language makes
                  it usable by people who do not speak finance.
                </p>
              </div>
            </div>

            <EditorialPullQuote>
              Complex underneath. Clear on the surface.
            </EditorialPullQuote>
          </div>

          <div className={styles.factStrip} aria-label="Project highlights">
            <div>
              <strong>C++</strong>
              <span>Quant engine</span>
            </div>
            <div>
              <strong>10</strong>
              <span>Holdings per analysis</span>
            </div>
            <div>
              <strong>PDF</strong>
              <span>Portable reports</span>
            </div>
          </div>

          <div className={styles.techLine} aria-label="Technology stack">
            {tech.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <EditorialFolio page="06" />
        </article>
      </EditorialSpread>

      <aside className={styles.archetypeKey} aria-label="Available spread archetypes">
        <span>System includes</span>
        <strong>Feature</strong>
        <strong>Index</strong>
        <strong>Profile</strong>
        <strong>Article</strong>
      </aside>
    </main>
  );
}

