import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "James Duong - Software Engineer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1f2438 0%, #2a1830 55%, #f2338c 140%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          color: "#f5f5f7",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: "0.08em",
            color: "#f2338c",
            fontWeight: 600,
          }}
        >
          <span>JD. / VOL. 01</span>
          <span style={{ color: "#a8adb8" }}>FOLIO</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            James Duong
          </div>
          <div style={{ fontSize: 32, color: "#a8adb8", fontWeight: 500 }}>
            Computer Science Student & Software Engineer
          </div>
          <div
            style={{
              marginTop: 12,
              width: 48,
              height: 4,
              background: "#f2338c",
            }}
          />
        </div>
        <div style={{ fontSize: 24, color: "#a8adb8" }}>jamesduong.dev</div>
      </div>
    ),
    { ...size },
  );
}
