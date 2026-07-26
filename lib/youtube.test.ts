import { describe, it, expect } from "vitest";
import {
  parseYouTubeVideoId,
  youtubeEmbedUrl,
  youtubePosterFallbackUrl,
  youtubePosterUrl,
} from "./youtube";

describe("parseYouTubeVideoId", () => {
  it("parses watch URLs", () => {
    expect(
      parseYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
  });

  it("parses youtu.be short links", () => {
    expect(parseYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
  });

  it("parses embed and shorts URLs", () => {
    expect(
      parseYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
    expect(
      parseYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
  });

  it("ignores extra query params", () => {
    expect(
      parseYouTubeVideoId(
        "https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share&t=12",
      ),
    ).toBe("dQw4w9WgXcQ");
  });

  it("returns null for empty, invalid, or non-YouTube URLs", () => {
    expect(parseYouTubeVideoId(null)).toBeNull();
    expect(parseYouTubeVideoId("")).toBeNull();
    expect(parseYouTubeVideoId("not a url")).toBeNull();
    expect(parseYouTubeVideoId("https://vimeo.com/123456")).toBeNull();
    expect(
      parseYouTubeVideoId("https://www.youtube.com/watch?v=short"),
    ).toBeNull();
  });
});

describe("youtube URL helpers", () => {
  it("builds a privacy-enhanced autoplay embed", () => {
    expect(youtubeEmbedUrl("dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1",
    );
  });

  it("builds a maxres poster URL with hq fallback", () => {
    expect(youtubePosterUrl("dQw4w9WgXcQ")).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    );
    expect(youtubePosterFallbackUrl("dQw4w9WgXcQ")).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    );
  });
});
