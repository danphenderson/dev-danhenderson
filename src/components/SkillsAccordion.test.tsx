import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { SkillsAccordion } from './SkillsAccordion';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Zoom: ({
      children,
      in: inProp,
      appear,
    }: {
      children: ReactNode;
      in: boolean;
      appear?: boolean;
    }) => (
      <div data-testid="chip-zoom" data-in={String(inProp)} data-appear={String(appear ?? true)}>
        {children}
      </div>
    ),
  };
});

const defaultMatchMedia = window.matchMedia;

const setReducedMotionPreference = (matches: boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('SkillsAccordion', () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
    jest.clearAllMocks();
  });

  it('animates chips concurrently with accordion expansion', () => {
    setReducedMotionPreference(false);

    render(
      <ThemeProvider>
        <SkillsAccordion title="Toolkit" skills={['React', 'TypeScript']} defaultExpanded={false} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Toolkit/ }));

    screen.getAllByTestId('chip-zoom').forEach((zoom) => {
      expect(zoom).toHaveAttribute('data-in', 'true');
      expect(zoom).toHaveAttribute('data-appear', 'false');
    });
  });

  it('renders static chips without zoom wrappers under reduced motion', () => {
    setReducedMotionPreference(true);

    render(
      <ThemeProvider>
        <SkillsAccordion title="Toolkit" skills={['React', 'TypeScript']} defaultExpanded={false} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Toolkit/ }));

    expect(screen.queryByTestId('chip-zoom')).not.toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
