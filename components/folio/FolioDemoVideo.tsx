"use client";

import { useId, useState } from "react";
import Image from "next/image";
import {
  parseYouTubeVideoId,
  youtubeEmbedUrl,
  youtubePosterUrl,
} from "@/lib/youtube";
import styles from "./FolioDemoVideo.module.css";

type FolioDemoVideoProps = {
  url: string | null | undefined;
  title: string;
  caption: string;
};

export default function FolioDemoVideo({
  url,
  title,
  caption,
}: FolioDemoVideoProps) {
  const videoId = parseYouTubeVideoId(url);
  const [playing, setPlaying] = useState(false);
  const labelId = useId();

  if (!videoId) return null;

  const poster = youtubePosterUrl(videoId);
  const playLabel = `Play demo video: ${title}`;

  return (
    <figure className={styles.figure} aria-labelledby={labelId}>
      {playing ? (
        <iframe
          className={styles.frame}
          src={youtubeEmbedUrl(videoId)}
          title={playLabel}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className={styles.facade}
          onClick={() => setPlaying(true)}
          aria-label={playLabel}
        >
          <Image
            src={poster}
            alt=""
            width={480}
            height={360}
            className={styles.poster}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        </button>
      )}
      <figcaption id={labelId} className={styles.caption}>
        {caption}
      </figcaption>
    </figure>
  );
}
