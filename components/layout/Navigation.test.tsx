import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navigation from './Navigation';
import { fetchPersonalInfo } from '@/sanity/lib/fetch';

vi.mock('@/sanity/lib/fetch', () => ({
  fetchPersonalInfo: vi.fn(),
}));

const mockPersonalInfo = {
  name: 'James Duong',
  headline: 'Computer Science Student & Software Engineer',
  intro: null,
  aboutMe: null,
  email: null,
  location: null,
  github: null,
  linkedin: null,
  resumeUrl: '/James_Duong_CS_Resume_2026.pdf',
  skills: null,
};

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.mocked(fetchPersonalInfo).mockResolvedValue(mockPersonalInfo);
  });

  it('renders home link', async () => {
    render(await Navigation());
    const homeLink = screen.getByRole('link', { name: /Home page/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders section links', async () => {
    render(await Navigation());
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects');
  });

  it('renders resume link', async () => {
    render(await Navigation());
    const resumeLink = screen.getByRole('link', { name: /View Resume/i });
    expect(resumeLink).toHaveAttribute('href', mockPersonalInfo.resumeUrl);
    expect(resumeLink).toHaveAttribute('target', '_blank');
  });
});
