import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { experiences } from '../../data/cv';
import { ExperienceList } from './ExperienceList';

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: ({
    items,
    renderItem,
  }: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
  }) => <div>{items.map((item, index) => <div key={index}>{renderItem(item, index)}</div>)}</div>,
}));

describe('ExperienceList', () => {
  it('renders an inline advisor link in the hemodynamics description', () => {
    const hemodynamicsExperience = experiences.find(
      (experience) => experience.title === 'Graduate Research Assistant'
    );

    expect(hemodynamicsExperience).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[hemodynamicsExperience!]} />
      </ThemeProvider>
    );

    const advisorLink = screen.getByRole('link', { name: 'Jiguang Sun' });

    expect(advisorLink).toHaveAttribute(
      'href',
      'https://pages.mtu.edu/~jiguangs/Homepage_of_Jiguang_Sun/Welcome.html'
    );
    expect(advisorLink.closest('p')?.querySelectorAll('br')).toHaveLength(0);
    expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeInTheDocument();
  });

  it('switches between details and skills within the shared tab panel', () => {
    const hemodynamicsExperience = experiences.find(
      (experience) => experience.title === 'Graduate Research Assistant'
    );

    expect(hemodynamicsExperience).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[hemodynamicsExperience!]} />
      </ThemeProvider>
    );

    expect(
      screen.queryByText('Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('PyTorch')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('PyTorch')).toBeVisible();
    expect(
      screen.queryByText('Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).')
    ).not.toBeInTheDocument();
  });

  it('keeps the industry chip in the title row', () => {
    const hemodynamicsExperience = experiences.find(
      (experience) => experience.title === 'Graduate Research Assistant'
    );

    expect(hemodynamicsExperience).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[hemodynamicsExperience!]} />
      </ThemeProvider>
    );

    const titleRow = screen
      .getByRole('heading', { name: 'Graduate Research Assistant' })
      .parentElement;

    expect(titleRow).not.toBeNull();
    expect(titleRow).toHaveTextContent('Higher Education');
    expect(titleRow).not.toHaveTextContent('Michigan Technological University');
    expect(screen.getByText('Michigan Technological University')).toBeInTheDocument();

    const industryChip = screen.getByText('Higher Education').closest('.MuiChip-root');

    expect(industryChip).not.toBeNull();
    expect(getComputedStyle(industryChip!).color).toBe('rgb(27, 168, 224)');
  });

  it('renders inline project links for the research assistant entry without separate reference bullets', () => {
    const researchAssistant = experiences.find(
      (experience) => experience.title === 'Research Assistant | Full Time'
    );

    expect(researchAssistant).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[researchAssistant!]} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    const detailList = screen.getByRole('list');

    expect(within(detailList).getAllByRole('listitem')).toHaveLength(3);
    expect(
      screen.getByRole('link', { name: 'Quasi-Newton Optimization with Hessian Samples' })
    ).toHaveAttribute('href', 'https://lnkd.in/gfP39wZX');
    expect(screen.getByRole('link', { name: 'BlockOpt.jl' })).toHaveAttribute(
      'href',
      'https://github.com/danphenderson/BlockOpt.jl'
    );
    expect(screen.getByRole('link', { name: 'UncNLPrograms.jl' })).toHaveAttribute(
      'href',
      'https://github.com/danphenderson/UncNLPrograms.jl'
    );
    expect(screen.queryByText('Article')).not.toBeInTheDocument();
    expect(screen.queryByText('Zenodo DOI')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
    expect(screen.queryByText('Repository (BlockOpt.jl)')).not.toBeInTheDocument();
    expect(screen.queryByText('Repository (UncNLPrograms.jl)')).not.toBeInTheDocument();
  });
});
