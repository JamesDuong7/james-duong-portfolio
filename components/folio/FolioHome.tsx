import FolioBook from "./FolioBook";
import FolioSpread, { FolioPage } from "./FolioSpread";
import IdentityPage from "./IdentityPage";
import AboutContactPage from "./AboutContactPage";
import FeaturedWorkPage from "./FeaturedWorkPage";
import WorkIndexPage from "./WorkIndexPage";
import { fetchFeaturedProjects, fetchPersonalInfo } from "@/sanity/lib/fetch";
import { portableTextToPlain } from "@/lib/portableText";

export default async function FolioHome() {
  const [info, projects] = await Promise.all([
    fetchPersonalInfo(),
    fetchFeaturedProjects(),
  ]);

  const name = info?.name ?? "James Duong";
  const headline =
    info?.headline ?? "Computer Science Student & Software Engineer";
  const intro = portableTextToPlain(info?.intro);
  const about = portableTextToPlain(info?.aboutMe, " ");
  const location = info?.location;
  const email = info?.email;
  const github = info?.github;
  const linkedin = info?.linkedin;
  const resumeUrl = info?.resumeUrl;
  const languages = info?.skills?.languages ?? [];
  const frameworks = info?.skills?.frameworks ?? [];
  const tools = info?.skills?.tools ?? [];

  const featured = projects?.[0];
  const indexItems =
    projects?.map((p) => ({
      slug: p.id ?? "",
      title: p.title ?? "Untitled",
      description: p.description ?? "",
    })) ?? [];

  return (
    <FolioBook>
      <FolioSpread
        id="profile"
        label="Identity and About"
        left={
          <FolioPage tone="ink" label="Identity">
            <IdentityPage
              name={name}
              headline={headline}
              intro={intro}
              location={location}
              resumeUrl={resumeUrl}
            />
          </FolioPage>
        }
        right={
          <FolioPage tone="paper" label="About and Contact">
            <AboutContactPage
              about={about}
              email={email}
              github={github}
              linkedin={linkedin}
              resumeUrl={resumeUrl}
              languages={languages}
              frameworks={frameworks}
              tools={tools}
            />
          </FolioPage>
        }
      />

      <FolioSpread
        id="work"
        label="Featured Work and Index"
        left={
          <FolioPage tone="paper" label="Featured Work">
            {featured ? (
              <FeaturedWorkPage
                title={featured.title ?? "Featured Project"}
                description={featured.description ?? ""}
                tech={featured.tech ?? []}
                slug={featured.id ?? ""}
                index={1}
                total={Math.max(indexItems.length, 1)}
              />
            ) : (
              <FeaturedWorkPage
                title="Projects coming soon"
                description="Featured work will appear here once published in Sanity."
                tech={[]}
                slug=""
                index={1}
                total={1}
              />
            )}
          </FolioPage>
        }
        right={
          <FolioPage tone="paper" label="Work Index">
            <WorkIndexPage projects={indexItems} />
          </FolioPage>
        }
      />
    </FolioBook>
  );
}
