import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { educationInfo } from '../../../../src/data/cv';
import { EducationSection } from '../../../../src/components/cv/EducationSection';

const mockAnimatedContentList = jest.fn();
const mockAnimatedSlideList = jest.fn();

jest.mock('../../../../src/components/AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    mountItemsOnView?: boolean;
  }) => {
    mockAnimatedContentList(props);

    return (
      <div>
        {props.items.map((item, index) => (
          <div key={index}>{props.renderItem(item, index)}</div>
        ))}
      </div>
    );
  },
}));

jest.mock('../../../../src/components/AnimatedSlideList', () => ({
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

describe('EducationSection', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
    mockAnimatedSlideList.mockClear();
  });

  it('groups highlights and skills into the shared tab panel', () => {
    render(
      <ThemeProvider>
        <EducationSection education={{ entries: [educationInfo.entries[0]] }} />
      </ThemeProvider>
    );

    expect(mockAnimatedContentList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ mountItemsOnView: true })
    );
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Highlights',
      'Coursework',
      'Skills',
    ]);
    expect(
      screen.getByText(
        'Graduate work centered on applied mathematics, numerical methods, and computational modeling for hemodynamics research.'
      )
    ).toBeVisible();
    expect(
      screen.queryByText(
        'Pedagogical training in curriculum design, assessment, and evidence-based instruction.'
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Linear Algebra')).not.toBeInTheDocument();
    expect(screen.queryByText('LaTeX')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Highlights' }));

    expect(
      screen.getByText(
        'Pedagogical training in curriculum design, assessment, and evidence-based instruction.'
      )
    ).toBeVisible();
    expect(
      mockAnimatedSlideList.mock.calls.some(
        ([props]) => props.containerComponent === 'ul' && props.itemComponent === 'li'
      )
    ).toBe(true);
    expect(screen.queryByText('Linear Algebra')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Coursework' }));

    expect(screen.getByText('Linear Algebra')).toBeVisible();
    expect(screen.getByText('Numerical Optimization')).toBeVisible();
    expect(
      screen.queryByText(
        'Pedagogical training in curriculum design, assessment, and evidence-based instruction.'
      )
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('LaTeX')).toBeVisible();
    expect(mockAnimatedSlideList.mock.calls.some(([props]) => props.layout === 'wrap')).toBe(true);
    expect(screen.queryByText('Linear Algebra')).not.toBeInTheDocument();
  });

  it('renders the program as title and university as secondary label with explicit metadata chips', () => {
    render(
      <ThemeProvider>
        <EducationSection education={{ entries: [educationInfo.entries[0]] }} />
      </ThemeProvider>
    );

    const programHeading = screen.getByRole('heading', {
      name: 'MS Mathematics, Applied/Computational',
    });

    expect(programHeading).toBeInTheDocument();

    const titleRow = programHeading.parentElement;

    expect(titleRow).toHaveTextContent('Fall 2024 – Present');

    expect(screen.getByText('Michigan Technological University')).toBeInTheDocument();
    expect(screen.getByText('Expected Summer 2026').closest('.MuiChip-root')).not.toBeNull();
    const gpaChip = screen.getByText('Cumulative: 3.44').closest('.MuiChip-root');

    expect(gpaChip).not.toBeNull();
  });

  it('renders GPA and minor metadata as chips for the BS entry', () => {
    render(
      <ThemeProvider>
        <EducationSection education={{ entries: [educationInfo.entries[1]] }} />
      </ThemeProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'B.S. Cum Laude, Mathematics, Applied/Computational' })
    ).toBeInTheDocument();
    const organizationRow = screen.getByText('Michigan Technological University').parentElement;

    expect(organizationRow).not.toBeNull();
    expect(organizationRow).toHaveTextContent('Cumulative: 3.56');
    expect(organizationRow).toHaveTextContent('Departmental: 3.71');
    expect(screen.getByText('Cumulative: 3.56').closest('.MuiChip-root')).not.toBeNull();
    expect(screen.getByText('Departmental: 3.71').closest('.MuiChip-root')).not.toBeNull();
    expect(screen.getByText('Minor in Computer Science').closest('.MuiChip-root')).not.toBeNull();
    expect(screen.queryByText('Cumulative: 3.56 | Departmental: 3.71')).not.toBeInTheDocument();
  });
});
