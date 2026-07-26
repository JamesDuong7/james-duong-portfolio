/** Extract an 11-char YouTube video ID from common URL shapes (watch, youtu.be, embed, shorts). */
export function parseYouTubeVideoId(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "youtu.be") {
    return null;
  }

  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (url.pathname === "/watch") {
    id = url.searchParams.get("v");
  } else {
    const match = url.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
    id = match?.[2] ?? null;
  }

  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

/** Privacy-enhanced embed URL; starts paused until the visitor interacts. */
export function youtubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

/** Static poster from YouTube's image CDN (hq is reliably available for all videos). */
export function youtubePosterUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
