"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import styles from "./DisableDraftMode.module.css";

/**
 * A floating button to exit Draft Mode.
 * Hidden when the user is already inside the Presentation Tool iframe
 * (Studio controls draft mode in that context).
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) return null;

  return (
    <a href="/api/draft-mode/disable" className={styles.button}>
      Exit Preview Mode
    </a>
  );
}
