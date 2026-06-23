'use client';

import { useEffect, useState } from 'react';
import styles from './Contact.module.css';

const STATUS_VISIBLE_MS = 3500;
const STATUS_FADE_MS = 1500;

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('error');
      setMessage('Contact form is temporarily unavailable.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const messageText = String(formData.get('message') ?? '').trim();

    if (!name || !email || !messageText) {
      setStatus('error');
      setMessage('All fields are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Invalid email format');
      return;
    }

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
          botcheck: false,
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Failed to send message. Please try again later.');
      }

      setStatus('success');
      setMessage('Message sent successfully! I will get back to you soon.');
      (e.target as HTMLFormElement).reset();
    } catch (error: unknown) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
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
            style={{ display: 'none' }}
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
            <textarea id="message" name="message" className={styles.textarea} required placeholder="Write your message here..."></textarea>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={status === 'loading'}
            aria-disabled={status === 'loading'}
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
