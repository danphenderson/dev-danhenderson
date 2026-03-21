import { render, fireEvent } from '@testing-library/react';
import { TiltCard } from '../../../../src/components/photography/TiltCard';

const mockMotionDivRender = jest.fn();
const mockUseSpring = jest.fn((source: unknown, _config?: unknown) => source);
const mockUseReducedMotion = jest.fn().mockReturnValue(false);

jest.mock('../../../../src/motion/hooks', () => ({
  useMotionScale: () => ({ duration: 1, stagger: 1, tilt: mockUseReducedMotion() ? 0 : 1 }),
}));

jest.mock('motion/react', () => ({
  motion: {
    div: require('react').forwardRef(
      ({ children, style, onMouseMove, onMouseLeave, className, ...rest }: any, ref: any) => {
        mockMotionDivRender({ style, onMouseMove, onMouseLeave, className, ...rest });

        return (
          <div
            ref={ref}
            data-testid="tilt-card"
            className={className}
            style={style}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            {...rest}
          >
            {children}
          </div>
        );
      }
    ),
  },
  useMotionValue: (initial: number) => ({ get: () => initial, set: jest.fn() }),
  useSpring: (source: unknown, config: unknown) => mockUseSpring(source, config),
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('TiltCard', () => {
  afterEach(() => {
    mockMotionDivRender.mockClear();
    mockUseSpring.mockClear();
    mockUseReducedMotion.mockReset();
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('renders children', () => {
    const { getByText } = render(
      <TiltCard>
        <span>Card content</span>
      </TiltCard>
    );

    expect(getByText('Card content')).toBeInTheDocument();
  });

  it('applies className and style props', () => {
    const { getByTestId } = render(
      <TiltCard className="custom" style={{ border: '1px solid red' }}>
        Content
      </TiltCard>
    );

    const card = getByTestId('tilt-card');

    expect(card).toHaveClass('custom');
    expect(card.style.border).toBe('1px solid red');
  });

  it('preserves the shared depth and spring settings', () => {
    const { getByTestId } = render(<TiltCard>Content</TiltCard>);

    const card = getByTestId('tilt-card');
    const motionProps = mockMotionDivRender.mock.calls[0]?.[0] as
      | { style?: Record<string, unknown> }
      | undefined;

    expect(motionProps?.style).toEqual(
      expect.objectContaining({ transformPerspective: 900, transformStyle: 'preserve-3d' })
    );
    expect(card.style.transformStyle).toBe('preserve-3d');
    expect(mockUseSpring).toHaveBeenCalledTimes(2);
    expect(mockUseSpring).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({ stiffness: 200, damping: 20 })
    );
    expect(mockUseSpring).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expect.objectContaining({ stiffness: 200, damping: 20 })
    );
  });

  it('handles mouse events without errors', () => {
    const { getByTestId } = render(<TiltCard>Content</TiltCard>);

    const card = getByTestId('tilt-card');

    expect(() => {
      fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
      fireEvent.mouseLeave(card);
    }).not.toThrow();
  });

  it('only applies will-change while actively hovered', () => {
    const { getByTestId } = render(<TiltCard>Content</TiltCard>);

    const card = getByTestId('tilt-card');

    expect(card.style.willChange).toBe('');

    fireEvent.mouseEnter(card);
    expect(card.style.willChange).toBe('transform');

    fireEvent.mouseLeave(card);
    expect(card.style.willChange).toBe('');
  });

  it('keeps will-change disabled when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { getByTestId } = render(<TiltCard>Content</TiltCard>);
    const card = getByTestId('tilt-card');

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 60, clientY: 60 });
    expect(card.style.willChange).toBe('');
  });

  it('accepts intensity prop without error', () => {
    expect(() => {
      const { getByTestId } = render(<TiltCard intensity={2}>Content</TiltCard>);

      fireEvent.mouseMove(getByTestId('tilt-card'), { clientX: 50, clientY: 50 });
    }).not.toThrow();
  });

  it('is no-op on mouse move when disabled', () => {
    expect(() => {
      const { getByTestId } = render(<TiltCard disabled>Content</TiltCard>);

      fireEvent.mouseMove(getByTestId('tilt-card'), { clientX: 50, clientY: 50 });
      fireEvent.mouseLeave(getByTestId('tilt-card'));
    }).not.toThrow();
  });
});
