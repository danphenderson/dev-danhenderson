import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import { CommandPaletteProvider } from '../../../src/CommandPaletteProvider';
import { GlobalCommandPalette } from '../../../src/components/GlobalCommandPalette';

const mockUseReducedMotion = jest.fn().mockReturnValue(false);

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => mockUseReducedMotion(),
}));

// Use the actual useNavigate so RouteTrigger can genuinely change the route
// (the module-level mock replaces useNavigate only for GlobalCommandPalette's navigate calls)
const { useNavigate: realUseNavigate } =
  jest.requireActual<typeof import('react-router-dom')>('react-router-dom');

/** Button inside a MemoryRouter that navigates to `to` when clicked (uses real router navigate). */
const NavButton = ({ to }: { to: string }) => {
  const navigate = realUseNavigate();
  return <button data-testid="nav-trigger" onClick={() => navigate(to)} />;
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderPalette = (initialEntry = '/') =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialEntry]} future={routerFuture}>
        <CommandPaletteProvider>
          <GlobalCommandPalette />
        </CommandPaletteProvider>
      </MemoryRouter>
    </ThemeProvider>
  );

/** Open the palette programmatically via Cmd+K. */
const openViaCmdK = () => {
  fireEvent.keyDown(window, { key: 'k', metaKey: true });
};

/** Open via Ctrl+K. */
const openViaCtrlK = () => {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
};

const createHashTarget = (id: string, top = 200) => {
  const target = document.createElement('div');
  target.id = id;
  target.getBoundingClientRect = () => ({
    x: 0,
    y: top,
    width: 0,
    height: 0,
    top,
    right: 0,
    bottom: top,
    left: 0,
    toJSON: () => ({}),
  });
  document.body.appendChild(target);
  return target;
};

describe('GlobalCommandPalette', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseReducedMotion.mockReset();
    mockUseReducedMotion.mockReturnValue(false);
    document.documentElement.style.scrollBehavior = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('keyboard shortcut — open', () => {
    it('opens via Cmd+K', () => {
      renderPalette();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      openViaCmdK();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('opens via Ctrl+K', () => {
      renderPalette();
      openViaCtrlK();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('toggles closed when Cmd+K is pressed while the palette is already open', async () => {
      renderPalette();
      openViaCmdK();
      const searchBox = screen.getByRole('textbox', {
        name: 'Search routes, albums, and CV sections',
      });
      expect(searchBox).toBeInTheDocument();

      fireEvent.keyDown(searchBox, { key: 'k', metaKey: true });

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('opens via "/" key', () => {
      renderPalette();
      fireEvent.keyDown(window, { key: '/' });
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('does not open when Cmd+K is pressed inside an input element', () => {
      renderPalette();
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      fireEvent.keyDown(input, { key: 'k', metaKey: true });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      document.body.removeChild(input);
    });

    it('does not open when "/" is pressed inside a textarea element', () => {
      renderPalette();
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();
      fireEvent.keyDown(textarea, { key: '/' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      document.body.removeChild(textarea);
    });
  });

  describe('search filtering', () => {
    it('shows multiple actions when the search field is empty', () => {
      renderPalette();
      openViaCmdK();
      // Known stable actions from commandPaletteActions
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('CV')).toBeInTheDocument();
    });

    it('shows only matching actions when the user types a query', () => {
      renderPalette();
      openViaCmdK();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'climbing' } });
      // Climbing action still visible
      expect(screen.getByText('Climbing')).toBeInTheDocument();
      // Home should no longer be visible (does not match "climbing")
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('shows "No matching routes" when no actions match', () => {
      renderPalette();
      openViaCmdK();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'xyzzy-no-match-ever' },
      });
      expect(screen.getByText(/no matching routes/i)).toBeInTheDocument();
    });

    it('matches queries case-insensitively in the rendered action list', () => {
      renderPalette();
      openViaCmdK();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'PHOTOGRAPHY' } });

      expect(screen.getByText('Photography')).toBeInTheDocument();
    });
  });

  describe('close behavior', () => {
    it('closes when Escape is pressed inside the dialog', async () => {
      renderPalette();
      openViaCmdK();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      // MUI Dialog handles Escape via its Modal onKeyDown handler and calls onClose
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
  });

  describe('action selection', () => {
    it('navigates and closes the palette when an action is selected', async () => {
      renderPalette('/');
      openViaCmdK();
      // Filter to "CV" for a stable single target
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'cv' } });
      // Click the "CV" action (stable label from commandPaletteActions)
      fireEvent.click(screen.getByText('CV'));
      expect(mockNavigate).toHaveBeenCalled();
      // Dialog closes after the Fade exit transition completes
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('moves the active result with arrow keys and selects it with Enter', async () => {
      renderPalette('/');
      openViaCmdK();

      const searchBox = screen.getByRole('textbox', {
        name: 'Search routes, albums, and CV sections',
      });

      expect(searchBox).toHaveAttribute('aria-activedescendant', 'command-palette-action-route-home');

      fireEvent.keyDown(searchBox, { key: 'ArrowDown' });
      expect(searchBox).toHaveAttribute('aria-activedescendant', 'command-palette-action-route-cv');

      fireEvent.keyDown(searchBox, { key: 'Enter' });

      expect(mockNavigate).toHaveBeenCalledWith('/cv');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('wraps active result navigation when using ArrowUp from the first result', () => {
      renderPalette('/');
      openViaCmdK();

      const searchBox = screen.getByRole('textbox', {
        name: 'Search routes, albums, and CV sections',
      });

      fireEvent.change(searchBox, { target: { value: 'album:' } });

      fireEvent.keyDown(searchBox, { key: 'ArrowUp' });

      expect(searchBox).toHaveAttribute(
        'aria-activedescendant',
        'command-palette-action-photo-album-new-mexico'
      );
    });

    it('uses smooth scrolling for same-route hash actions when motion is enabled', () => {
      const target = createHashTarget('cv-about');
      const scrollToMock = jest.fn();
      const originalScrollTo = window.scrollTo;
      const originalRequestAnimationFrame = window.requestAnimationFrame;

      Object.defineProperty(window, 'scrollTo', {
        configurable: true,
        writable: true,
        value: scrollToMock,
      });
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        writable: true,
        value: (callback: FrameRequestCallback) => {
          callback(0);
          return 0;
        },
      });

      renderPalette('/cv');
      openViaCmdK();
      fireEvent.click(screen.getByText('CV: About'));

      expect(scrollToMock).toHaveBeenCalledWith({ top: 88, behavior: 'smooth' });

      target.remove();
      Object.defineProperty(window, 'scrollTo', {
        configurable: true,
        writable: true,
        value: originalScrollTo,
      });
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        writable: true,
        value: originalRequestAnimationFrame,
      });
    });

    it('disables animated scrolling for same-route hash actions when reduced motion is active', () => {
      mockUseReducedMotion.mockReturnValue(true);

      const target = createHashTarget('cv-about');
      const scrollToMock = jest.fn();
      const originalScrollTo = window.scrollTo;
      const originalRequestAnimationFrame = window.requestAnimationFrame;

      document.documentElement.style.scrollBehavior = 'smooth';

      Object.defineProperty(window, 'scrollTo', {
        configurable: true,
        writable: true,
        value: scrollToMock,
      });
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        writable: true,
        value: (callback: FrameRequestCallback) => {
          callback(0);
          return 0;
        },
      });

      renderPalette('/cv');
      openViaCmdK();
      fireEvent.click(screen.getByText('CV: About'));

      expect(scrollToMock).toHaveBeenCalledWith({ top: 88, behavior: 'auto' });
      expect(document.documentElement.style.scrollBehavior).toBe('smooth');

      target.remove();
      Object.defineProperty(window, 'scrollTo', {
        configurable: true,
        writable: true,
        value: originalScrollTo,
      });
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        writable: true,
        value: originalRequestAnimationFrame,
      });
    });
  });

  describe('auto-close on navigation', () => {
    it('closes the palette when the route changes', async () => {
      render(
        <ThemeProvider>
          <MemoryRouter initialEntries={['/cv']} future={routerFuture}>
            <CommandPaletteProvider>
              <GlobalCommandPalette />
              {/* NavButton uses the real router navigate so clicking it actually changes location */}
              <NavButton to="/climbing" />
            </CommandPaletteProvider>
          </MemoryRouter>
        </ThemeProvider>
      );

      openViaCmdK();
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Trigger a real in-router navigation; the palette's location-change effect should close it
      fireEvent.click(screen.getByTestId('nav-trigger'));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
  });
});
