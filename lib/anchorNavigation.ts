export function parseAnchorHref(href: string) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;

  const hash = href.slice(hashIndex);
  const id = hash.slice(1);
  if (!id) return null;

  const path = hashIndex === 0 ? '/' : href.slice(0, hashIndex) || '/';

  return { hash, id, path };
}

export function scrollToSection(id: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

export function shouldForceSectionScroll(href: string, pathname: string) {
  const parsed = parseAnchorHref(href);
  if (!parsed) return false;

  return pathname === parsed.path && window.location.hash === parsed.hash;
}
