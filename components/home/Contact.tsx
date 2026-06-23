'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type HCaptcha from '@hcaptcha/react-hcaptcha';
import styles from './Contact.module.css';

const HCaptchaWidget = dynamic(() => import('./ContactCaptcha'), { ssr: false });

const STATUS_VISIBLE_MS = 3500;
const STATUS_FADE_MS = 1500;
const MIN_MESSAGE_LENGTH = 30;
const MIN_SUBMIT_MS = 3000;
const WEB3FORMS_HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const formReadyAt = useRef(Date.now());
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (status !== 'success' && status !== 'error') {
      setIsFadingOut(false);
      return;
    }

    setIsFadingOut(false);

    const fadeStartTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, STATUS_VISIBLE_MS);

    const clearTimer = window.setTimeout(() => {
      setStatus('idle');
      setMessage('');
      setIsFadingOut(false);
    }, STATUS_VISIBLE_MS + STATUS_FADE_MS);

    return () => {
      window.clearTimeout(fadeStartTimer);
      window.clearTimeout(clearTimer);
    };
  }, [status, message]);

  const resetCaptcha = () => {
    setCaptchaToken('');
    captchaRef.current?.resetCaptcha();
  };

  const showError = (errorMessage: string) => {
    setStatus('error');
    setMessage(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      showError('Contact form is temporarily unavailable.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const messageText = String(formData.get('message') ?? '').trim();

    if (formData.get('botcheck')) {
      showError('Unable to send message. Please try again.');
      return;
    }

    if (!name || !email || !messageText) {
      showError('All fields are required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError('Invalid email format.');
      return;
    }

    if (messageText.length < MIN_MESSAGE_LENGTH) {
      showError(`Please write at least ${MIN_MESSAGE_LENGTH} characters in your message.`);
      return;
    }

    if (Date.now() - formReadyAt.current < MIN_SUBMIT_MS) {
      showError('Please take a moment to review your message before sending.');
      return;
    }

    if (!captchaToken) {
      showError('Please complete the verification check below.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message: messageText,
          subject: `New Portfolio Message from ${name}`,
          'h-captcha-response': captchaToken,
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Failed to send message. Please try again later.');
      }

      setStatus('success');
      setMessage('Message sent successfully! I will get back to you soon.');
      (e.target as HTMLFormElement).reset();
      resetCaptcha();
      formReadyAt.current = Date.now();
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      resetCaptcha();
    }
  };

  return (
    <section className={styles.contact} id="contact" aria-label="Contact Section">
      <div className={styles.container}>
        <h2 className={styles.title}>Get in Touch</h2>
        <p className={styles.description}>
          Currently looking for new opportunities. Whether you have a question or just want to say hi,
          feel free to reach out!
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className={styles.honeypot}
            aria-hidden="true"
          />

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input type="text" id="name" name="name" className={styles.input} required placeholder="Your Name" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" className={styles.input} required placeholder="you@example.com" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              required
              minLength={MIN_MESSAGE_LENGTH}
              placeholder="Tell me about your project, role, or question..."
            />
            <span className={styles.fieldHint}>Minimum {MIN_MESSAGE_LENGTH} characters</span>
          </div>

          <div className={styles.formGroup}>
            <span className={styles.label} id="captcha-label">Verification</span>
            <div className={styles.captchaWrapper} aria-labelledby="captcha-label">
              <HCaptchaWidget
                ref={captchaRef}
                sitekey={WEB3FORMS_HCAPTCHA_SITE_KEY}
                theme="dark"
                size="normal"
                reCaptchaCompat={false}
                onVerify={setCaptchaToken}
                onExpire={() => setCaptchaToken('')}
                onError={() => showError('Verification failed to load. Please refresh and try again.')}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'loading' || !captchaToken}
            aria-disabled={status === 'loading' || !captchaToken}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {(status === 'success' || status === 'error') && (
            <div
              className={`${styles.statusMessage} ${status === 'success' ? styles.success : styles.error} ${isFadingOut ? styles.fadeOut : ''}`}
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
