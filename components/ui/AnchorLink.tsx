'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { scrollToSection, shouldForceSectionScroll } from '@/lib/anchorNavigation';

type AnchorLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export default function AnchorLink({ href, onClick, ...props }: AnchorLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldForceSectionScroll(href, pathname)) {
      event.preventDefault();
      scrollToSection(href.slice(href.indexOf('#') + 1));
    }

    onClick?.(event);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
