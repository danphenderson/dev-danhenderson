import { fireEvent, render, screen } from '@testing-library/react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import ThemeProvider from '../../../src/ThemeProvider';
import { BackToTopButton } from '../../../src/components/BackToTopButton';

jest.mock('@mui/material/useScrollTrigger', () => jest.fn());

const mockUseScrollTrigger = useScrollTrigger as jest.MockedFunction<typeof useScrollTrigger>;

describe('BackToTopButton', () => {
  const scrollToMock = jest.fn();

  beforeEach(() => {
    mockUseScrollTrigger.mockReturnValue(false);
    scrollToMock.mockReset();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render before the shared header threshold has been crossed', () => {
    render(
      <ThemeProvider>
        <BackToTopButton />
      </ThemeProvider>
    );

    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
  });

  it('renders after the shared header threshold and scrolls smoothly by default', () => {
    mockUseScrollTrigger.mockReturnValue(true);

    render(
      <ThemeProvider>
        <BackToTopButton />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
