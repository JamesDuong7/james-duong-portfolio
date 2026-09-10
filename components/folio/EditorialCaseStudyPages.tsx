import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { portableTextToPlain } from "@/lib/portableText";
import {
  usableScreenshots,
  type FolioScreenshot,
  type ProjectDetail,
} from "@/sanity/lib/types";
import FolioFlip from "./FolioFlip";
import { FolioLinkButton, FolioPrimaryButton } from "./FolioControls";
import styles from "./EditorialCaseStudyPages.module.css";

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.richList}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
};

type BasePageProps = {
  page: string;
  project: ProjectDetail;
};

function Masthead({
  page,
  section,
  note,
  onInk = false,
}: {
  page: string;
  section: string;
  note: string;
  onInk?: boolean;
}) {
  return (
    <header className={`${styles.masthead} ${onInk ? styles.mastheadInk : ""}`}>
      <span>{page}</span>
      <span>{section}</span>
      <span>{note}</span>
    </header>
  );
}

function PageFolio({ page, onInk = false }: { page: string; onInk?: boolean }) {
  return (
    <footer className={`${styles.folio} ${onInk ? styles.folioInk : ""}`} aria-hidden>
      <span>The Folio</span>
      <span>Aztec Assess / Case 01</span>
      <span>{page}</span>
    </footer>
  );
}

function RichText({ value }: { value: ProjectDetail["overview"] }) {
  if (!value?.length) return null;
  return <PortableText value={value} components={richTextComponents} />;
}

function ProjectPlate({
  screenshot,
  title,
}: {
  screenshot?: FolioScreenshot;
  title: string;
}) {
  return (
    <figure className={styles.projectPlate}>
      <div className={styles.projectMedia}>
        {screenshot?.url ? (
          <Image
            src={screenshot.url}
            alt={screenshot.alt?.trim() || `${title} product interface`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.projectImage}
            priority
            placeholder={screenshot.lqip ? "blur" : "empty"}
            blurDataURL={screenshot.lqip ?? undefined}
          />
        ) : (
          <div
            className={styles.interfacePlaceholder}
            role="img"
            aria-label={`Placeholder for an approved ${title} product interface capture`}
          >
            <div className={styles.browserChrome} aria-hidden>
              <i />
              <i />
              <i />
              <span>COURSE / QUIZ SESSION</span>
            </div>
            <div className={styles.mockInterface} aria-hidden>
              <aside>
                <span>AA</span>
                <i />
                <i />
                <i />
              </aside>
              <main>
                <small>QUESTION 07 / 12</small>
                <strong>Adaptive assessment</strong>
                <i />
                <i />
                <i />
                <div>
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                </div>
              </main>
            </div>
            <span className={styles.assetFlag}>Product capture pending</span>
        </div>
        )}
        <span className={`${styles.annotation} ${styles.annotationOne}`} aria-hidden>
          01 / Role-aware routes
        </span>
        <span className={`${styles.annotation} ${styles.annotationTwo}`} aria-hidden>
          02 / Adaptive path
        </span>
      </div>
      <figcaption>
        <span>Fig. 01</span>
        <span>
          {screenshot?.url
            ? screenshot.alt || `${title} product interface`
            : "Placeholder composition — replace with an approved product capture"}
        </span>
      </figcaption>
    </figure>
  );
}

export function EditorialCaseStudyOpenerPage({
  page,
  project,
  previousTarget,
}: BasePageProps & { previousTarget: string }) {
  const screenshot = usableScreenshots(project.screenshots)[0];

  return (
    <div className={`${styles.leaf} ${styles.inkLeaf}`} data-editorial-archetype="feature">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.openerInner}`}>
          <Masthead page={page} section="Lead case study" note="Product / Education" onInk />

          <div className={styles.titleLockup}>
            <div>
              <p className={styles.eyebrow}>Adaptive learning, role-aware delivery</p>
              <h1>{project.title}</h1>
            </div>
            <span className={styles.caseNumber} aria-hidden>01</span>
          </div>

          <ProjectPlate screenshot={screenshot ?? undefined} title={project.title} />

          {project.description && <p className={styles.deck}>{project.description}</p>}

          <dl className={styles.scanRail}>
            <div>
              <dt>Role</dt>
              <dd>Frontend engineer</dd>
            </div>
            <div>
              <dt>Surface</dt>
              <dd>Web application</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Active development</dd>
            </div>
          </dl>

          {project.tech && project.tech.length > 0 && (
            <div className={styles.stackLine}>
              <span>Stack</span>
              <p>{project.tech.join(" · ")}</p>
            </div>
          )}

          <PageFolio page={page} onInk />
        </div>
      </div>

      <FolioFlip direction="back" label="← Previous page" target={previousTarget} />
    </div>
  );
}

export function EditorialCaseStudyBriefPage({
  page,
  project,
  nextTarget,
}: BasePageProps & { nextTarget: string }) {
  const pullQuote = portableTextToPlain(project.learning, " ");

  return (
    <div className={`${styles.leaf} ${styles.paperLeaf}`} data-editorial-archetype="article">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.briefInner}`}>
          <Masthead page={page} section="The brief" note="Read / 04 min" />

          <div className={styles.articleTitle}>
            <p className={styles.eyebrow}>The assignment</p>
            <h2>Make one platform feel native to every role.</h2>
          </div>

          <dl className={styles.deliverySignals} aria-label="Project delivery signals">
            <div>
              <dt>Working today</dt>
              <dd>Auth, courses, question banks and quiz attempts</dd>
            </div>
            <div>
              <dt>Identity paths</dt>
              <dd>Email, Google and Microsoft</dd>
            </div>
            <div>
              <dt>Quality evidence</dt>
              <dd>Frontend and backend automated tests</dd>
            </div>
          </dl>

          {project.role && (
            <section className={styles.roleCallout}>
              <span>My role</span>
              <p>{project.role}</p>
            </section>
          )}

          <div className={styles.articleColumns}>
            {project.overview?.length ? (
              <section>
                <h3>Overview</h3>
                <div className={styles.richText}><RichText value={project.overview} /></div>
              </section>
            ) : null}
            {project.problem?.length ? (
              <section>
                <h3>The problem</h3>
                <div className={styles.richText}><RichText value={project.problem} /></div>
              </section>
            ) : null}
          </div>

          {pullQuote && (
            <blockquote className={styles.pullQuote}>
              “{pullQuote.split(/(?<=[.!?])\s/)[0]}”
            </blockquote>
          )}

          <PageFolio page={page} />
        </div>
      </div>

      <FolioFlip direction="forward" label="Continue → System" target={nextTarget} />
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <figure className={styles.architecture}>
      <figcaption>
        <span>Fig. 02</span>
        <span>Role-aware request path</span>
      </figcaption>
      <ol aria-label="Aztec Assess system architecture">
        <li>
          <span>01</span>
          <strong>React interface</strong>
          <small>Role-aware routes · OAuth · quiz UI</small>
        </li>
        <li>
          <span>02</span>
          <strong>Django REST API</strong>
          <small>Permissions · courses · attempt services</small>
        </li>
        <li>
          <span>03</span>
          <strong>PostgreSQL</strong>
          <small>Users · banks · quizzes · answers</small>
        </li>
      </ol>
      <div className={styles.systemNotes} aria-hidden>
        <span>JWT refresh boundary</span>
        <span>Transactional attempt update</span>
      </div>
    </figure>
  );
}

function AdaptiveFlow() {
  const steps = [
    "Answer submitted",
    "Attempt recorded",
    "Difficulty adjusts",
    "Next unused question",
  ];

  return (
    <section className={styles.flowSection} aria-labelledby="adaptive-flow-title">
      <div className={styles.sectionHeading}>
        <span>Interaction sequence</span>
        <h3 id="adaptive-flow-title">One answer, four deliberate steps.</h3>
      </div>
      <ol className={styles.flowList}>
        {steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EditorialCaseStudySystemPage({
  page,
  project,
  previousTarget,
}: BasePageProps & { previousTarget: string }) {
  const secondaryScreenshot = usableScreenshots(project.screenshots)[1];

  return (
    <div className={`${styles.leaf} ${styles.paperLeaf}`} data-editorial-archetype="feature">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.systemInner}`}>
          <Masthead page={page} section="System map" note="Build / Architecture" />

          <div className={styles.articleTitle}>
            <p className={styles.eyebrow}>Under the interface</p>
            <h2>A campus quiz, end to end.</h2>
          </div>

          <ArchitectureDiagram />
          <AdaptiveFlow />

          {secondaryScreenshot?.url && (
            <figure className={styles.secondaryFigure}>
              <Image
                src={secondaryScreenshot.url}
                alt={secondaryScreenshot.alt?.trim() || `${project.title} workflow`}
                width={secondaryScreenshot.width || 1600}
                height={secondaryScreenshot.height || 900}
              />
              <figcaption>Fig. 03 / {secondaryScreenshot.alt || `${project.title} workflow`}</figcaption>
            </figure>
          )}

          {project.implementationDetails?.length ? (
            <section className={styles.deepSection}>
              <div className={styles.sectionHeading}>
                <span>Implementation</span>
                <h3>The seams are part of the product.</h3>
              </div>
              <div className={`${styles.richText} ${styles.implementationText}`}>
                <RichText value={project.implementationDetails} />
              </div>
            </section>
          ) : null}

          <PageFolio page={page} />
        </div>
      </div>

      <FolioFlip direction="back" label="← Case opener" target={previousTarget} />
    </div>
  );
}

export function EditorialCaseStudyFieldNotesPage({
  page,
  project,
  nextTarget,
  nextTitle,
}: BasePageProps & { nextTarget: string; nextTitle?: string | null }) {
  return (
    <div className={`${styles.leaf} ${styles.paperLeaf}`} data-editorial-archetype="article">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.notesInner}`}>
          <Masthead page={page} section="Field notes" note="Ship / Learn / Iterate" />

          <div className={styles.articleTitle}>
            <p className={styles.eyebrow}>Delivery record</p>
            <h2>What shipped, what changed.</h2>
          </div>

          {project.features && project.features.length > 0 && (
            <section className={styles.featureSection}>
              <div className={styles.sectionHeading}>
                <span>{String(project.features.length).padStart(2, "0")} capabilities</span>
                <h3>Product surface</h3>
              </div>
              <ol className={styles.featureGrid}>
                {project.features.map((feature, index) => (
                  <li key={feature}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{feature}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className={styles.notesColumns}>
            {project.challenges?.length ? (
              <section className={styles.deepSection}>
                <div className={styles.sectionHeading}>
                  <span>Friction log</span>
                  <h3>Challenges</h3>
                </div>
                <div className={styles.richText}><RichText value={project.challenges} /></div>
              </section>
            ) : null}

            {project.learning?.length ? (
              <section className={styles.deepSection}>
                <div className={styles.sectionHeading}>
                  <span>Retrospective</span>
                  <h3>Lessons learned</h3>
                </div>
                <div className={styles.richText}><RichText value={project.learning} /></div>
              </section>
            ) : null}
          </div>

          {project.future?.length ? (
            <section className={`${styles.deepSection} ${styles.futureSection}`}>
              <div className={styles.sectionHeading}>
                <span>Next edition</span>
                <h3>Future</h3>
              </div>
              <div className={styles.richText}><RichText value={project.future} /></div>
            </section>
          ) : null}

          <div className={styles.actions}>
            {project.github && (
              <FolioPrimaryButton
                href={project.github}
                external
                ariaLabel={`View ${project.title} source on GitHub`}
              >
                View Source on GitHub
              </FolioPrimaryButton>
            )}
            {project.live && (
              <FolioLinkButton href={project.live} arrow="↗" ariaLabel="Live demo">
                Live Demo
              </FolioLinkButton>
            )}
          </div>

          <PageFolio page={page} />
        </div>
      </div>

      <FolioFlip
        direction="forward"
        label={nextTitle ? `Flip page → ${nextTitle}` : "Flip page → Contact"}
        target={nextTarget}
      />
    </div>
  );
}
