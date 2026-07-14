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
import FeaturedProjectPage from "./FeaturedProjectPage";
import WorkItemPage from "./WorkItemPage";
import BlankPage from "./BlankPage";
import ContactIntroPage from "./ContactIntroPage";
import ContactFormPage from "./ContactFormPage";
import {
  fetchFeaturedProjects,
  fetchPersonalInfo,
  fetchProjectsIndex,
} from "@/sanity/lib/fetch";
import { portableTextToPlain } from "@/lib/portableText";
import type { Hobby } from "@/sanity/lib/types";

/** Sample hobbies so the About Me section reads well before any are set in Sanity. */
const FALLBACK_HOBBIES: Hobby[] = [
  { title: "Bouldering", description: "Chasing problems at the local climbing gym." },
  { title: "Film photography", description: "Shooting 35mm around the city." },
  { title: "Cooking", description: "Recreating dishes from places I've travelled." },
  { title: "Basketball", description: "Pickup games on the weekend." },
  { title: "Reading", description: "Sci-fi and systems-design deep dives." },
  { title: "Coffee", description: "Dialing in the perfect pour-over." },
];

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
    const right = items[i + 1]
      ? render(rawRight, "right")
      : rawRight;
    spreads.push({
      label: `${left.label} and ${right.label}`,
      left,
      right,
    });
  }
  return spreads;
}

export default async function FolioHome() {
  const [info, featuredProjects, projectsIndex] = await Promise.all([
    fetchPersonalInfo(),
    fetchFeaturedProjects(),
    fetchProjectsIndex(),
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

  const sanityHobbies = (info?.hobbies ?? []).filter((h) => Boolean(h?.title));
  const hobbies = sanityHobbies.length > 0 ? sanityHobbies : FALLBACK_HOBBIES;

  const featured = featuredProjects ?? [];
  const allWorks = (projectsIndex ?? []).map((item) => ({
    slug: item.slug ? stegaClean(item.slug) : "",
    title: item.title ?? "Untitled",
    description: item.description ?? "",
  }));

  // Continuous page numbers for TOC + mastheads (cover is outside the count).
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

  const featuredSectionPage = nextPage();
  const featuredMeta = featured.map((project) => {
    const slug =
      stegaClean(project.id ?? "") || slugify(project.title ?? "project");
    return {
      id: `featured-${slug}`,
      project,
      page: nextPage(),
    };
  });

  const worksSectionPage = nextPage();
  const workMeta = allWorks.map((project) => {
    const slug = project.slug || slugify(project.title);
    return {
      id: `work-${slug}`,
      ...project,
      slug,
      page: nextPage(),
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
      id: "featured",
      page: featuredSectionPage,
      title: "Featured Work",
      items: featuredMeta.map(
        (item): TocEntry => ({
          label: stegaClean(item.project.title ?? "Untitled"),
          target: item.id,
          page: item.page,
        }),
      ),
    },
    {
      id: "works",
      page: worksSectionPage,
      title: "All Works",
      items: workMeta.map(
        (item): TocEntry => ({
          label: item.title,
          target: item.id,
          page: item.page,
        }),
      ),
    },
    { id: "contact", page: contactPage, title: "Contact", items: [] },
  ];

  const featuredBlurb =
    "A closer look at the projects I'm proudest of — the problems they solve, the stacks behind them, and what I learned building them.";
  const worksBlurb =
    "Every project in the issue, front to back. Flip through, or open a case study from any leaf.";

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

  const featuredLeaf = (
    meta: (typeof featuredMeta)[number],
    index: number,
    side: "left" | "right",
  ): LeafPage => ({
    id: meta.id,
    label: stegaClean(meta.project.title ?? "Featured project"),
    tone: "paper",
    node: (
      <FeaturedProjectPage
        page={meta.page}
        project={meta.project}
        index={index + 1}
        total={featuredMeta.length}
        flipBack={side === "left"}
        flipForward={side === "right"}
      />
    ),
  });

  const workLeaf = (
    meta: (typeof workMeta)[number],
    index: number,
    side: "left" | "right",
  ): LeafPage => ({
    id: meta.id,
    label: meta.title,
    tone: "paper",
    node: (
      <WorkItemPage
        page={meta.page}
        slug={meta.slug}
        title={meta.title}
        description={meta.description}
        index={index + 1}
        total={workMeta.length}
        flipBack={side === "left"}
        flipForward={side === "right"}
      />
    ),
  });

  const sectionOpener = (
    id: string,
    number: string,
    title: string,
    blurb: string,
    meta: string,
    tone: "ink" | "paper",
    side: "left" | "right",
  ): LeafPage => ({
    id,
    label: title,
    tone,
    node: (
      <SectionOpenerPage
        number={number}
        kicker="SECTION"
        title={title}
        blurb={blurb}
        meta={meta}
        tone={tone}
        backLabel={side === "left" ? "← Previous page" : undefined}
        forwardLabel={side === "right" ? "Turn the page →" : undefined}
      />
    ),
  });

  const spreads: SpreadSpec[] = [];

  // Pages 2–3: contents table facing About Me
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
          flipForward
        />
      ),
    },
  });

  // Hobby item pages, paired continuously
  const hobbyLeaves = hobbyMeta.map((meta, index) =>
    hobbyLeaf(meta, index, "left"),
  );
  spreads.push(
    ...pairLeaves(hobbyLeaves, (leaf, side) => {
      const index = hobbyMeta.findIndex((h) => h.id === leaf.id);
      return hobbyLeaf(hobbyMeta[index], index, side);
    }),
  );

  // Featured section opener faces the first featured project (or a blank)
  const firstFeatured = featuredMeta[0];
  spreads.push({
    label: firstFeatured
      ? `Featured Work and ${stegaClean(firstFeatured.project.title ?? "project")}`
      : "Featured Work",
    left: sectionOpener(
      "featured",
      featuredSectionPage,
      "Featured Work",
      featuredBlurb,
      `${featured.length} selected`,
      "ink",
      "left",
    ),
    right: firstFeatured
      ? featuredLeaf(firstFeatured, 0, "right")
      : blankLeaf("featured"),
  });

  if (featuredMeta.length > 1) {
    const rest = featuredMeta.slice(1).map((meta, index) =>
      featuredLeaf(meta, index + 1, "left"),
    );
    spreads.push(
      ...pairLeaves(rest, (leaf, side) => {
        const index = featuredMeta.findIndex((p) => p.id === leaf.id);
        return featuredLeaf(featuredMeta[index], index, side);
      }),
    );
  }

  // Works section opener faces the first work item (or a blank)
  const firstWork = workMeta[0];
  spreads.push({
    label: firstWork ? `All Works and ${firstWork.title}` : "All Works",
    left: sectionOpener(
      "works",
      worksSectionPage,
      "All Works",
      worksBlurb,
      `${allWorks.length} projects`,
      "paper",
      "left",
    ),
    right: firstWork ? workLeaf(firstWork, 0, "right") : blankLeaf("works"),
  });

  if (workMeta.length > 1) {
    const rest = workMeta.slice(1).map((meta, index) =>
      workLeaf(meta, index + 1, "left"),
    );
    spreads.push(
      ...pairLeaves(rest, (leaf, side) => {
        const index = workMeta.findIndex((p) => p.id === leaf.id);
        return workLeaf(workMeta[index], index, side);
      }),
    );
  }

  // Contact intro always faces the form
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
        {/* Page 1 — cover on the right; flip opens pages 2–3 */}
        <FolioSpread
          label="Cover"
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
            left={
              <FolioPage
                tone={spread.left.tone}
                label={spread.left.label}
                pageId={
                  spread.left.id.startsWith("blank-")
                    ? undefined
                    : spread.left.id
                }
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
              >
                {spread.right.node}
              </FolioPage>
            }
          />
        ))}
      </FolioBook>

      <FolioTocNav />
    </>
  );
}
