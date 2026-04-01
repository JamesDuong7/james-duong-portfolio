import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';
import { personalInfo } from '@/lib/data';

describe('Hero Component', () => {
  it('renders personal info correctly', () => {
    render(<Hero />);
    
    // Check if name is rendered
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(personalInfo.name);
    
    // Check headline
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(personalInfo.headline);
    
    // Check intro text
    expect(screen.getByText(personalInfo.intro)).toBeInTheDocument();
  });

  it('renders all Primary and Secondary CTA links', () => {
    render(<Hero />);
    
    const projectsLink = screen.getByRole('link', { name: /View Projects/i });
    expect(projectsLink).toHaveAttribute('href', '#projects');

    const resumeLink = screen.getByRole('link', { name: /Resume/i });
    expect(resumeLink).toHaveAttribute('href', personalInfo.resumeUrl);

    const githubLink = screen.getByRole('link', { name: /GitHub Profile/i });
    expect(githubLink).toHaveAttribute('href', personalInfo.github);

    const checkLinkedIn = screen.getByRole('link', { name: /LinkedIn Profile/i });
    expect(checkLinkedIn).toHaveAttribute('href', personalInfo.linkedin);
  });
});
