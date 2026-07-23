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
import CaseStudyInkPage from "./CaseStudyInkPage";
import CaseStudyPaperPage from "./CaseStudyPaperPage";
import FolioSpineMark from "./FolioSpineMark";
import BlankPage from "./BlankPage";
import ContactIntroPage from "./ContactIntroPage";
import ContactFormPage from "./ContactFormPage";
import {
  fetchAllProjectsDetail,
  fetchPersonalInfo,
} from "@/sanity/lib/fetch";
import { portableTextToPlain } from "@/lib/portableText";

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
  const headline =
    info?.headline ?? "Computer Science Student & Software Engineer";
  const about = portableTextToPlain(info?.aboutMe, " ");
  const location = info?.location;
  const email = info?.email;
  const github = info?.github;
  const linkedin = info?.linkedin;
  const resumeUrl = info?.resumeUrl;
  const languages = info?.skills?.languages ?? [];
  const frameworks = info?.skills?.frameworks ?? [];
  const tools = info?.skills?.tools ?? [];

  const hobbies = (info?.hobbies ?? []).filter((h) => Boolean(h?.title));

  const orderedProjects = (projects ?? [])
    .map((project) => {
      const slug =
        stegaClean(project.id ?? "") ||
        slugify(project.title ?? "project");
      return { ...project, slug };
    })
    .filter((project) => Boolean(project.slug));

  const featuredItems = orderedProjects
    .filter((p) => p.featured)
    .map((p) => ({
      slug: p.slug,
      title: p.title ?? "Untitled",
      description: p.description ?? "",
    }));

  const restItems = orderedProjects
    .filter((p) => !p.featured)
    .map((p) => ({
      slug: p.slug,
      title: p.title ?? "Untitled",
      description: p.description ?? "",
    }));

  const nextPage = createPageAllocator();

  const aboutPage = nextPage();
  const hobbyMeta = hobbies.map((hobby) => {
    const title = hobby.title ? stegaClean(hobby.title) : "Hobby";
    return {
      id: `hobby-${slugify(title)}`,
      title,
      description: hobby.description,
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
        />
      ),
    },
  });

  // Each project owns one ink | paper case study spread
  projectMeta.forEach((project, index) => {
    const nextTitle = projectMeta[index + 1]
      ? stegaClean(projectMeta[index + 1].title ?? "Next")
      : null;

    spreads.push({
      label: `${stegaClean(project.title ?? "Project")} case study`,
      left: {
        id: project.id,
        label: stegaClean(project.title ?? "Case study"),
        tone: "ink",
        node: <CaseStudyInkPage page={project.page} project={project} />,
      },
      right: {
        id: `${project.id}-article`,
        label: `${stegaClean(project.title ?? "Project")} article`,
        tone: "paper",
        node: (
          <CaseStudyPaperPage
            page={project.pageRight}
            project={project}
            nextTitle={nextTitle}
          />
        ),
      },
    });
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
              <CoverPage name={name} headline={headline} location={location} />
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
