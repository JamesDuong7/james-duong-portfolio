export function parseAnchorHref(href: string) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;

  const hash = href.slice(hashIndex);
  const id = hash.slice(1);
  if (!id) return null;

  const path = hashIndex === 0 ? '/' : href.slice(0, hashIndex) || '/';

  return { hash, id, path };
}

export function getScrollBlock(id: string): ScrollLogicalPosition {
  return id === 'contact' ? 'center' : 'start';
}

export function getScrollTarget(id: string): HTMLElement | null {
  const section = document.getElementById(id);
  if (!section) return null;

  if (id === 'contact') {
    return section.querySelector('form') ?? section;
  }

  return section;
}

export function scrollToSection(id: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const element = getScrollTarget(id);

  element?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: getScrollBlock(id),
  });
}

export function isSamePageAnchor(href: string, pathname: string) {
  const parsed = parseAnchorHref(href);
  return parsed !== null && pathname === parsed.path;
}

export function shouldForceSectionScroll(href: string, pathname: string) {
  const parsed = parseAnchorHref(href);
  if (!parsed) return false;

  return pathname === parsed.path && window.location.hash === parsed.hash;
}
