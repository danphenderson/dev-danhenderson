import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVStorySectionRenderer } from '../../../../src/components/cv/CVStorySlideRenderer';
import type { CVStoryItem } from '../../../../src/data/cvStoryItems';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    ul: ({ children, ...rest }: any) => <ul {...rest}>{children}</ul>,
    li: ({ children, ...rest }: any) => <li {...rest}>{children}</li>,
  },
}));

jest.mock('../../../../src/motion', () => ({
  MotionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MotionSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../../src/components/SkillsChipList', () => ({
  SkillsChipList: ({ skills }: { skills?: string[] }) => (
    <div data-testid="skills-chip-list">
      {(skills ?? []).map((s: string) => (
        <span key={s}>{s}</span>
      ))}
    </div>
  ),
}));

const aboutItem: CVStoryItem = {
  kind: 'about',
  data: {
    name: 'Test Person',
    title: 'Engineer',
    email: 'test@example.com',
    phone: '555-0100',
    location: 'Denver, CO',
    bio: 'A short bio.',
    opportunities: ['React', 'TypeScript'],
    bioLink: { text: 'Portfolio', url: 'https://example.com' },
  },
};

const experienceItem: CVStoryItem = {
  kind: 'experience',
  sortDate: new Date('2024-01-01'),
  data: {
    company: 'Acme Corp',
    companyUrl: 'https://acme.example.com',
    title: 'Senior Engineer',
    startDate: 'Jan 2023',
    endDate: 'Present',
    description: 'Built things.',
    skills: ['Go', 'Kubernetes'],
  },
};

const educationItem: CVStoryItem = {
  kind: 'education',
  sortDate: new Date('2020-05-01'),
  data: {
    university: 'State University',
    program: 'B.S. Computer Science',
    summary: 'Studied algorithms.',
    dateRange: '2016 – 2020',
    gpa: [{ label: 'Overall', value: '3.8' }],
    highlights: ['Deans list', 'Capstone award'],
    skills: ['Python', 'C++'],
  },
};

const certificateItem: CVStoryItem = {
  kind: 'certificate',
  sortDate: new Date('2023-06-01'),
  data: {
    title: 'AWS Solutions Architect',
    issuer: 'Amazon',
    date: 'Jun 2023',
    link: 'https://cert.example.com',
  },
};

const volunteeringItem: CVStoryItem = {
  kind: 'volunteering',
  sortDate: new Date('2022-01-01'),
  data: {
    organization: 'Code for Good',
    organizationUrl: 'https://codeforgood.example.com',
    role: 'Mentor',
    summary: 'Mentored students.',
    dateRange: '2022 – 2023',
    location: 'Remote',
    highlights: ['Trained 10 students'],
  },
};

const codingItem: CVStoryItem = {
  kind: 'coding',
  data: {
    title: 'Portfolio Site',
    description: 'Personal portfolio built with React.',
    links: ['https://github.com/user/portfolio'],
    tabs: [{ value: 'tech', label: 'Tech', kind: 'skills', skills: ['React', 'TS'] }],
  },
};

const endItem: CVStoryItem = {
  kind: 'end',
  data: {
    headline: "Let's Connect",
    body: 'Thanks for reading.',
    channels: [
      { label: 'me@test.dev', url: 'mailto:me@test.dev', icon: 'email' as const },
      { label: 'GitHub', url: 'https://github.com/testuser', icon: 'github' as const },
    ],
  },
};

describe('CVStorySectionRenderer', () => {
  it('renders about section with name, title, location, bio, and opportunities', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={aboutItem} index={0} />
      </ThemeProvider>
    );

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Test Person')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Denver, CO')).toBeInTheDocument();
    expect(screen.getByText('A short bio.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toHaveAttribute('href', 'https://example.com');
  });

  it('renders experience section with company link, title, date range, description, and skills', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={experienceItem} index={1} />
      </ThemeProvider>
    );

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByText('Built things.')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
  });

  it('renders education section with university, program, GPA, highlights, and skills', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={educationItem} index={2} />
      </ThemeProvider>
    );

    expect(screen.getByText('State University')).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
    expect(screen.getByText('2016 – 2020')).toBeInTheDocument();
    expect(screen.getByText('Studied algorithms.')).toBeInTheDocument();
    expect(screen.getByText('Overall: 3.8')).toBeInTheDocument();
    expect(screen.getByText('Deans list')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders certificate section with issuer, title, date, and link', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={certificateItem} index={3} />
      </ThemeProvider>
    );

    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument();
    expect(screen.getByText('Jun 2023')).toBeInTheDocument();
    expect(screen.getByText('View certificate')).toHaveAttribute(
      'href',
      'https://cert.example.com'
    );
  });

  it('renders volunteering section with organization link, role, summary, and highlights', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={volunteeringItem} index={4} />
      </ThemeProvider>
    );

    expect(screen.getByText('Code for Good')).toBeInTheDocument();
    expect(screen.getByText('Mentor')).toBeInTheDocument();
    expect(screen.getByText('Mentored students.')).toBeInTheDocument();
    expect(screen.getByText('Trained 10 students')).toBeInTheDocument();
  });

  it('renders coding section with project title, description, GitHub link, and skills tab', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={codingItem} index={5} />
      </ThemeProvider>
    );

    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Site')).toBeInTheDocument();
    expect(screen.getByText('Personal portfolio built with React.')).toBeInTheDocument();
    expect(screen.getByText('View on GitHub')).toHaveAttribute(
      'href',
      'https://github.com/user/portfolio'
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });

  it('renders end section with headline, body, and contact channels', () => {
    render(
      <ThemeProvider>
        <CVStorySectionRenderer item={endItem} index={6} />
      </ThemeProvider>
    );

    expect(screen.getByText("Let's Connect")).toBeInTheDocument();
    expect(screen.getByText('Thanks for reading.')).toBeInTheDocument();
    expect(screen.getByText('me@test.dev')).toHaveAttribute('href', 'mailto:me@test.dev');
    expect(screen.getByText('GitHub')).toHaveAttribute('href', 'https://github.com/testuser');
  });
});
