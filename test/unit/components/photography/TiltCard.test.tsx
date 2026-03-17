import { render, fireEvent } from '@testing-library/react';
import { TiltCard } from '../../../../src/components/photography/TiltCard';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, style, onMouseMove, onMouseLeave, className, ...rest }: any) => (
      <div
        data-testid="tilt-card"
        className={className}
        style={style}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    ),
  },
  useMotionValue: (initial: number) => ({ get: () => initial, set: jest.fn() }),
  useSpring: (source: any) => source,
}));

describe('TiltCard', () => {
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

  it('handles mouse events without errors', () => {
    const { getByTestId } = render(<TiltCard>Content</TiltCard>);

    const card = getByTestId('tilt-card');

    expect(() => {
      fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
      fireEvent.mouseLeave(card);
    }).not.toThrow();
  });
});
