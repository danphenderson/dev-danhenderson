import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVGitHubSection } from '../../../../src/components/cv/CVGitHubSection';

const mockGitHubActivityList = jest.fn((_: { startDelayMs?: number }) => (
  <div data-testid="github-activity-list" />
));
const mockGitHubContributions = jest.fn((_: { startDelayMs?: number }) => (
  <div data-testid="github-contributions" />
));

jest.mock('../../../../src/components/layout/SectionCard', () => ({
  SectionCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../../src/components/cv/GitHubActivityList', () => ({
  GitHubActivityList: (props: { startDelayMs?: number }) => mockGitHubActivityList(props),
}));

jest.mock('../../../../src/components/cv/GitHubContributions', () => ({
  GitHubContributions: (props: { startDelayMs?: number }) => mockGitHubContributions(props),
}));

jest.mock('../../../../src/components/cv/GitHubContributionCalendar', () => ({
  GitHubContributionCalendar: () => <div data-testid="github-calendar" />,
}));

describe('CVGitHubSection offsets', () => {
  afterEach(() => {
    mockGitHubActivityList.mockClear();
    mockGitHubContributions.mockClear();
  });

  it('passes the shared item offset to the remaining repeatable GitHub item groups', () => {
    render(
      <ThemeProvider>
        <CVGitHubSection
          activity={[]}
          contributions={[]}
          loading={false}
          error={null}
          itemOffsetMs={120}
        />
      </ThemeProvider>
    );

    expect(mockGitHubActivityList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ startDelayMs: 120 })
    );
    expect(mockGitHubContributions.mock.calls[0][0]).toEqual(
      expect.objectContaining({ startDelayMs: 120 })
    );
    expect(mockGitHubActivityList).toHaveBeenCalledTimes(1);
    expect(mockGitHubContributions).toHaveBeenCalledTimes(1);
  });
});
