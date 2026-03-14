import { fireEvent, render, screen } from '@testing-library/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThemeProvider from '../../../../src/ThemeProvider';
import { HeaderAppearanceDial } from '../../../../src/components/header/HeaderAppearanceDial';

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

jest.mock('../../../../src/components/AppSpeedDial', () => ({
  AppSpeedDial: ({
    ariaLabel,
    actions,
    direction,
    FabProps,
  }: {
    ariaLabel: string;
    actions: Array<{ id: string; label: string; onClick?: () => void }>;
    direction?: string;
    FabProps?: { 'aria-describedby'?: string };
  }) => (
    <div
      data-testid="header-appearance-dial"
      data-aria-label={ariaLabel}
      data-direction={direction}
      data-fab-aria-describedby={FabProps?.['aria-describedby'] ?? ''}
    >
      <button type="button" aria-label={ariaLabel}>
        {ariaLabel}
      </button>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          aria-label={action.label}
          onClick={() => action.onClick?.()}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

const renderDial = (props: Partial<React.ComponentProps<typeof HeaderAppearanceDial>> = {}) =>
  render(
    <ThemeProvider>
      <HeaderAppearanceDial
        appearance="evergreen"
        iconButtonSize="medium"
        mode="light"
        onChangeAppearance={jest.fn()}
        onToggleTheme={jest.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe('HeaderAppearanceDial', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses a down-opening dial on desktop with the theme action and one action per preset', () => {
    renderDial();

    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute('data-direction', 'down');
    expect(screen.getByRole('button', { name: 'Open appearance presets' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Atlas appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Evergreen appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Ember appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Solstice appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Drift appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Graphite appearance' })).toBeInTheDocument();
  });

  it('uses a down-opening dial on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderDial();

    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute('data-direction', 'down');
  });

  it('calls onChangeAppearance with the chosen preset', () => {
    const onChangeAppearance = jest.fn();

    renderDial({ onChangeAppearance });

    fireEvent.click(screen.getByRole('button', { name: 'Use Ember appearance' }));

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith('ember');
  });

  it('calls onToggleTheme when the theme action is chosen', () => {
    const onToggleTheme = jest.fn();

    renderDial({
      mode: 'light',
      onToggleTheme,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('wires the dark mode hint description to the dial trigger', () => {
    renderDial({
      triggerDescriptionId: 'dark-mode-popover',
    });

    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute(
      'data-fab-aria-describedby',
      'dark-mode-popover'
    );
  });
});
