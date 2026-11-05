import { render, fireEvent } from '@testing-library/react';
import { TiltCard } from '../../../../src/components/photography/TiltCard';

const mockUseSpring = jest.fn((source: unknown, _config?: unknown) => source);
const mockUseReducedMotion = jest.fn().mockReturnValue(false);
let capturedMotionDivStyle: Record<string, unknown> | undefined;

jest.mock('../../../../src/motion/hooks', () => ({
  useMotionScale: () => ({ duration: 1, stagger: 1, tilt: mockUseReducedMotion() ? 0 : 1 }),
}));

jest.mock('motion/react', () => ({
  motion: {
    div: require('react').forwardRef(({ children, style, className, ...rest }: any, ref: any) => {
      capturedMotionDivStyle = style;
      return (
        <div ref={ref} data-testid="tilt-card" className={className} style={style} {...rest}>
          {children}
        </div>
      );
    }),
  },
  useMotionValue: (initial: number) => ({ get: () => initial, set: jest.fn(), jump: jest.fn() }),
  useSpring: (source: unknown, config: unknown) => mockUseSpring(source, config),
  useReducedMotion: () => mockUseReducedMotion(),
}));

const mousePointer = (element: HTMLElement, type: string, init: MouseEventInit = {}) => {
  const event = new MouseEvent(type, { bubbles: true, ...init });
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  fireEvent(element, event);
};

describe('TiltCard', () => {
  afterEach(() => {
    capturedMotionDivStyle = undefined;
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

    expect(capturedMotionDivStyle).toMatchObject({
      transformPerspective: 900,
      transformStyle: 'preserve-3d',
    });
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
      mousePointer(card, 'pointermove', { clientX: 100, clientY: 100 });
      mousePointer(card, 'pointerout');
    }).not.toThrow();
  });

  it('only applies will-change while actively hovered', () => {
    const { getByTestId } = render(<TiltCard>Content</TiltCard>);

    const card = getByTestId('tilt-card');

    expect(card.style.willChange).toBe('');

    mousePointer(card, 'pointerover');
    expect(card.style.willChange).toBe('transform');

    mousePointer(card, 'pointerout');
    expect(card.style.willChange).toBe('');
  });

  it('keeps will-change disabled when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { getByTestId } = render(<TiltCard>Content</TiltCard>);
    const card = getByTestId('tilt-card');

    mousePointer(card, 'pointerover');
    mousePointer(card, 'pointermove', { clientX: 60, clientY: 60 });
    expect(card.style.willChange).toBe('');
  });

  it('accepts intensity prop without error', () => {
    expect(() => {
      const { getByTestId } = render(<TiltCard intensity={2}>Content</TiltCard>);

      mousePointer(getByTestId('tilt-card'), 'pointermove', { clientX: 50, clientY: 50 });
    }).not.toThrow();
  });

  it('is no-op on mouse move when disabled', () => {
    expect(() => {
      const { getByTestId } = render(<TiltCard disabled>Content</TiltCard>);

      mousePointer(getByTestId('tilt-card'), 'pointermove', { clientX: 50, clientY: 50 });
      mousePointer(getByTestId('tilt-card'), 'pointerout');
    }).not.toThrow();
  });
});
