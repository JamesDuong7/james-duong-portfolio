import { stegaClean } from "@sanity/client/stega";
import FolioBook from "./FolioBook";
import FolioSpread, { FolioPage } from "./FolioSpread";
import FolioTocNav from "./FolioTocNav";
import WoodTablePage from "./WoodTablePage";
import CoverPage from "./CoverPage";
import TableOfContentsPage, { type TocSection } from "./TableOfContentsPage";
import AboutMePage from "./AboutMePage";
import SectionOpenerPage from "./SectionOpenerPage";
import FeaturedListPage from "./FeaturedListPage";
import WorkIndexPage from "./WorkIndexPage";
import ContactIntroPage from "./ContactIntroPage";
import ContactFormPage from "./ContactFormPage";
import {
  fetchFeaturedProjects,
  fetchPersonalInfo,
  fetchProjectsIndex,
} from "@/sanity/lib/fetch";
import { portableTextToPlain } from "@/lib/portableText";
import type { Hobby } from "@/sanity/lib/types";

/** Sample hobbies so the About Me page reads well before any are set in Sanity. */
const FALLBACK_HOBBIES: Hobby[] = [
  { title: "Bouldering", description: "Chasing problems at the local climbing gym." },
  { title: "Film photography", description: "Shooting 35mm around the city." },
  { title: "Cooking", description: "Recreating dishes from places I've travelled." },
  { title: "Basketball", description: "Pickup games on the weekend." },
  { title: "Reading", description: "Sci-fi and systems-design deep dives." },
  { title: "Coffee", description: "Dialing in the perfect pour-over." },
];

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

  const sections: TocSection[] = [
    {
      id: "contents",
      page: "01",
      title: "About Me",
      items: hobbies
        .map((h) => (h.title ? stegaClean(h.title) : ""))
        .filter(Boolean)
        .map((label) => ({ label })),
    },
    {
      id: "featured",
      page: "02",
      title: "Featured Work",
      items: featured
        .map((p) => {
          const slug = stegaClean(p.id ?? "");
          return {
            label: stegaClean(p.title ?? "Untitled"),
            href: slug ? `/projects/${slug}` : undefined,
          };
        })
        .filter((entry) => Boolean(entry.label)),
    },
    {
      id: "works",
      page: "03",
      title: "All Works",
      items: allWorks.map((p) => ({
        label: p.title,
        href: p.slug ? `/projects/${p.slug}` : undefined,
      })),
    },
    { id: "contact", page: "04", title: "Contact", items: [] },
  ];

  const featuredBlurb =
    "A closer look at the projects I'm proudest of — the problems they solve, the stacks behind them, and what I learned building them.";
  const worksBlurb =
    "Every project in the issue, front to back. Flip in, or jump straight to a case study.";

  return (
    <>
      <FolioBook>
        {/* Cover — magazine resting on a table, no left page */}
        <FolioSpread
          id="cover"
          label="Cover"
          left={<WoodTablePage />}
          right={
            <FolioPage tone="ink" label="Cover">
              <CoverPage name={name} headline={headline} location={location} />
            </FolioPage>
          }
        />

        {/* Contents + About Me */}
        <FolioSpread
          id="contents"
          label="Contents and About Me"
          left={
            <FolioPage tone="paper" label="Table of Contents">
              <TableOfContentsPage sections={sections} />
            </FolioPage>
          }
          right={
            <FolioPage tone="paper" label="About Me">
              <AboutMePage
                about={about}
                hobbies={hobbies}
                languages={languages}
                frameworks={frameworks}
                tools={tools}
                github={github}
                linkedin={linkedin}
                resumeUrl={resumeUrl}
              />
            </FolioPage>
          }
        />

        {/* Featured Work */}
        <FolioSpread
          id="featured"
          label="Featured Work"
          left={
            <FolioPage tone="ink" label="Featured Work section">
              <SectionOpenerPage
                number="02"
                kicker="SECTION"
                title="Featured Work"
                blurb={featuredBlurb}
                meta={`${featured.length} selected`}
                tone="ink"
                backLabel="← Back to About Me"
              />
            </FolioPage>
          }
          right={
            <FolioPage tone="paper" label="Featured projects">
              <FeaturedListPage projects={featured} />
            </FolioPage>
          }
        />

        {/* All Works */}
        <FolioSpread
          id="works"
          label="All Works"
          left={
            <FolioPage tone="paper" label="All Works section">
              <SectionOpenerPage
                number="03"
                kicker="SECTION"
                title="All Works"
                blurb={worksBlurb}
                meta={`${allWorks.length} projects`}
                backLabel="← Back to Featured Work"
              />
            </FolioPage>
          }
          right={
            <FolioPage tone="paper" label="Project index">
              <WorkIndexPage projects={allWorks} />
            </FolioPage>
          }
        />

        {/* Contact — moved to the very end */}
        <FolioSpread
          id="contact"
          label="Contact"
          left={
            <FolioPage tone="ink" label="Contact intro">
              <ContactIntroPage
                email={email}
                location={location}
                github={github}
                linkedin={linkedin}
                resumeUrl={resumeUrl}
              />
            </FolioPage>
          }
          right={
            <FolioPage tone="paper" label="Contact form">
              <ContactFormPage email={email} />
            </FolioPage>
          }
        />
      </FolioBook>

      <FolioTocNav />
    </>
  );
}
