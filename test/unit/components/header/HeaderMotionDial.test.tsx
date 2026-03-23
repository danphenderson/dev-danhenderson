import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { HeaderMotionDial } from '../../../../src/components/header/HeaderMotionDial';

jest.mock('../../../../src/components/AppSpeedDial', () => ({
  AppSpeedDial: ({
    ariaLabel,
    actions,
    direction,
    actionTooltipPlacement,
  }: {
    ariaLabel: string;
    actions: Array<{ id: string; label: string; onClick?: () => void }>;
    direction?: string;
    actionTooltipPlacement?: string;
  }) => (
    <div
      data-testid="header-motion-dial"
      data-aria-label={ariaLabel}
      data-direction={direction}
      data-action-tooltip-placement={actionTooltipPlacement}
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

const renderDial = (props: Partial<React.ComponentProps<typeof HeaderMotionDial>> = {}) =>
  render(
    <ThemeProvider>
      <HeaderMotionDial
        motionIntensity="default"
        iconButtonSize="medium"
        onChangeMotionIntensity={jest.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe('HeaderMotionDial', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses a down-opening dial with left-placed action tooltips', () => {
    renderDial();

    expect(screen.getByTestId('header-motion-dial')).toHaveAttribute('data-direction', 'down');
    expect(screen.getByTestId('header-motion-dial')).toHaveAttribute(
      'data-action-tooltip-placement',
      'left'
    );
    expect(screen.getByRole('button', { name: 'Open motion intensity presets' })).toBeInTheDocument();
  });

  it.each([
    ['Motion off', 'off'],
    ['Subtle motion', 'subtle'],
    ['Default motion (active)', 'default'],
    ['Expressive motion', 'expressive'],
  ] as const)('calls onChangeMotionIntensity for %s', (label, value) => {
    const onChangeMotionIntensity = jest.fn();

    renderDial({ onChangeMotionIntensity });

    fireEvent.click(screen.getByRole('button', { name: label }));

    expect(onChangeMotionIntensity).toHaveBeenCalledTimes(1);
    expect(onChangeMotionIntensity).toHaveBeenCalledWith(value);
  });

  it('marks the active motion level in the action labels', () => {
    renderDial({ motionIntensity: 'expressive' });

    expect(screen.getByRole('button', { name: 'Expressive motion (active)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Default motion' })).toBeInTheDocument();
  });
});
