import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navigation from './Navigation';
import { personalInfo } from '@/lib/data';

describe('Navigation Component', () => {
  it('renders home link', () => {
    render(<Navigation />);
    const homeLink = screen.getByRole('link', { name: /Home page/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders section links', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects');
  });

  it('renders resume link', () => {
    render(<Navigation />);
    const resumeLink = screen.getByRole('link', { name: /View Resume/i });
    expect(resumeLink).toHaveAttribute('href', personalInfo.resumeUrl);
    expect(resumeLink).toHaveAttribute('target', '_blank');
  });
});
