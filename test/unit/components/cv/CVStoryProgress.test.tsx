import { render } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVStoryProgress } from '../../../../src/components/cv/CVStoryProgress';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ style, animate, transition, ...rest }: any) => (
      <div data-testid="progress-bar" data-scale-x={animate?.scaleX} style={style} {...rest} />
    ),
  },
  useReducedMotion: () => false,
  useTheme: jest.fn(),
}));

describe('CVStoryProgress', () => {
  it('renders a progress bar that reflects the progress prop', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CVStoryProgress progress={0.5} />
      </ThemeProvider>
    );

    expect(getByTestId('progress-bar')).toHaveAttribute('data-scale-x', '0.5');
  });

  it('renders at zero progress', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CVStoryProgress progress={0} />
      </ThemeProvider>
    );

    expect(getByTestId('progress-bar')).toHaveAttribute('data-scale-x', '0');
  });

  it('renders at full progress', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CVStoryProgress progress={1} />
      </ThemeProvider>
    );

    expect(getByTestId('progress-bar')).toHaveAttribute('data-scale-x', '1');
  });
});
