import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { VolunteeringList } from './VolunteeringList';

type MockSx = { [key: string]: unknown } | Array<{ [key: string]: unknown }>;

const hasSxEntry = (sx?: MockSx, predicate?: (entry: { [key: string]: unknown }) => boolean) => {
  const sxEntries = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return predicate ? sxEntries.some((entry) => predicate(entry)) : false;
};

jest.mock('../AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    sx,
  }: {
    children: ReactNode;
    sx?: MockSx;
  }) => (
    <div
      data-testid="volunteering-item"
      data-has-card-reset={String(
        hasSxEntry(
          sx,
          (entry) =>
            entry.background === 'none' &&
            entry.backgroundColor === 'transparent' &&
            entry.border === 'none' &&
            entry.boxShadow === 'none'
        )
      )}
      data-has-panel-surface={String(
        hasSxEntry(sx, (entry) => entry.borderRadius === 1.5 && entry.p === 1)
      )}
    >
      {children}
    </div>
  ),
}));

describe('VolunteeringList', () => {
  it('renders volunteering entries with role, date, location, and highlights', () => {
    render(
      <ThemeProvider>
        <VolunteeringList
          volunteering={[
            {
              organization: 'Access Fund',
              organizationUrl: 'https://www.accessfund.org',
              role: 'Conservation Team',
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
    expect(screen.getByText('May 2019 – Present')).toBeInTheDocument();
    expect(screen.getByText('Index, WA')).toBeInTheDocument();
    expect(
      screen.getByText('Supported trail construction and maintenance projects with the Access Fund conservation team.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Access Fund' })).toHaveAttribute('href', 'https://www.accessfund.org');
    expect(screen.getByTestId('volunteering-item')).toHaveAttribute('data-has-card-reset', 'true');
    expect(screen.getByTestId('volunteering-item')).toHaveAttribute('data-has-panel-surface', 'true');
  });
});
