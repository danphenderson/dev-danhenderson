import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../src/ThemeProvider';
import { CommandPaletteProvider } from '../../../src/CommandPaletteProvider';
import { RouteRecoveryPanel } from '../../../src/components/RouteRecoveryPanel';
import type { RecoverySuggestion } from '../../../src/constants/recoveryContext';

const mockOpenPalette = jest.fn();

jest.mock('../../../src/CommandPaletteProvider', () => {
  const actual = jest.requireActual('../../../src/CommandPaletteProvider');

  return {
    ...actual,
    useCommandPalette: () => ({
      openPalette: mockOpenPalette,
      isOpen: false,
      query: '',
      closePalette: jest.fn(),
      setQuery: jest.fn(),
    }),
  };
});

const defaultSuggestions: RecoverySuggestion[] = [
  {
    id: 'cv-section-about',
    label: 'CV: About',
    description: 'About me section',
    path: '/cv#about',
    keywords: ['about', 'bio'],
    matchReason: 'Closest matching CV section.',
    score: 30,
    kind: 'cv-section',
    routeId: 'cv',
  },
];

const defaultRecoveryActions = [
  {
    id: 'route-home',
    label: 'Home',
    description: 'Return to the home page',
    path: '/',
    keywords: ['home', 'start'],
    recoveryPriority: 1,
    kind: 'route' as const,
    routeId: 'home' as const,
  },
  {
    id: 'route-cv',
    label: 'CV',
    description: 'View my CV',
    path: '/cv',
    keywords: ['resume'],
    recoveryPriority: 2,
    kind: 'route' as const,
    routeId: 'cv' as const,
  },
];

const renderPanel = (
  overrides: Partial<{
    attemptedPathLabel: string;
    routeHintLabel: string | null;
    contextualSuggestions: RecoverySuggestion[];
    recoveryActions: typeof defaultRecoveryActions;
    suggestedPaletteQuery: string;
  }> = {}
) =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <CommandPaletteProvider>
          <RouteRecoveryPanel
            attemptedPathLabel={overrides.attemptedPathLabel ?? '/cv/unknown'}
            routeHintLabel={overrides.routeHintLabel ?? null}
            contextualSuggestions={overrides.contextualSuggestions ?? defaultSuggestions}
            recoveryActions={overrides.recoveryActions ?? defaultRecoveryActions}
            suggestedPaletteQuery={overrides.suggestedPaletteQuery ?? 'unknown'}
          />
        </CommandPaletteProvider>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('RouteRecoveryPanel', () => {
  beforeEach(() => {
    mockOpenPalette.mockClear();
  });

  it('renders the attempted path label', () => {
    renderPanel({ attemptedPathLabel: '/cv/missing-section' });
    expect(screen.getByText('/cv/missing-section')).toBeInTheDocument();
  });

  it('renders the route hint label when provided', () => {
    renderPanel({ routeHintLabel: 'It looks like you were trying to reach CV.' });
    expect(screen.getByText('It looks like you were trying to reach CV.')).toBeInTheDocument();
  });

  it('does not render the route hint when not provided', () => {
    renderPanel({ routeHintLabel: null });
    expect(screen.queryByText(/it looks like you were trying to reach/i)).not.toBeInTheDocument();
  });

  it('shows the suggested palette query in the caption when provided', () => {
    renderPanel({ suggestedPaletteQuery: 'experience' });
    expect(screen.getByText(/prefilled with "experience"/i)).toBeInTheDocument();
  });

  it('shows generic caption when palette query is empty', () => {
    renderPanel({ suggestedPaletteQuery: '' });
    expect(screen.getByText(/search all routes/i)).toBeInTheDocument();
  });

  it('opens the command palette with the suggested query when the button is clicked', () => {
    renderPanel({ suggestedPaletteQuery: 'experience' });
    fireEvent.click(screen.getByRole('button', { name: /open command palette/i }));
    expect(mockOpenPalette).toHaveBeenCalledWith('experience');
  });

  it('renders contextual suggestions with labels and descriptions', () => {
    renderPanel();
    expect(screen.getByText('CV: About')).toBeInTheDocument();
    expect(screen.getByText('About me section')).toBeInTheDocument();
    expect(screen.getByText('Closest matching CV section.')).toBeInTheDocument();
  });

  it('renders a link with correct href for each contextual suggestion', () => {
    renderPanel();
    const link = screen.getByRole('link', { name: /open cv: about/i });
    expect(link).toHaveAttribute('href', '/cv#about');
  });

  it('renders no suggestion section when contextualSuggestions is empty', () => {
    renderPanel({ contextualSuggestions: [] });
    expect(screen.queryByText(/suggested destinations/i)).not.toBeInTheDocument();
  });

  it('renders recovery actions with links', () => {
    renderPanel();
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^open cv$/i })).toHaveAttribute('href', '/cv');
  });

  it('labels the first recovery action "Go home"', () => {
    renderPanel();
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();
  });

  it('labels subsequent recovery actions "Open <label>"', () => {
    renderPanel();
    expect(screen.getByRole('link', { name: /^open cv$/i })).toBeInTheDocument();
  });
});
