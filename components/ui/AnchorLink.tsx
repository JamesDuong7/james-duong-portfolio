'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { scrollToSection, isSamePageAnchor, parseAnchorHref } from '@/lib/anchorNavigation';

type AnchorLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export default function AnchorLink({ href, onClick, ...props }: AnchorLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const parsed = parseAnchorHref(href);

    if (parsed && isSamePageAnchor(href, pathname)) {
      event.preventDefault();
      scrollToSection(parsed.id);
      window.history.pushState(null, '', `${parsed.path}${parsed.hash}`);
    }

    onClick?.(event);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
