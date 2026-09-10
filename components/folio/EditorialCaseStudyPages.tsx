import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { portableTextToPlain } from "@/lib/portableText";
import {
  usableScreenshots,
  type FolioScreenshot,
  type ProjectDetail,
} from "@/sanity/lib/types";
import { parseYouTubeVideoId } from "@/lib/youtube";
import FolioFlip from "./FolioFlip";
import { FolioLinkButton, FolioPrimaryButton } from "./FolioControls";
import FolioDemoVideo from "./FolioDemoVideo";
import styles from "./EditorialCaseStudyPages.module.css";

type EditorialProfile = {
  caseNumber: string;
  category: string;
  openerEyebrow: string;
  assignment: string;
  readTime: string;
  signals: [
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
  ];
  roleSummary: string;
  surface: string;
  status: string;
  systemEyebrow: string;
  systemTitle: string;
  architecture: [
    { label: string; detail: string },
    { label: string; detail: string },
    { label: string; detail: string },
  ];
  systemNotes: [string, string];
  flowTitle: string;
  flowSteps: [string, string, string, string];
  implementationTitle: string;
  fieldTitle: string;
  visual: "assessment" | "risk" | "forecast" | "notifier" | "portfolio";
  visualMeta: string;
  visualTitle: string;
  visualStates: [string, string, string];
  visualMark: string;
};

const editorialProfiles: Record<string, EditorialProfile> = {
  "aztec-assess": {
    caseNumber: "01",
    category: "Product / Education",
    openerEyebrow: "Adaptive learning, role-aware delivery",
    assignment: "Make one platform feel native to every role.",
    readTime: "04 min",
    signals: [
      { label: "Working today", value: "Auth, courses, question banks and quiz attempts" },
      { label: "Identity paths", value: "Email, Google and Microsoft" },
      { label: "Quality evidence", value: "Frontend and backend automated tests" },
    ],
    roleSummary: "Frontend engineer",
    surface: "Web application",
    status: "Active development",
    systemEyebrow: "Under the interface",
    systemTitle: "A campus quiz, end to end.",
    architecture: [
      { label: "React interface", detail: "Role-aware routes · OAuth · quiz UI" },
      { label: "Django REST API", detail: "Permissions · courses · attempt services" },
      { label: "PostgreSQL", detail: "Users · banks · quizzes · answers" },
    ],
    systemNotes: ["JWT refresh boundary", "Transactional attempt update"],
    flowTitle: "One answer, four deliberate steps.",
    flowSteps: ["Answer submitted", "Attempt recorded", "Difficulty adjusts", "Next unused question"],
    implementationTitle: "The seams are part of the product.",
    fieldTitle: "What shipped, what changed.",
    visual: "assessment",
    visualMeta: "Question 07 / 12",
    visualTitle: "Adaptive assessment",
    visualStates: ["Easy", "Medium", "Hard"],
    visualMark: "AA",
  },
  "harbor-risk": {
    caseNumber: "02",
    category: "Product / Finance",
    openerEyebrow: "Quantitative risk, explained plainly",
    assignment: "Turn portfolio risk into a story people can use.",
    readTime: "04 min",
    signals: [
      { label: "Risk engine", value: "VaR, Expected Shortfall and Monte Carlo" },
      { label: "Plain language", value: "Every technical term earns an explanation" },
      { label: "Takeaway", value: "Downloadable PDF with math-sourced figures" },
    ],
    roleSummary: "Solo full-stack engineer",
    surface: "Risk dashboard",
    status: "Demo available",
    systemEyebrow: "From holdings to evidence",
    systemTitle: "Serious math, calm interface.",
    architecture: [
      { label: "React dashboard", detail: "Holdings · charts · plain-language narrative" },
      { label: "FastAPI + Python", detail: "Market data · orchestration · reports" },
      { label: "C++ quant core", detail: "VaR · ES · Monte Carlo simulation" },
    ],
    systemNotes: ["JSON CLI contract", "Numbers stay math-sourced"],
    flowTitle: "One request, three languages, no invented numbers.",
    flowSteps: ["Holdings entered", "Prices assembled", "Risk computed", "Report returned"],
    implementationTitle: "Each layer has one honest job.",
    fieldTitle: "Risk, without the black box.",
    visual: "risk",
    visualMeta: "Portfolio / 04 holdings",
    visualTitle: "Risk range",
    visualStates: ["VaR", "Drawdown", "ES"],
    visualMark: "HR",
  },
  nextgame: {
    caseNumber: "03",
    category: "Product / Machine Learning",
    openerEyebrow: "Forecasting with honest uncertainty",
    assignment: "Predict the next game without borrowing from the future.",
    readTime: "05 min",
    signals: [
      { label: "Forecast", value: "Low, median and high scoring outcomes" },
      { label: "Trust layer", value: "Time-safe backtests and calibration views" },
      { label: "Operations", value: "Queued ingestion, features and retraining" },
    ],
    roleSummary: "Full-stack ML engineer",
    surface: "Forecasting dashboard",
    status: "Demo-ready system",
    systemEyebrow: "Before tip-off",
    systemTitle: "A forecast that cannot see tomorrow.",
    architecture: [
      { label: "Next.js interface", detail: "Slates · players · explainability · admin" },
      { label: "FastAPI + workers", detail: "Predictions · Redis queues · async jobs" },
      { label: "Data + model layer", detail: "Postgres · Pandas · gradient boosting" },
    ],
    systemNotes: ["Shifted rolling features", "Precomputed game-day slate"],
    flowTitle: "Heavy work happens before game time.",
    flowSteps: ["Games ingested", "Features rebuilt", "Model predicts", "Backtest verifies"],
    implementationTitle: "Trust is an infrastructure feature.",
    fieldTitle: "Forecasts that explain themselves.",
    visual: "forecast",
    visualMeta: "Player / next matchup",
    visualTitle: "Projected points",
    visualStates: ["P10", "P50", "P90"],
    visualMark: "NG",
  },
  "job-posting-notifier": {
    caseNumber: "04",
    category: "Automation / Job Search",
    openerEyebrow: "Watch the list, surface the change",
    assignment: "Catch new roles without rereading the same README.",
    readTime: "03 min",
    signals: [
      { label: "Cadence", value: "Scheduled check every 30 minutes" },
      { label: "Memory", value: "Stable hashes and JSON-backed state" },
      { label: "Delivery", value: "Deduplicated Discord webhook alerts" },
    ],
    roleSummary: "Automation engineer",
    surface: "Scheduled automation",
    status: "Operational workflow",
    systemEyebrow: "Small system, clear boundary",
    systemTitle: "No server, no database, no missed row.",
    architecture: [
      { label: "GitHub README", detail: "Changing markdown job tables" },
      { label: "Python workflow", detail: "Parse · normalize · hash · compare" },
      { label: "Discord webhook", detail: "New-role alerts with a batch cap" },
    ],
    systemNotes: ["Idempotent by default", "State committed only when changed"],
    flowTitle: "Wake, compare, notify, disappear.",
    flowSteps: ["Workflow wakes", "README parsed", "New rows diffed", "Alerts delivered"],
    implementationTitle: "The smallest reliable architecture won.",
    fieldTitle: "A narrow tool with durable edges.",
    visual: "notifier",
    visualMeta: "Workflow / scheduled run",
    visualTitle: "3 new roles found",
    visualStates: ["Fetch", "Diff", "Notify"],
    visualMark: "JN",
  },
  "personal-developer-portfolio": {
    caseNumber: "05",
    category: "Platform / Publishing",
    openerEyebrow: "Content-led engineering, editorial delivery",
    assignment: "Let the work evolve without shipping code for every edit.",
    readTime: "03 min",
    signals: [
      { label: "Publishing", value: "Sanity-managed projects and personal content" },
      { label: "Delivery", value: "Next.js Server Components and Vercel" },
      { label: "Quality", value: "Typed, linted and browser-tested" },
    ],
    roleSummary: "Full-stack product engineer",
    surface: "Editorial portfolio",
    status: "Live and evolving",
    systemEyebrow: "The publication engine",
    systemTitle: "A portfolio that edits itself.",
    architecture: [
      { label: "Sanity Content Lake", detail: "Projects · rich text · media · profile" },
      { label: "Next.js composition", detail: "Server data · React pages · metadata" },
      { label: "Vercel delivery", detail: "Build checks · edge cache · production" },
    ],
    systemNotes: ["Optional fields fail gracefully", "Content and layout stay separate"],
    flowTitle: "Publish once, compose everywhere.",
    flowSteps: ["Editor publishes", "Content fetched", "Spread composed", "Reader navigates"],
    implementationTitle: "The CMS stays behind the story.",
    fieldTitle: "A portfolio built like a publication.",
    visual: "portfolio",
    visualMeta: "Issue / live content",
    visualTitle: "The Folio",
    visualStates: ["Read", "Build", "Contact"],
    visualMark: "JD",
  },
};

function projectKey(project: ProjectDetail) {
  const id = project.id?.replace(/^project-/, "");
  return id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function editorialProfile(project: ProjectDetail): EditorialProfile {
  return editorialProfiles[projectKey(project)] ?? {
    ...editorialProfiles["personal-developer-portfolio"],
    caseNumber: "—",
    category: "Project / Field Notes",
    openerEyebrow: "Built, tested and documented",
    assignment: project.description || "A closer look at the problem, system and result.",
    roleSummary: "Independent engineer",
    surface: "Digital product",
    status: "Project archive",
    visualMeta: "Project / system view",
    visualTitle: project.title,
    visualMark: project.title.slice(0, 2).toUpperCase(),
  };
}

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

function PageFolio({
  page,
  project,
  profile,
  onInk = false,
}: {
  page: string;
  project: ProjectDetail;
  profile: EditorialProfile;
  onInk?: boolean;
}) {
  return (
    <footer className={`${styles.folio} ${onInk ? styles.folioInk : ""}`} aria-hidden>
      <span>The Folio</span>
      <span>{project.title} / Case {profile.caseNumber}</span>
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
  project,
  profile,
}: {
  screenshot?: FolioScreenshot;
  project: ProjectDetail;
  profile: EditorialProfile;
}) {
  const hasDemo = Boolean(parseYouTubeVideoId(project.demoVideoUrl));

  if (!screenshot?.url && hasDemo) {
    return (
      <div className={styles.demoPlate}>
        <FolioDemoVideo
          url={project.demoVideoUrl}
          title={project.title}
          caption={`Demo film — ${project.title}`}
        />
      </div>
    );
  }

  return (
    <figure className={styles.projectPlate}>
      <div className={styles.projectMedia}>
        {screenshot?.url ? (
          <Image
            src={screenshot.url}
            alt={screenshot.alt?.trim() || `${project.title} product interface`}
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
            data-visual={profile.visual}
            role="img"
            aria-label={`Placeholder for an approved ${project.title} project visual`}
          >
            <div className={styles.browserChrome} aria-hidden>
              <i />
              <i />
              <i />
              <span>{profile.visualMeta}</span>
            </div>
            <div className={styles.mockInterface} aria-hidden>
              <aside>
                <span>{profile.visualMark}</span>
                <i />
                <i />
                <i />
              </aside>
              <main>
                <small>{profile.visualMeta}</small>
                <strong>{profile.visualTitle}</strong>
                <i />
                <i />
                <i />
                <div>
                  {profile.visualStates.map((state) => <span key={state}>{state}</span>)}
                </div>
              </main>
            </div>
            <span className={styles.assetFlag}>Product capture pending</span>
          </div>
        )}
        <span className={`${styles.annotation} ${styles.annotationOne}`} aria-hidden>
          01 / {profile.architecture[0].label}
        </span>
        <span className={`${styles.annotation} ${styles.annotationTwo}`} aria-hidden>
          02 / {profile.flowSteps[2]}
        </span>
      </div>
      <figcaption>
        <span>Fig. 01</span>
        <span>
          {screenshot?.url
            ? screenshot.alt || `${project.title} product interface`
            : "Placeholder composition — replace with an approved project visual"}
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
  const profile = editorialProfile(project);
  const titleWords = project.title.trim().split(/\s+/);
  const hasLongTitleWord = titleWords.some((word) => word.length >= 9);

  return (
    <div className={`${styles.leaf} ${styles.inkLeaf}`} data-editorial-archetype="feature">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.openerInner}`}>
          <Masthead page={page} section="Case study" note={profile.category} onInk />

          <div
            className={styles.titleLockup}
            data-single-word={titleWords.length === 1 ? "true" : "false"}
            data-long-word={hasLongTitleWord ? "true" : "false"}
          >
            <div>
              <p className={styles.eyebrow}>{profile.openerEyebrow}</p>
              <h1>{project.title}</h1>
            </div>
            <span className={styles.caseNumber} aria-hidden>{profile.caseNumber}</span>
          </div>

          <ProjectPlate
            screenshot={screenshot ?? undefined}
            project={project}
            profile={profile}
          />

          {project.description && <p className={styles.deck}>{project.description}</p>}

          <dl className={styles.scanRail}>
            <div>
              <dt>Role</dt>
              <dd>{profile.roleSummary}</dd>
            </div>
            <div>
              <dt>Surface</dt>
              <dd>{profile.surface}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{profile.status}</dd>
            </div>
          </dl>

          {project.tech && project.tech.length > 0 && (
            <div className={styles.stackLine}>
              <span>Stack</span>
              <p>{project.tech.join(" · ")}</p>
            </div>
          )}

          <PageFolio page={page} project={project} profile={profile} onInk />
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
  const profile = editorialProfile(project);

  return (
    <div className={`${styles.leaf} ${styles.paperLeaf}`} data-editorial-archetype="article">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.briefInner}`}>
          <Masthead page={page} section="The brief" note={`Read / ${profile.readTime}`} />

          <div className={styles.articleTitle}>
            <p className={styles.eyebrow}>The assignment</p>
            <h2>{profile.assignment}</h2>
          </div>

          <dl className={styles.deliverySignals} aria-label="Project delivery signals">
            {profile.signals.map((signal) => (
              <div key={signal.label}>
                <dt>{signal.label}</dt>
                <dd>{signal.value}</dd>
              </div>
            ))}
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

          <PageFolio page={page} project={project} profile={profile} />
        </div>
      </div>

      <FolioFlip direction="forward" label="Continue → System" target={nextTarget} />
    </div>
  );
}

function ArchitectureDiagram({
  project,
  profile,
}: {
  project: ProjectDetail;
  profile: EditorialProfile;
}) {
  return (
    <figure className={styles.architecture}>
      <figcaption>
        <span>Fig. 02</span>
        <span>Role-aware request path</span>
      </figcaption>
      <ol aria-label={`${project.title} system architecture`}>
        {profile.architecture.map((node, index) => (
          <li key={node.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{node.label}</strong>
            <small>{node.detail}</small>
          </li>
        ))}
      </ol>
      <div className={styles.systemNotes} aria-hidden>
        <span>{profile.systemNotes[0]}</span>
        <span>{profile.systemNotes[1]}</span>
      </div>
    </figure>
  );
}

function SystemFlow({ profile }: { profile: EditorialProfile }) {
  return (
    <section className={styles.flowSection}>
      <div className={styles.sectionHeading}>
        <span>Interaction sequence</span>
        <h3>{profile.flowTitle}</h3>
      </div>
      <ol className={styles.flowList}>
        {profile.flowSteps.map((step, index) => (
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
  const profile = editorialProfile(project);

  return (
    <div className={`${styles.leaf} ${styles.paperLeaf}`} data-editorial-archetype="feature">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.systemInner}`}>
          <Masthead page={page} section="System map" note="Build / Architecture" />

          <div className={styles.articleTitle}>
            <p className={styles.eyebrow}>{profile.systemEyebrow}</p>
            <h2>{profile.systemTitle}</h2>
          </div>

          <ArchitectureDiagram project={project} profile={profile} />
          <SystemFlow profile={profile} />

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
                <h3>{profile.implementationTitle}</h3>
              </div>
              <div className={`${styles.richText} ${styles.implementationText}`}>
                <RichText value={project.implementationDetails} />
              </div>
            </section>
          ) : null}

          <PageFolio page={page} project={project} profile={profile} />
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
  const profile = editorialProfile(project);

  return (
    <div className={`${styles.leaf} ${styles.paperLeaf}`} data-editorial-archetype="article">
      <div className={styles.scroll}>
        <div className={`${styles.inner} ${styles.notesInner}`}>
          <Masthead page={page} section="Field notes" note="Ship / Learn / Iterate" />

          <div className={styles.articleTitle}>
            <p className={styles.eyebrow}>Delivery record</p>
            <h2>{profile.fieldTitle}</h2>
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

          <PageFolio page={page} project={project} profile={profile} />
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
