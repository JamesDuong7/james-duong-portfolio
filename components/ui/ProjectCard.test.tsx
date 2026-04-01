import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCard from './ProjectCard';

describe('ProjectCard Component', () => {
  const mockProps = {
    id: 'test-project',
    title: 'Test Project Title',
    description: 'This is a test description.',
    tech: ['React', 'Next.js'],
    github: 'https://github.com/test',
    live: 'https://test.com'
  };

  it('renders project information correctly', () => {
    render(<ProjectCard {...mockProps} />);
    
    // Check title
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(mockProps.title);
    
    // Check description
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    
    // Check tags
    mockProps.tech.forEach(t => {
      expect(screen.getByText(t)).toBeInTheDocument();
    });
  });

  it('renders links correctly', () => {
    render(<ProjectCard {...mockProps} />);
    
    const githubLink = screen.getByRole('link', { name: /GitHub Repository/i });
    expect(githubLink).toHaveAttribute('href', mockProps.github);
    
    const liveLink = screen.getByRole('link', { name: /Live Demo/i });
    expect(liveLink).toHaveAttribute('href', mockProps.live);
    
    const caseStudy = screen.getByRole('link', { name: /Read Case Study/i });
    expect(caseStudy).toHaveAttribute('href', `/projects/${mockProps.id}`);
  });

  it('does not render live link if not provided', () => {
    const propsWithoutLive = { ...mockProps, live: undefined };
    render(<ProjectCard {...propsWithoutLive} />);
    
    expect(screen.queryByRole('link', { name: /Live Demo/i })).not.toBeInTheDocument();
  });
});
