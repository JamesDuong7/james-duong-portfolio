"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * A floating button to exit Draft Mode.
 * Hidden when the user is already inside the Presentation Tool iframe
 * (Studio controls draft mode in that context).
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        background: "#000",
        color: "#fff",
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        fontSize: "0.875rem",
        fontFamily: "inherit",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      Exit Preview Mode
    </a>
  );
}
