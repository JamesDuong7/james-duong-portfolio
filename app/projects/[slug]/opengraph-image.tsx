import { ImageResponse } from "next/og";
import { fetchProjectBySlug } from "@/sanity/lib/fetch";

export const runtime = "edge";
export const alt = "Project Case Study | James Duong";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug, { stega: false });

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#1f2438",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5f5f7",
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          Project Not Found
        </div>
      ),
      { ...size },
    );
  }

  const tech = (project.tech ?? []).slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(120deg, #1f2438 0%, #f0eeea 52%, #f0eeea 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "48%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px",
            color: "#f5f5f7",
            background: "#1f2438",
          }}
        >
          <div style={{ fontSize: 22, color: "#f2338c", letterSpacing: "0.08em", fontWeight: 600 }}>
            CASE STUDY
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {project.title}
            </div>
            <div style={{ fontSize: 24, color: "#a8adb8", lineHeight: 1.35 }}>
              {(project.description ?? "").slice(0, 120)}
            </div>
          </div>
          <div style={{ fontSize: 20, color: "#a8adb8" }}>jamesduong.dev</div>
        </div>
        <div
          style={{
            width: "52%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            padding: "56px",
            color: "#1f2438",
            background: "#f0eeea",
          }}
        >
          <div style={{ fontSize: 22, color: "#f2338c", letterSpacing: "0.08em", fontWeight: 600 }}>
            STACK
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {tech.map((t) => (
              <div
                key={t}
                style={{
                  border: "1px solid #d4d0c8",
                  padding: "10px 16px",
                  fontSize: 22,
                  background: "#e8e5df",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
