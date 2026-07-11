"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type HCaptcha from "@hcaptcha/react-hcaptcha";
import { FolioPrimaryButton } from "./FolioControls";
import styles from "./AboutContactPage.module.css";

const HCaptchaWidget = dynamic(() => import("@/components/home/ContactCaptcha"), {
  ssr: false,
});

const STATUS_VISIBLE_MS = 3500;
const STATUS_FADE_MS = 1500;
const MIN_MESSAGE_LENGTH = 30;
const MIN_SUBMIT_MS = 3000;
const WEB3FORMS_HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

export default function FolioContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const formReadyAt = useRef(Date.now());
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    const section = document.getElementById("contact");
    if (!section) {
      setShowCaptcha(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShowCaptcha(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0 },
    );

    observer.observe(section);
    const fallback = window.setTimeout(() => setShowCaptcha(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (status !== "success" && status !== "error") {
      setIsFadingOut(false);
      return;
    }

    setIsFadingOut(false);
    const fadeStartTimer = window.setTimeout(() => setIsFadingOut(true), STATUS_VISIBLE_MS);
    const clearTimer = window.setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
      setIsFadingOut(false);
    }, STATUS_VISIBLE_MS + STATUS_FADE_MS);

    return () => {
      window.clearTimeout(fadeStartTimer);
      window.clearTimeout(clearTimer);
    };
  }, [status, statusMessage]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    captchaRef.current?.resetCaptcha();
  };

  const showError = (errorMessage: string) => {
    setStatus("error");
    setStatusMessage(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      showError("Contact form is temporarily unavailable.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const messageText = String(formData.get("message") ?? "").trim();

    if (formData.get("botcheck")) {
      showError("Unable to send message. Please try again.");
      return;
    }

    if (!name || !email || !messageText) {
      showError("All fields are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError("Invalid email format.");
      return;
    }

    if (messageText.length < MIN_MESSAGE_LENGTH) {
      showError(`Please write at least ${MIN_MESSAGE_LENGTH} characters in your message.`);
      return;
    }

    if (Date.now() - formReadyAt.current < MIN_SUBMIT_MS) {
      showError("Please take a moment to review your message before sending.");
      return;
    }

    if (!captchaToken) {
      showError("Please complete the verification check below.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message: messageText,
          subject: `New Portfolio Message from ${name}`,
          "h-captcha-response": captchaToken,
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to send message. Please try again later.");
      }

      setStatus("success");
      setStatusMessage("Message sent successfully! I will get back to you soon.");
      (e.target as HTMLFormElement).reset();
      setMessageBody("");
      resetCaptcha();
      formReadyAt.current = Date.now();
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      resetCaptcha();
    }
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

      <div className={styles.row}>
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
          {showCaptcha ? (
            <HCaptchaWidget
              ref={captchaRef}
              sitekey={WEB3FORMS_HCAPTCHA_SITE_KEY}
              theme="light"
              size="normal"
              reCaptchaCompat={false}
              onVerify={setCaptchaToken}
              onExpire={() => setCaptchaToken("")}
              onError={() =>
                showError("Verification failed to load. Please refresh and try again.")
              }
            />
          ) : (
            <span className={styles.hint}>Loading verification...</span>
          )}
        </div>
      </div>

      <FolioPrimaryButton
        type="submit"
        disabled={status === "loading" || !captchaToken}
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </FolioPrimaryButton>

      {(status === "success" || status === "error") && (
        <div
          className={`${styles.status} ${status === "success" ? styles.success : styles.error} ${isFadingOut ? styles.fadeOut : ""}`}
          role="alert"
        >
          {statusMessage}
        </div>
      )}
    </form>
  );
}
