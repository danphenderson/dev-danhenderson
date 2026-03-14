import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { PageFrame } from '../../../../src/components/layout/PageFrame';

jest.mock('../../../../src/components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({
    children,
    image,
    showShell,
  }: {
    children: ReactNode;
    image: string;
    showShell?: boolean;
  }) => (
    <div
      data-testid="background-paper"
      data-image={image}
      data-show-shell={String(Boolean(showShell))}
    >
      {children}
    </div>
  ),
}));

describe('PageFrame', () => {
  it('wraps children in a BackgroundPaper with showShell=false', () => {
    render(
      <ThemeProvider>
        <PageFrame image="assets/test.jpg">
          <span>Page content</span>
        </PageFrame>
      </ThemeProvider>
    );

    const bg = screen.getByTestId('background-paper');
    expect(bg).toHaveAttribute('data-image', 'assets/test.jpg');
    expect(bg).toHaveAttribute('data-show-shell', 'false');
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });
});
