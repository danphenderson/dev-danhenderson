import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { VolunteeringList } from './VolunteeringList';

jest.mock('../AnimatedContentCard', () => ({
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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
  });
});
