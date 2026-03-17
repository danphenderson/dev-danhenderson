import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../src/ThemeProvider';
import { CommandPaletteProvider } from '../../../src/CommandPaletteProvider';

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

// Import after mocks
import { GlobalCommandPalette } from '../../../src/components/GlobalCommandPalette';

const renderPalette = (initialEntry = '/') =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
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

describe('GlobalCommandPalette', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
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
  });

  describe('auto-close on navigation', () => {
    it('closes the palette when the route changes', async () => {
      render(
        <ThemeProvider>
          <MemoryRouter initialEntries={['/cv']}>
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
