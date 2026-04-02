import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { experiences } from '../../../../src/data/cv';
import { COMMON_LINK_TOOLTIP_ID } from '../../../../src/components/CommonLink';
import { ExperienceList } from '../../../../src/components/cv/ExperienceList';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Collapse: ({ children, in: inProp, onEntered, ...rest }: any) => {
      const React = require('react');
      const onEnteredRef = React.useRef(onEntered);

      onEnteredRef.current = onEntered;

      React.useEffect(() => {
        if (inProp && onEnteredRef.current) {
          Promise.resolve().then(() => onEnteredRef.current?.());
        }
      }, [inProp]);

      return <div {...rest}>{children}</div>;
    },
  };
});

const mockAnimatedSlideList = jest.fn();
const mockAnimatedContentList = jest.fn();

const getExperienceSummaryText = (
  description: NonNullable<(typeof experiences)[number]['description']>
) => (Array.isArray(description) ? description[0]?.text ?? '' : description);

jest.mock('../../../../src/components/AnimatedContentList', () => ({
  AnimatedContentList: ({
    items,
    renderItem,
    ...props
  }: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    tiltItems?: boolean;
    itemSurface?: string;
  }) =>
    (() => {
      mockAnimatedContentList({ items, renderItem, ...props });

      return (
        <div>
          {items.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))}
        </div>
      );
    })(),
}));

jest.mock('../../../../src/components/AnimatedSlideList', () => ({
  getAnimatedSlideListCloseDelayMs: (
    itemCount: number,
    itemStaggerMs: number,
    startDelayMs: number = 0,
    exitDurationMs: number = 220
  ) =>
    itemCount <= 0 ? 0 : startDelayMs + Math.max(itemCount - 1, 0) * itemStaggerMs + exitDurationMs,
  AnimatedSlideList: (props: {
    items: unknown[];
    getItemKey: (item: unknown, index: number) => string;
    renderItem: (item: unknown, index: number) => ReactNode;
    in: boolean;
    layout?: 'stack' | 'wrap';
    containerComponent?: React.ElementType;
    itemComponent?: React.ElementType;
  }) => {
    mockAnimatedSlideList(props);

    const React = require('react');

    const ContainerComponent = props.containerComponent ?? 'div';
    const ItemComponent = props.itemComponent ?? 'div';

    return React.createElement(
      ContainerComponent,
      { 'data-testid': 'animated-slide-list', 'data-layout': props.layout ?? 'stack' },
      props.in
        ? props.items.map((item, index) =>
            React.createElement(
              ItemComponent,
              { key: props.getItemKey(item, index) },
              props.renderItem(item, index)
            )
          )
        : null
    );
  },
}));

describe('ExperienceList', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
    mockAnimatedSlideList.mockClear();
  });

  it('renders an inline advisor link in the hemodynamics description', () => {
    const hemodynamicsExperience = experiences.find(
      (experience) => experience.title === 'Graduate Research Assistant'
    );

    expect(hemodynamicsExperience).toBeDefined();

    const summaryText = getExperienceSummaryText(hemodynamicsExperience!.description!);

    expect(summaryText).toBeTruthy();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[hemodynamicsExperience!]} />
      </ThemeProvider>
    );

    expect(mockAnimatedContentList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ itemSurface: 'panel', tiltItems: true })
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
    expect(screen.getByText(summaryText)).toBeVisible();
  });

  it('switches between highlights and skills within the shared tab panel while keeping the summary visible', async () => {
    const hemodynamicsExperience = experiences.find(
      (experience) => experience.title === 'Graduate Research Assistant'
    );

    expect(hemodynamicsExperience).toBeDefined();

    const summaryText = getExperienceSummaryText(hemodynamicsExperience!.description!);
    const firstSkill = hemodynamicsExperience!.skills?.[0];

    expect(summaryText).toBeTruthy();
    expect(firstSkill).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[hemodynamicsExperience!]} />
      </ThemeProvider>
    );

    expect(
      screen.queryByText(
        'Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).'
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText(firstSkill!)).not.toBeInTheDocument();
    expect(screen.getByText(summaryText)).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));
    });

    expect(screen.getByText(firstSkill!)).toBeVisible();
    expect(mockAnimatedSlideList.mock.calls.some(([props]) => props.layout === 'wrap')).toBe(true);
    expect(
      screen.queryByText(
        'Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).'
      )
    ).not.toBeInTheDocument();
    expect(screen.getByText(summaryText)).toBeVisible();
  });

  it('keeps a visible skills tab when skills are the only supplemental content', async () => {
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

    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));
    });

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

    const titleRow = screen.getByRole('heading', {
      name: 'Graduate Research Assistant',
    }).parentElement;

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
    expect(mtuLink).toHaveAttribute(
      'data-tooltip-content',
      'View Mathematical Sciences student directory'
    );

    expect(lucernaLink).toHaveAttribute('href', 'https://getlucerna.com');
    expect(lucernaLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(lucernaLink).toHaveAttribute('data-tooltip-content', 'View company site');
  });

  it('renders inline project links for the research assistant entry without separate reference bullets', async () => {
    const researchAssistant = experiences.find(
      (experience) => experience.title === 'Research Assistant | Full Time'
    );

    expect(researchAssistant).toBeDefined();

    render(
      <ThemeProvider>
        <ExperienceList experiences={[researchAssistant!]} />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Highlights' }));
    });

    const detailList = screen.getByRole('list');

    expect(
      mockAnimatedSlideList.mock.calls.some(
        ([props]) => props.containerComponent === 'ul' && props.itemComponent === 'li'
      )
    ).toBe(true);
    expect(within(detailList).getAllByRole('listitem')).toHaveLength(3);
    expect(
      screen.getByRole('link', { name: 'Quasi-Newton Optimization with Hessian Samples' })
    ).toHaveAttribute('href', 'https://lnkd.in/gfP39wZX');
    expect(
      screen.getByRole('link', { name: 'Quasi-Newton Optimization with Hessian Samples' })
    ).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(
      screen.getByRole('link', { name: 'Quasi-Newton Optimization with Hessian Samples' })
    ).toHaveAttribute('data-tooltip-content', 'View article on arxiv.org');

    expect(screen.getByRole('link', { name: 'BlockOpt.jl' })).toHaveAttribute(
      'href',
      'https://github.com/danphenderson/BlockOpt.jl'
    );
    expect(screen.getByRole('link', { name: 'BlockOpt.jl' })).toHaveAttribute(
      'data-tooltip-id',
      COMMON_LINK_TOOLTIP_ID
    );
    expect(screen.getByRole('link', { name: 'BlockOpt.jl' })).toHaveAttribute(
      'data-tooltip-content',
      'View Github repository'
    );

    expect(screen.getByRole('link', { name: 'UncNLPrograms.jl' })).toHaveAttribute(
      'href',
      'https://github.com/danphenderson/UncNLPrograms.jl'
    );
    expect(screen.getByRole('link', { name: 'UncNLPrograms.jl' })).toHaveAttribute(
      'data-tooltip-id',
      COMMON_LINK_TOOLTIP_ID
    );
    expect(screen.getByRole('link', { name: 'UncNLPrograms.jl' })).toHaveAttribute(
      'data-tooltip-content',
      'View Github repository'
    );
    expect(screen.queryByText('Article')).not.toBeInTheDocument();
    expect(screen.queryByText('Zenodo DOI')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
    expect(screen.queryByText('Repository (BlockOpt.jl)')).not.toBeInTheDocument();
    expect(screen.queryByText('Repository (UncNLPrograms.jl)')).not.toBeInTheDocument();
  });
});
