import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import { VolunteeringList } from './VolunteeringList';

const mockAnimatedContentList = jest.fn();
const mockAnimatedSlideList = jest.fn();

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    itemSurface?: string;
    mountItemsOnView?: boolean;
  }) => {
    mockAnimatedContentList(props);

    return (
      <div
        data-testid="volunteering-list"
        data-item-surface={props.itemSurface ?? ''}
        data-mount-items-on-view={String(Boolean(props.mountItemsOnView))}
      >
        {props.items.map((item, index) => (
          <div key={index}>{props.renderItem(item, index)}</div>
        ))}
      </div>
    );
  },
}));

jest.mock('../AnimatedSlideList', () => ({
  AnimatedSlideList: (props: {
    items: unknown[];
    getItemKey: (item: unknown, index: number) => string;
    renderItem: (item: unknown, index: number) => ReactNode;
    in: boolean;
    containerComponent?: React.ElementType;
    itemComponent?: React.ElementType;
  }) => {
    mockAnimatedSlideList(props);

    const React = require('react');

    const ContainerComponent = props.containerComponent ?? 'div';
    const ItemComponent = props.itemComponent ?? 'div';

    return React.createElement(
      ContainerComponent,
      { 'data-testid': 'animated-slide-list' },
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

describe('VolunteeringList', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
    mockAnimatedSlideList.mockClear();
  });

  it('renders volunteering entries with role as title, organization as secondary label, and details in a shared tab panel', () => {
    render(
      <ThemeProvider>
        <VolunteeringList
          volunteering={[
            {
              organization: 'Access Fund',
              organizationUrl: 'https://www.accessfund.org',
              role: 'Conservation Team',
              summary:
                'Stewardship volunteer work supporting access, trail durability, and maintenance at major climbing areas.',
              dateRange: 'May 2019 – Present',
              location: 'Index, WA',
              highlights: [
                'Supported trail construction and maintenance projects with the Access Fund conservation team.',
              ],
            },
          ]}
        />
      </ThemeProvider>
    );

    const roleHeading = screen.getByRole('heading', { name: 'Conservation Team' });

    expect(roleHeading).toBeInTheDocument();

    const titleRow = roleHeading.parentElement;

    expect(titleRow).toHaveTextContent('May 2019 – Present');

    expect(screen.getByText('Access Fund')).toBeInTheDocument();
    expect(screen.getByText('Index, WA')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stewardship volunteer work supporting access, trail durability, and maintenance at major climbing areas.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Supported trail construction and maintenance projects with the Access Fund conservation team.'
      )
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    expect(
      screen.getByText(
        'Supported trail construction and maintenance projects with the Access Fund conservation team.'
      )
    ).toBeVisible();
    expect(
      mockAnimatedSlideList.mock.calls.some(
        ([props]) => props.containerComponent === 'ul' && props.itemComponent === 'li'
      )
    ).toBe(true);
    expect(screen.getByRole('link', { name: 'Access Fund' })).toHaveAttribute(
      'href',
      'https://www.accessfund.org'
    );
    expect(screen.getByTestId('volunteering-list')).toHaveAttribute('data-item-surface', 'panel');
    expect(screen.getByTestId('volunteering-list')).toHaveAttribute(
      'data-mount-items-on-view',
      'true'
    );
  });

  it('renders tooltip-enabled organization links for Little Brothers and Access Fund', () => {
    render(
      <ThemeProvider>
        <VolunteeringList
          volunteering={[
            {
              organization: 'Little Brothers',
              organizationUrl: 'https://lbfenetwork.org',
              organizationTooltip: 'View organization site',
              role: 'Friends of the Elderly',
              summary: 'Service work focused on restoring donated medical equipment.',
              dateRange: 'Feb 2026',
              location: 'Houghton, MI',
              highlights: ['Sorted, cleaned, and repaired donated medical equipment.'],
            },
            {
              organization: 'Access Fund',
              organizationUrl: 'https://www.accessfund.org',
              organizationTooltip: 'View organization site',
              role: 'Conservation Team',
              summary: 'Stewardship volunteer work supporting access and maintenance.',
              dateRange: 'May 2019 – Present',
              location: 'Index, WA',
              highlights: ['Supported trail construction and maintenance projects.'],
            },
          ]}
        />
      </ThemeProvider>
    );

    const littleBrothersLink = screen.getByRole('link', { name: 'Little Brothers' });
    const accessFundLink = screen.getByRole('link', { name: 'Access Fund' });

    expect(littleBrothersLink).toHaveAttribute('href', 'https://lbfenetwork.org');
    expect(littleBrothersLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(littleBrothersLink).toHaveAttribute('data-tooltip-content', 'View organization site');

    expect(accessFundLink).toHaveAttribute('href', 'https://www.accessfund.org');
    expect(accessFundLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(accessFundLink).toHaveAttribute('data-tooltip-content', 'View organization site');
  });
});
