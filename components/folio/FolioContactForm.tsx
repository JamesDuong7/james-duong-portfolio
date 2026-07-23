"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type HCaptcha from "@hcaptcha/react-hcaptcha";
import { FolioPrimaryButton } from "./FolioControls";
import styles from "./ContactPage.module.css";
import {
  MIN_MESSAGE_LENGTH,
  WEB3FORMS_HCAPTCHA_SITE_KEY,
  submitContactForm,
} from "@/lib/contactForm";

const HCaptchaWidget = dynamic(() => import("./ContactCaptcha"), { ssr: false });

const STATUS_VISIBLE_MS = 5000;

export default function FolioContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const formReadyAt = useRef(0);
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    formReadyAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status !== "success" && status !== "error") return;

    const clearTimer = window.setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
    }, STATUS_VISIBLE_MS);

    return () => window.clearTimeout(clearTimer);
  }, [status, statusMessage]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    captchaRef.current?.resetCaptcha();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      captchaToken,
      botcheck: formData.get("botcheck"),
      formReadyAt: formReadyAt.current,
    });

    if (!result.ok) {
      setStatus("error");
      setStatusMessage(result.message);
      resetCaptcha();
      return;
    }

    setStatus("success");
    setStatusMessage(result.message);
    (e.target as HTMLFormElement).reset();
    setMessageBody("");
    resetCaptcha();
    formReadyAt.current = Date.now();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className={styles.honeypot}
        aria-hidden="true"
      />

      <div className={styles.field}>
        <label htmlFor="folio-name" className={styles.label}>
          Name
        </label>
        <input
          type="text"
          id="folio-name"
          name="name"
          className={styles.input}
          required
          placeholder="Your Name"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="folio-email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="folio-email"
          name="email"
          className={styles.input}
          required
          placeholder="you@example.com"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="folio-message" className={styles.label}>
          Message
        </label>
        <textarea
          id="folio-message"
          name="message"
          className={styles.textarea}
          required
          minLength={MIN_MESSAGE_LENGTH}
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Tell me about your project, role, or question..."
        />
        <span
          className={`${styles.hint} ${messageBody.length >= MIN_MESSAGE_LENGTH ? styles.hintMet : ""}`}
          aria-live="polite"
        >
          {messageBody.length}/{MIN_MESSAGE_LENGTH} characters minimum
        </span>
      </div>

      <div className={styles.field}>
        <span className={styles.label} id="folio-captcha-label">
          Verification
        </span>
        <div className={styles.captcha} aria-labelledby="folio-captcha-label">
          <HCaptchaWidget
            ref={captchaRef}
            sitekey={WEB3FORMS_HCAPTCHA_SITE_KEY}
            theme="light"
            size="normal"
            reCaptchaCompat={false}
            onVerify={setCaptchaToken}
            onExpire={() => setCaptchaToken("")}
            onError={() => {
              setStatus("error");
              setStatusMessage("Verification failed to load. Please refresh and try again.");
            }}
          />
        </div>
      </div>

      <FolioPrimaryButton type="submit" disabled={status === "loading" || !captchaToken}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </FolioPrimaryButton>

      {(status === "success" || status === "error") && (
        <div
          className={`${styles.status} ${status === "success" ? styles.success : styles.error}`}
          role="alert"
        >
          {statusMessage}
        </div>
      )}
    </form>
  );
}
