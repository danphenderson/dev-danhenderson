import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { HeaderAppearanceDial } from '../../../../src/components/header/HeaderAppearanceDial';

jest.mock('../../../../src/components/AppSpeedDial', () => ({
  AppSpeedDial: ({
    ariaLabel,
    actions,
    direction,
    actionTooltipPlacement,
    FabProps,
  }: {
    ariaLabel: string;
    actions: Array<{ id: string; label: string; onClick?: () => void }>;
    direction?: string;
    actionTooltipPlacement?: string;
    FabProps?: { 'aria-describedby'?: string };
  }) => (
    <div
      data-testid="header-appearance-dial"
      data-aria-label={ariaLabel}
      data-direction={direction}
      data-action-tooltip-placement={actionTooltipPlacement}
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses a down-opening dial on desktop with the theme action and one action per preset', () => {
    renderDial();

    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute('data-direction', 'down');
    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute(
      'data-action-tooltip-placement',
      'left'
    );
    expect(screen.getByRole('button', { name: 'Open appearance presets' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Atlas appearance' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Use Evergreen appearance (active)' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Ember appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Solstice appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Drift appearance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use Graphite appearance' })).toBeInTheDocument();
  });

  it('keeps the same down-opening direction and tooltip placement across viewports', () => {
    renderDial();

    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute('data-direction', 'down');
    expect(screen.getByTestId('header-appearance-dial')).toHaveAttribute(
      'data-action-tooltip-placement',
      'left'
    );
  });

  it.each([
    ['Atlas', 'atlas'],
    ['Evergreen', 'evergreen'],
    ['Ember', 'ember'],
    ['Solstice', 'solstice'],
    ['Drift', 'drift'],
    ['Graphite', 'graphite'],
  ] as const)('calls onChangeAppearance with the chosen %s preset', (label, key) => {
    const onChangeAppearance = jest.fn();

    renderDial({ onChangeAppearance });

    fireEvent.click(
      screen.getByRole('button', {
        name: key === 'evergreen' ? `Use ${label} appearance (active)` : `Use ${label} appearance`,
      })
    );

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith(key);
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
