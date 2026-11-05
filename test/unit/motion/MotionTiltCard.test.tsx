import { fireEvent, render, screen } from '@testing-library/react';
import { MotionTiltCard } from '../../../src/motion/components';

let mockTiltFactor = 1;
const mockValues: Array<{ set: jest.Mock; jump: jest.Mock }> = [];

jest.mock('../../../src/motion/hooks', () => ({
  useMotionScale: () => ({ tilt: mockTiltFactor }),
}));

jest.mock('motion/react', () => {
  const React = jest.requireActual('react');
  const Div = React.forwardRef(({ style: _style, ...props }: any, ref: any) => (
    <div {...props} ref={ref} data-testid="tilt-card" />
  ));
  Div.displayName = 'MotionDiv';
  return {
    motion: { div: Div },
    useMotionValue: () =>
      React.useMemo(() => {
        const value = { set: jest.fn(), jump: jest.fn() };
        mockValues.push(value);
        return value;
      }, []),
    useSpring: (value: unknown) => value,
  };
});

const pointer = (type: string, pointerType: string, buttons = 0) => {
  const event = new MouseEvent(type, { bubbles: true, clientX: 75, clientY: 25, buttons });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  fireEvent(screen.getByTestId('tilt-card'), event);
};

const renderCard = (disabled = false) => {
  const result = render(<MotionTiltCard disabled={disabled}>content</MotionTiltCard>);
  jest
    .spyOn(screen.getByTestId('tilt-card'), 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(0, 0, 100, 100));
  return result;
};

describe('MotionTiltCard input handling', () => {
  beforeEach(() => {
    mockValues.length = 0;
    mockTiltFactor = 1;
  });

  afterEach(() => jest.restoreAllMocks());

  it.each(['touch', 'pen'])(
    'does not move controls for %s or compatibility mouse events',
    (type) => {
      renderCard();
      pointer('pointerover', type);
      pointer('pointermove', type);
      fireEvent.mouseMove(screen.getByTestId('tilt-card'), { clientX: 75, clientY: 25 });

      mockValues.forEach((value) => expect(value.set).not.toHaveBeenCalled());
      expect(screen.getByTestId('tilt-card').style.willChange).toBe('');
    }
  );

  it('preserves mouse hover tilt, ignores dragging, and resets on cancellation', () => {
    renderCard();
    pointer('pointerover', 'mouse');
    pointer('pointermove', 'mouse');
    mockValues.forEach((value) => expect(value.set).toHaveBeenLastCalledWith(3));
    expect(screen.getByTestId('tilt-card').style.willChange).toBe('transform');

    pointer('pointermove', 'mouse', 1);
    mockValues.forEach((value) => expect(value.set).toHaveBeenCalledTimes(1));
    pointer('pointercancel', 'mouse');
    mockValues.forEach((value) => expect(value.set).toHaveBeenLastCalledWith(0));
    expect(screen.getByTestId('tilt-card').style.willChange).toBe('');
  });

  it.each(['disabled', 'motion off'])('immediately removes existing tilt when %s', (reason) => {
    const { rerender } = renderCard();
    pointer('pointermove', 'mouse');
    if (reason === 'motion off') mockTiltFactor = 0;
    rerender(<MotionTiltCard disabled={reason === 'disabled'}>content</MotionTiltCard>);

    mockValues.forEach((value) => {
      expect(value.set).toHaveBeenLastCalledWith(0);
      expect(value.jump).toHaveBeenLastCalledWith(0);
      value.set.mockClear();
    });
    pointer('pointermove', 'mouse');
    mockValues.forEach((value) => expect(value.set).not.toHaveBeenCalled());
    expect(screen.getByTestId('tilt-card').style.willChange).toBe('');
  });
});
