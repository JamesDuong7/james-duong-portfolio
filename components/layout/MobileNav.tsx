'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import AnchorLink from '@/components/ui/AnchorLink';
import styles from './Navigation.module.css';

interface MobileNavProps {
  resumeUrl?: string | null;
}

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
] as const;

export default function MobileNav({ resumeUrl }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div className={styles.mobileNav}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.menuToggle}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </span>
      </button>

      {isOpen && (
        <button
          type="button"
          className={styles.menuBackdrop}
          aria-label="Close menu"
          onClick={closeMenu}
          tabIndex={-1}
        />
      )}

      <div
        ref={menuRef}
        id={menuId}
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Mobile Navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <AnchorLink
              key={href}
              href={href}
              className={styles.mobileLink}
              onClick={closeMenu}
              tabIndex={isOpen ? 0 : -1}
            >
              {label}
            </AnchorLink>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileResumeBtn}
              aria-label="View Resume (opens in new tab)"
              onClick={closeMenu}
              tabIndex={isOpen ? 0 : -1}
            >
              Resume
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
