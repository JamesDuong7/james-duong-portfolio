import { ImageResponse } from "next/og";
import { fetchProjectBySlug } from "@/sanity/lib/fetch";

export const runtime = "edge";
export const alt = "Project Case Study | James Duong";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug, { stega: false });

  if (!project) {
    return new ImageResponse(
      (
        <div style={{ background: "#000", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "white", fontSize: 64 }}>Project Not Found</div>
        </div>
      ),
      { ...size },
    );
  }

  const tech = project.tech ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom, #111111, #000000)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            letterSpacing: "-2px",
            marginBottom: 30,
            textAlign: "center",
            background: "linear-gradient(90deg, #ffffff, #aaaaaa)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#888888",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: 60,
          }}
        >
          {project.description}
        </div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {tech.map((t) => (
            <div
              key={t}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "50px",
                fontSize: 24,
                color: "#cccccc",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
