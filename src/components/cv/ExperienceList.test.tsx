import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { experiences } from '../../data/cv';
import { COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
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
    expect(advisorLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(advisorLink).toHaveAttribute('data-tooltip-content', 'View faculty page');
    expect(advisorLink.closest('p')?.querySelectorAll('br')).toHaveLength(0);
    expect(screen.getByRole('tab', { name: 'Highlights' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Researching blood-flow and transport models governed by Navier--Stokes and convection-diffusion PDEs using traditional and machine-learning approaches.'
      )
    ).toBeVisible();
  });

  it('switches between highlights and skills within the shared tab panel while keeping the summary visible', () => {
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
    expect(
      screen.getByText(
        'Researching blood-flow and transport models governed by Navier--Stokes and convection-diffusion PDEs using traditional and machine-learning approaches.'
      )
    ).toBeVisible();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('PyTorch')).toBeVisible();
    expect(
      screen.queryByText('Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Researching blood-flow and transport models governed by Navier--Stokes and convection-diffusion PDEs using traditional and machine-learning approaches.'
      )
    ).toBeVisible();
  });

  it('keeps a visible skills tab when skills are the only supplemental content', () => {
    const mathematicsTutorExperience = experiences.find(
      (experience) => experience.title === 'Mathematics Tutor | Part Time'
    );

    expect(mathematicsTutorExperience).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[mathematicsTutorExperience!]} />
      </ThemeProvider>
    );

    expect(screen.getByRole('tab', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.queryByText('Teaching')).not.toBeInTheDocument();
    expect(screen.queryByText('Mathematica')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('Teaching')).toBeVisible();
    expect(screen.getByText('Mathematica')).toBeVisible();
  });

  it('places the date range in the title row and the industry chip in the organization row', () => {
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
    expect(titleRow).not.toHaveTextContent('Michigan Technological University');

    const dateText = `${hemodynamicsExperience!.startDate} – ${hemodynamicsExperience!.endDate}`;

    expect(titleRow).toHaveTextContent(dateText);

    const orgRow = screen.getByText('Michigan Technological University').parentElement;

    expect(orgRow).not.toBeNull();
    expect(orgRow).toHaveTextContent('Higher Education');

    const industryChip = screen.getByText('Higher Education').closest('.MuiChip-root');

    expect(industryChip).not.toBeNull();
  });

  it('forwards organization links and tooltip copy for Michigan Tech and Lucerna entries', () => {
    const graduateResearchAssistant = experiences.find(
      (experience) => experience.title === 'Graduate Research Assistant'
    );
    const dataPipelineEngineer = experiences.find(
      (experience) => experience.title === 'Data Pipeline Engineer'
    );

    expect(graduateResearchAssistant).toBeDefined();
    expect(dataPipelineEngineer).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[graduateResearchAssistant!, dataPipelineEngineer!]} />
      </ThemeProvider>
    );

    const mtuLink = screen.getByRole('link', { name: 'Michigan Technological University' });
    const lucernaLink = screen.getByRole('link', { name: 'Lucerna Health' });

    expect(mtuLink).toHaveAttribute(
      'href',
      'https://www.mtu.edu/globalcampus/programs/degrees/?deliveryOption=online&tags=grad'
    );
    expect(mtuLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(mtuLink).toHaveAttribute('data-tooltip-content', 'View online graduate degrees page');

    expect(lucernaLink).toHaveAttribute('href', 'https://getlucerna.com');
    expect(lucernaLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(lucernaLink).toHaveAttribute('data-tooltip-content', 'View company site');
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

    fireEvent.click(screen.getByRole('tab', { name: 'Highlights' }));

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
