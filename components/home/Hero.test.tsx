import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Hero from './Hero';
import { fetchPersonalInfo } from '@/sanity/lib/fetch';

vi.mock('@/sanity/lib/fetch', () => ({
  fetchPersonalInfo: vi.fn(),
}));

const mockPersonalInfo = {
  name: 'James Duong',
  headline: 'Computer Science Student & Software Engineer',
  intro: [
    {
      _type: 'block',
      _key: 'intro',
      children: [{ _type: 'span', text: 'Test intro paragraph.' }],
    },
  ],
  aboutMe: null,
  email: null,
  location: null,
  github: 'https://github.com/jamesduong',
  linkedin: 'https://linkedin.com/in/jamesduong',
  resumeUrl: '/James_Duong_CS_Resume_2026.pdf',
  skills: null,
};

describe('Hero Component', () => {
  beforeEach(() => {
    vi.mocked(fetchPersonalInfo).mockResolvedValue(mockPersonalInfo);
  });

  it('renders personal info correctly', async () => {
    render(await Hero());

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockPersonalInfo.name);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(mockPersonalInfo.headline);
    expect(screen.getByText('Test intro paragraph.')).toBeInTheDocument();
  });

  it('renders all Primary and Secondary CTA links', async () => {
    render(await Hero());

    expect(screen.getByRole('link', { name: /View Projects/i })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /Resume/i })).toHaveAttribute('href', mockPersonalInfo.resumeUrl);
    expect(screen.getByRole('link', { name: /GitHub Profile/i })).toHaveAttribute('href', mockPersonalInfo.github);
    expect(screen.getByRole('link', { name: /LinkedIn Profile/i })).toHaveAttribute('href', mockPersonalInfo.linkedin);
  });
});
