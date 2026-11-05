import { render } from '@testing-library/react';
import { useReducedMotion } from 'motion/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVStoryProgress } from '../../../../src/components/cv/CVStoryProgress';
import { PREFERENCE_STORAGE_KEYS } from '../../../../src/theme/preferences';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ style, animate, transition, ...rest }: any) => (
      <div
        data-testid="progress-bar"
        data-scale-x={animate?.scaleX}
        data-duration={transition?.duration}
        style={style}
        {...rest}
      />
    ),
  },
  useReducedMotion: jest.fn(() => false),
  useTheme: jest.fn(),
}));

describe('CVStoryProgress', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.mocked(useReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it.each([
    ['off', false],
    ['default', true],
  ])('updates instantly with %s motion and reduced motion %s', (intensity, reduced) => {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, intensity);
    jest.mocked(useReducedMotion).mockReturnValue(reduced);
    const { getByTestId, rerender } = render(
      <ThemeProvider>
        <CVStoryProgress progress={0.25} />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider>
        <CVStoryProgress progress={0.75} />
      </ThemeProvider>
    );

    expect(getByTestId('progress-bar')).toHaveAttribute('data-duration', '0');
    expect(getByTestId('progress-bar')).toHaveAttribute('data-scale-x', '0.75');
  });

  it('retains the normal transition when motion is enabled', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CVStoryProgress progress={0.5} />
      </ThemeProvider>
    );

    expect(getByTestId('progress-bar')).toHaveAttribute('data-duration', '0.35');
  });

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
