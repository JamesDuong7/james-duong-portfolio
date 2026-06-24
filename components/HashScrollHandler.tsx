'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToSection } from '@/lib/anchorNavigation';

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    requestAnimationFrame(() => {
      scrollToSection(id);
    });
  }, [pathname]);

  return null;
}
