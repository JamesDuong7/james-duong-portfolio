import { describe, it, expect } from 'vitest';
import { getScrollBlock, parseAnchorHref, shouldForceSectionScroll } from './anchorNavigation';

describe('parseAnchorHref', () => {
  it('parses hash-only links', () => {
    expect(parseAnchorHref('#projects')).toEqual({
      hash: '#projects',
      id: 'projects',
      path: '/',
    });
  });

  it('parses path and hash links', () => {
    expect(parseAnchorHref('/#contact')).toEqual({
      hash: '#contact',
      id: 'contact',
      path: '/',
    });
  });

  it('returns null for non-anchor links', () => {
    expect(parseAnchorHref('/projects/foo')).toBeNull();
  });
});

describe('getScrollBlock', () => {
  it('centers the contact form in the viewport', () => {
    expect(getScrollBlock('contact')).toBe('center');
  });

  it('aligns other sections to the start', () => {
    expect(getScrollBlock('projects')).toBe('start');
    expect(getScrollBlock('about')).toBe('start');
  });
});

describe('shouldForceSectionScroll', () => {
  it('returns true when pathname and hash already match the target', () => {
    window.location.hash = '#projects';
    expect(shouldForceSectionScroll('#projects', '/')).toBe(true);
    expect(shouldForceSectionScroll('/#projects', '/')).toBe(true);
  });

  it('returns false when hash differs', () => {
    window.location.hash = '#about';
    expect(shouldForceSectionScroll('#projects', '/')).toBe(false);
  });
});
