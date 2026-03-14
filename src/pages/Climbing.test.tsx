import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { COMMON_LINK_TOOLTIP_ID } from '../components/CommonLink';
import Climbing from './Climbing';

jest.mock('../hooks/useClimbingData', () => ({
  useClimbingData: () => ({
    ticks: [
      {
        id: 'tick-1',
        date: '6/26/2025',
        route: 'Hyperspace',
        grade: '5.11a',
        location: 'Leavenworth',
        url: 'https://mp.com/route/1',
      },
    ],
    todos: [
      {
        id: 'todo-1',
        route: 'The Tooth',
        grade: '5.4',
        location: 'Alpental',
        url: 'https://mp.com/route/2',
      },
    ],
  }),
  TickRow: undefined,
  TodoRow: undefined,
}));

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 480,
  AnimatedContentCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('Climbing', () => {
  it('renders the climbing page with section headings, data grids, and inline route links', () => {
    render(
      <ThemeProvider>
        <Climbing />
      </ThemeProvider>
    );

    expect(screen.getByText('Climbing')).toBeInTheDocument();
    expect(screen.getByText('TODO Routes')).toBeInTheDocument();
    expect(
      screen.getByText("A collection of routes I've remembered to tick on Mountain Project.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("A collection of routes I'm interested in climbing.")
    ).toBeInTheDocument();
    const tickLink = screen.getByRole('link', { name: 'Hyperspace' });
    const todoLink = screen.getByRole('link', { name: 'The Tooth' });

    expect(tickLink).toHaveAttribute('href', 'https://mp.com/route/1');
    expect(tickLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(tickLink).toHaveAttribute(
      'data-tooltip-content',
      'Open Hyperspace on Mountain Project.'
    );
    expect(todoLink).toHaveAttribute('href', 'https://mp.com/route/2');
    expect(todoLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(todoLink).toHaveAttribute('data-tooltip-content', 'Open The Tooth on Mountain Project.');
  });
});
