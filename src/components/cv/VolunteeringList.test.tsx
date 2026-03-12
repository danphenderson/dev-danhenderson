import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { VolunteeringList } from './VolunteeringList';

const mockAnimatedContentList = jest.fn();

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
        {props.items.map((item, index) => <div key={index}>{props.renderItem(item, index)}</div>)}
      </div>
    );
  },
}));

describe('VolunteeringList', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
  });

  it('renders volunteering entries with role, date, location, and highlights', () => {
    render(
      <ThemeProvider>
        <VolunteeringList
          volunteering={[
            {
              organization: 'Access Fund',
              organizationUrl: 'https://www.accessfund.org',
              role: 'Conservation Team',
              summary: 'Stewardship volunteer work supporting access, trail durability, and maintenance at major climbing areas.',
              dateRange: 'May 2019 – Present',
              location: 'Index, WA',
              highlights: ['Supported trail construction and maintenance projects with the Access Fund conservation team.'],
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Access Fund')).toBeInTheDocument();
    expect(screen.getByText('Conservation Team')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stewardship volunteer work supporting access, trail durability, and maintenance at major climbing areas.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('May 2019 – Present')).toBeInTheDocument();
    expect(screen.getByText('Index, WA')).toBeInTheDocument();
    expect(
      screen.getByText('Supported trail construction and maintenance projects with the Access Fund conservation team.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Access Fund' })).toHaveAttribute('href', 'https://www.accessfund.org');
    expect(screen.getByTestId('volunteering-list')).toHaveAttribute('data-item-surface', 'panel');
    expect(screen.getByTestId('volunteering-list')).toHaveAttribute('data-mount-items-on-view', 'true');
  });
});
