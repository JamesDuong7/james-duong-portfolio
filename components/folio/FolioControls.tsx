import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./FolioControls.module.css";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  onInk?: boolean;
  arrow?: "↗" | "→";
  ariaLabel?: string;
};

export function FolioLinkButton({
  href,
  children,
  external = true,
  onInk = false,
  arrow = "↗",
  ariaLabel,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={`${styles.ghost} ${onInk ? styles.onInk : ""}`}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden>
        {arrow}
      </span>
    </a>
  );
}

type PrimaryButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  external?: boolean;
};

export function FolioPrimaryButton({
  children,
  href,
  type = "button",
  disabled,
  ariaLabel,
  external = false,
}: PrimaryButtonProps) {
  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a
          href={href}
          className={styles.primary}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={styles.primary} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={styles.primary}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export function FolioTechTag({
  label,
  onInk = false,
}: {
  label: string;
  onInk?: boolean;
}) {
  return (
    <span className={`${styles.tag} ${onInk ? styles.tagOnInk : ""}`}>
      <span className={styles.dot} aria-hidden />
      {label}
    </span>
  );
}
