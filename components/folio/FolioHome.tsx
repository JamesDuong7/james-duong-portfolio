import { stegaClean } from "@sanity/client/stega";
import type { ReactNode } from "react";
import FolioBook from "./FolioBook";
import FolioSpread, { FolioPage } from "./FolioSpread";
import FolioTocNav from "./FolioTocNav";
import WoodTablePage from "./WoodTablePage";
import CoverPage from "./CoverPage";
import TableOfContentsPage, {
  type TocEntry,
  type TocSection,
} from "./TableOfContentsPage";
import AboutMePage from "./AboutMePage";
import HobbyPage from "./HobbyPage";
import SectionOpenerPage from "./SectionOpenerPage";
import WorksCatalogPage from "./WorksCatalogPage";
import {
  EditorialCaseStudyBriefPage,
  EditorialCaseStudyFieldNotesPage,
  EditorialCaseStudyOpenerPage,
  EditorialCaseStudySystemPage,
} from "./EditorialCaseStudyPages";
import FolioSpineMark from "./FolioSpineMark";
import BlankPage from "./BlankPage";
import ContactIntroPage from "./ContactIntroPage";
import ContactFormPage from "./ContactFormPage";
import {
  fetchAllProjectsDetail,
  fetchPersonalInfo,
} from "@/sanity/lib/fetch";
import { primaryScreenshot, usableScreenshots } from "@/sanity/lib/types";
import { localProjectMedia } from "@/lib/projectMedia";
import { parseYouTubeVideoId, youtubePosterUrl } from "@/lib/youtube";

type LeafPage = {
  id: string;
  label: string;
  tone: "ink" | "paper";
  node: ReactNode;
};

type SpreadSpec = {
  label: string;
  left: LeafPage;
  right: LeafPage;
  overlay?: ReactNode;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Allocate continuous magazine page numbers during composition. */
function createPageAllocator() {
  let n = 0;
  return () => {
    n += 1;
    return pad(n);
  };
}

function blankLeaf(key: string): LeafPage {
  return {
    id: `blank-${key}`,
    label: "Blank",
    tone: "paper",
    node: <BlankPage />,
  };
}

/** Pair a list of item leaves into spreads, padding a trailing blank if odd. */
function pairLeaves(
  items: LeafPage[],
  render: (leaf: LeafPage, side: "left" | "right") => LeafPage,
): SpreadSpec[] {
  const spreads: SpreadSpec[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const rawLeft = items[i];
    const rawRight = items[i + 1] ?? blankLeaf(`${rawLeft.id}-pad`);
    const left = render(rawLeft, "left");
    const right = items[i + 1] ? render(rawRight, "right") : rawRight;
    spreads.push({
      label: `${left.label} and ${right.label}`,
      left,
      right,
    });
  }
  return spreads;
}

export default async function FolioHome() {
  const [info, projects] = await Promise.all([
    fetchPersonalInfo(),
    fetchAllProjectsDetail(),
  ]);

  const name = info?.name ?? "James Duong";
  const coverHeadline =
    "Software Engineer building full-stack, cloud, and automation systems";
  const coverSupportingLine = "M.S. Computer Science · SDSU · Dec. 2027";
  const about = [
    "I’m a software engineer and M.S. Computer Science student at San Diego State University, graduating in December 2027. I enjoy full-stack development because it lets me turn ideas into complete products that people can actually use.",
    "I’m drawn to cloud engineering because it brings together software development, system architecture, and real-world operations. I naturally notice repetitive processes and look for ways to simplify them, using automation to save time and make work more efficient.",
    "I value organization because it keeps projects efficient and priorities clear. I’m detail-oriented about doing work correctly, and I enjoy collaborating because exchanging perspectives often leads to stronger ideas and unexpected solutions.",
  ];
  const education =
    "M.S. Computer Science · San Diego State University · Expected December 2027";
  const availability =
    "Internship or part-time · Remote, hybrid, or in person in San Diego";
  const location = info?.location;
  const email = info?.email;
  const github = info?.github;
  const linkedin = info?.linkedin;
  const resumeUrl = info?.resumeUrl;
  const languages = info?.skills?.languages ?? [];
  const frameworks = info?.skills?.frameworks ?? [];
  const tools = info?.skills?.tools ?? [];

  const sourceHobbies = (info?.hobbies ?? []).filter((h) => Boolean(h?.title));
  const editorialHobbies = [
    {
      title: "Training",
      description:
        "Training helps me stay healthy while reinforcing discipline and consistency. I enjoy the gradual, measurable progress that comes from sustained effort.",
      keywords: ["gym", "fitness", "training", "lifting"],
    },
    {
      title: "Manga & Anime",
      description:
        "I’m drawn to expressive artwork, imaginative storytelling, detailed world-building, fantasy settings, and memorable characters. Current shelf: Attack on Titan, Jujutsu Kaisen, and Frieren: Beyond Journey’s End.",
      keywords: ["anime", "manga"],
    },
    {
      title: "Personal Experiments",
      description:
        "I build small tools around problems I encounter. One workflow batches job listings into Google Sheets—cutting tracking from about 15 seconds per listing to five seconds per batch—and helps me tailor each resume while keeping the final review in my hands.",
      keywords: ["automation", "coding", "programming", "experiment"],
    },
  ];
  const hobbies = editorialHobbies.map((hobby) => {
    const source = sourceHobbies.find((candidate) => {
      const title = stegaClean(candidate.title ?? "").toLowerCase();
      return hobby.keywords.some((keyword) => title.includes(keyword));
    });
    return {
      title: hobby.title,
      description: hobby.description,
      imageUrl: source?.imageUrl ?? null,
    };
  });

  const orderedProjects = (projects ?? [])
    .map((project) => {
      const slug =
        stegaClean(project.id ?? "") ||
        slugify(project.title ?? "project");
      const localMedia = localProjectMedia[slug];
      const screenshots = usableScreenshots(project.screenshots).length
        ? project.screenshots
        : localMedia?.screenshots ?? project.screenshots;
      return {
        ...project,
        screenshots,
        localDemoVideoUrl: localMedia?.demoVideoUrl,
        localDemoPosterUrl: localMedia?.demoPosterUrl,
        slug,
      };
    })
    .filter((project) => Boolean(project.slug));

  const toCatalogItem = (project: (typeof orderedProjects)[number]) => {
    const shot = primaryScreenshot(project.screenshots);
    const videoId = parseYouTubeVideoId(project.demoVideoUrl);
    return {
      slug: project.slug,
      title: stegaClean(project.title ?? "Untitled"),
      description: project.description ?? "",
      imageUrl: shot?.url ?? (videoId ? youtubePosterUrl(videoId) : null),
      imageAlt: shot?.alt,
      tech: project.tech?.filter(Boolean).slice(0, 3) ?? [],
    };
  };

  const featuredItems = orderedProjects
    .filter((p) => p.featured)
    .map(toCatalogItem);

  const restItems = orderedProjects
    .filter((p) => !p.featured)
    .map(toCatalogItem);

  const coverProjects = [...orderedProjects]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 2)
    .map(toCatalogItem);

  const nextPage = createPageAllocator();

  const aboutPage = nextPage();
  const hobbyMeta = hobbies.map((hobby) => {
    const title = hobby.title ? stegaClean(hobby.title) : "Hobby";
    return {
      id: `hobby-${slugify(title)}`,
      title,
      description: hobby.description,
      imageUrl: hobby.imageUrl,
      page: nextPage(),
    };
  });

  const worksSectionPage = nextPage();
  const projectMeta = orderedProjects.map((project) => {
    const pageLeft = nextPage();
    const pageRight = nextPage();
    return {
      ...project,
      id: `project-${project.slug}`,
      page: pageLeft,
      pageRight,
      systemPage: nextPage(),
      fieldNotesPage: nextPage(),
    };
  });

  const contactPage = nextPage();
  nextPage(); // facing contact-form leaf

  const sections: TocSection[] = [
    {
      id: "contents",
      page: aboutPage,
      title: "About Me",
      items: hobbyMeta.map(
        (hobby): TocEntry => ({
          label: hobby.title,
          target: hobby.id,
          page: hobby.page,
        }),
      ),
    },
    {
      id: "works",
      page: worksSectionPage,
      title: "Works",
      items: projectMeta.map(
        (item): TocEntry => ({
          label: stegaClean(item.title ?? "Untitled"),
          target: item.id,
          page: item.page,
          featured: Boolean(item.featured),
        }),
      ),
    },
    { id: "contact", page: contactPage, title: "Contact", items: [] },
  ];

  const worksBlurb =
    "Featured first, then everything else. Select a row to flip to that case study — no separate page.";

  const hobbyLeaf = (
    meta: (typeof hobbyMeta)[number],
    index: number,
    side: "left" | "right",
  ): LeafPage => ({
    id: meta.id,
    label: meta.title,
    tone: "paper",
    node: (
      <HobbyPage
        page={meta.page}
        title={meta.title}
        description={meta.description}
        imageUrl={meta.imageUrl}
        index={index + 1}
        total={hobbyMeta.length}
        flipBack={side === "left"}
        flipForward={side === "right"}
      />
    ),
  });

  const spreads: SpreadSpec[] = [];

  spreads.push({
    label: "Contents and About Me",
    left: {
      id: "toc",
      label: "Table of Contents",
      tone: "paper",
      node: <TableOfContentsPage sections={sections} />,
    },
    right: {
      id: "contents",
      label: "About Me",
      tone: "paper",
      node: (
        <AboutMePage
          page={aboutPage}
          about={about}
          education={education}
          availability={availability}
          languages={languages}
          frameworks={frameworks}
          tools={tools}
          github={github}
          linkedin={linkedin}
          resumeUrl={resumeUrl}
          flipForwardLabel={
            hobbyMeta.length > 0
              ? "Turn the page → Hobbies"
              : "Turn the page → Works"
          }
          flipForwardTarget={hobbyMeta[0]?.id ?? "works"}
        />
      ),
    },
  });

  const hobbyLeaves = hobbyMeta.map((meta, index) =>
    hobbyLeaf(meta, index, "left"),
  );
  spreads.push(
    ...pairLeaves(hobbyLeaves, (leaf, side) => {
      const index = hobbyMeta.findIndex((h) => h.id === leaf.id);
      return hobbyLeaf(hobbyMeta[index], index, side);
    }),
  );

  // Works index: section title | catalog (featured + non-featured)
  spreads.push({
    label: "Works index",
    left: {
      id: "works",
      label: "Works",
      tone: "paper",
      node: (
        <SectionOpenerPage
          number={worksSectionPage}
          kicker="WORKS"
          title="Works"
          blurb={worksBlurb}
          meta="Index"
          tone="paper"
          backLabel="← Previous page"
          backTarget={hobbyMeta.at(-1)?.id ?? "contents"}
          forwardLabel={undefined}
        />
      ),
    },
    right: {
      id: "works-catalog",
      label: "Works catalog",
      tone: "paper",
      node: (
        <WorksCatalogPage
          page={worksSectionPage}
          featured={featuredItems}
          rest={restItems}
          firstProjectTarget={projectMeta[0]?.id}
        />
      ),
    },
  });

  // Every project uses the approved two-spread editorial case-study system.
  projectMeta.forEach((project, index) => {
    const previousTarget =
      index === 0 ? "works" : `${projectMeta[index - 1].id}-system`;
    const nextTitle = projectMeta[index + 1]
      ? stegaClean(projectMeta[index + 1].title ?? "Next")
      : null;
    const nextTarget = projectMeta[index + 1]?.id ?? "contact";

    spreads.push(
      {
        label: `${stegaClean(project.title ?? "Project")} opener and brief`,
        left: {
          id: project.id,
          label: stegaClean(project.title ?? "Case study"),
          tone: "ink",
          node: (
            <EditorialCaseStudyOpenerPage
              page={project.page}
              project={project}
              previousTarget={previousTarget}
            />
          ),
        },
        right: {
          id: `${project.id}-brief`,
          label: `${stegaClean(project.title ?? "Project")} brief`,
          tone: "paper",
          node: (
            <EditorialCaseStudyBriefPage
              page={project.pageRight}
              project={project}
              nextTarget={`${project.id}-system`}
            />
          ),
        },
      },
      {
        label: `${stegaClean(project.title ?? "Project")} system and field notes`,
        left: {
          id: `${project.id}-system`,
          label: `${stegaClean(project.title ?? "Project")} system map`,
          tone: "paper",
          node: (
            <EditorialCaseStudySystemPage
              page={project.systemPage}
              project={project}
              previousTarget={project.id}
            />
          ),
        },
        right: {
          id: `${project.id}-article`,
          label: `${stegaClean(project.title ?? "Project")} field notes`,
          tone: "paper",
          node: (
            <EditorialCaseStudyFieldNotesPage
              page={project.fieldNotesPage}
              project={project}
              nextTarget={nextTarget}
              nextTitle={nextTitle}
            />
          ),
        },
      },
    );
  });

  spreads.push({
    label: "Contact",
    left: {
      id: "contact",
      label: "Contact intro",
      tone: "ink",
      node: (
        <ContactIntroPage
          page={contactPage}
          email={email}
          location={location}
          github={github}
          linkedin={linkedin}
          resumeUrl={resumeUrl}
        />
      ),
    },
    right: {
      id: "contact-form",
      label: "Contact form",
      tone: "paper",
      node: <ContactFormPage email={email} />,
    },
  });

  return (
    <>
      <FolioBook>
        <FolioSpread
          label="Cover"
          hideGutter
          left={<WoodTablePage />}
          right={
            <FolioPage tone="ink" label="Cover" pageId="cover">
              <CoverPage
                name={name}
                headline={coverHeadline}
                supportingLine={coverSupportingLine}
                location={location}
                hasHobbies={hobbyMeta.length > 0}
                projects={coverProjects}
                portraitUrl={
                  info?.portraitUrl ?? "/james-duong-editorial-portrait.webp"
                }
              />
            </FolioPage>
          }
        />

        {spreads.map((spread) => (
          <FolioSpread
            key={`${spread.left.id}-${spread.right.id}`}
            label={spread.label}
            overlay={spread.overlay}
            left={
              <FolioPage
                tone={spread.left.tone}
                label={spread.left.label}
                pageId={
                  spread.left.id.startsWith("blank-")
                    ? undefined
                    : spread.left.id
                }
                hideOnNarrow={spread.left.id.startsWith("blank-")}
              >
                {spread.left.node}
              </FolioPage>
            }
            right={
              <FolioPage
                tone={spread.right.tone}
                label={spread.right.label}
                pageId={
                  spread.right.id.startsWith("blank-")
                    ? undefined
                    : spread.right.id
                }
                hideOnNarrow={spread.right.id.startsWith("blank-")}
              >
                {spread.right.node}
              </FolioPage>
            }
          />
        ))}
      </FolioBook>

      <FolioTocNav />
      <FolioSpineMark />
    </>
  );
}
