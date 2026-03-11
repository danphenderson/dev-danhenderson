import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { GitHubContributionCalendar } from './GitHubContributionCalendar';

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: ({ username }: { username: string }) => (
    <div data-testid="github-calendar" data-username={username} />
  ),
}));

describe('GitHubContributionCalendar', () => {
  it('renders calendar title, description, and GitHubCalendar component', () => {
    render(
      <ThemeProvider>
        <GitHubContributionCalendar username="testuser" />
      </ThemeProvider>
    );

    expect(screen.getByText('Contribution calendar')).toBeInTheDocument();
    expect(screen.getByText('Yearly GitHub activity at a glance.')).toBeInTheDocument();
    expect(screen.getByTestId('github-calendar')).toHaveAttribute('data-username', 'testuser');
  });
});
