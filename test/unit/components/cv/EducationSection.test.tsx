import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { educationInfo } from '../../../../src/data/cv';
import { EducationSection } from '../../../../src/components/cv/EducationSection';

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

const mockAnimatedContentList = jest.fn();
const mockAnimatedSlideList = jest.fn();

jest.mock('../../../../src/components/AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    mountItemsOnView?: boolean;
    tiltItems?: boolean;
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

describe('EducationSection', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
    mockAnimatedSlideList.mockClear();
  });

  it('groups highlights and skills into the shared tab panel', async () => {
    const primaryEducationEntry = educationInfo.entries[0];
    const firstHighlight = primaryEducationEntry.highlights?.[0];
    const firstSkill = primaryEducationEntry.skills?.[0];
    const courseworkItems =
      primaryEducationEntry.highlights
        ?.find((highlight) => highlight.startsWith('Coursework:'))
        ?.replace(/^Coursework:\s*/, '')
        .split(',')
        .map((course) => course.trim())
        .filter((course) => course.length > 0) ?? [];

    expect(firstHighlight).toBeDefined();
    expect(firstSkill).toBeDefined();
    expect(courseworkItems.length).toBeGreaterThanOrEqual(2);

    render(
      <ThemeProvider>
        <EducationSection education={{ entries: [primaryEducationEntry] }} />
      </ThemeProvider>
    );

    expect(mockAnimatedContentList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ mountItemsOnView: true, tiltItems: true })
    );
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Highlights',
      'Coursework',
      'Skills',
    ]);
    expect(screen.getByText(primaryEducationEntry.summary)).toBeVisible();
    expect(screen.queryByText(firstHighlight!)).not.toBeInTheDocument();
    expect(screen.queryByText(courseworkItems[0]!)).not.toBeInTheDocument();
    expect(screen.queryByText(firstSkill!)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Highlights' }));
    });

    expect(screen.getByText(firstHighlight!)).toBeVisible();
    expect(
      mockAnimatedSlideList.mock.calls.some(
        ([props]) => props.containerComponent === 'ul' && props.itemComponent === 'li'
      )
    ).toBe(true);
    expect(screen.queryByText(courseworkItems[0]!)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Coursework' }));
    });

    expect(screen.getByText(courseworkItems[0]!)).toBeVisible();
    expect(screen.getByText(courseworkItems[1]!)).toBeVisible();
    expect(screen.queryByText(firstHighlight!)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));
    });

    expect(screen.getByText(firstSkill!)).toBeVisible();
    expect(mockAnimatedSlideList.mock.calls.some(([props]) => props.layout === 'wrap')).toBe(true);
    expect(screen.queryByText(courseworkItems[0]!)).not.toBeInTheDocument();
  });

  it('renders the program as title and university as secondary label with explicit metadata', () => {
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
    expect(screen.getByText('Expected Summer 2026')).toBeInTheDocument();
    const gpaChip = screen.getByText('Cumulative: 3.44').closest('.MuiChip-root');

    expect(gpaChip).not.toBeNull();
  });

  it('renders separate GPA chips while keeping minor as supporting metadata for the BS entry', () => {
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
    expect(screen.getByText('Minor in Computer Science')).toBeInTheDocument();
    expect(screen.queryByText('Cumulative: 3.56 | Departmental: 3.71')).not.toBeInTheDocument();
  });
});
