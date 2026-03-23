import { render, screen } from '@testing-library/react';
import { AppErrorBoundary } from '../../../src/components/AppErrorBoundary';

const ThrowRenderError = () => {
  throw new Error('render failed');
};

describe('AppErrorBoundary', () => {
  const originalPublicUrl = process.env.PUBLIC_URL;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.env.PUBLIC_URL = originalPublicUrl;
  });

  it('renders children when no descendant error occurs', () => {
    render(
      <AppErrorBoundary>
        <div>Healthy child</div>
      </AppErrorBoundary>
    );

    expect(screen.getByText('Healthy child')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Something went wrong' })).not.toBeInTheDocument();
  });

  it('shows recovery UI and logs descendant render failures', () => {
    render(
      <AppErrorBoundary>
        <ThrowRenderError />
      </AppErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeVisible();
    expect(
      screen.getByText('An unexpected error occurred. Please try reloading the page.')
    ).toBeVisible();

    const boundaryLogCall = consoleErrorSpy.mock.calls.find(
      ([message]) => message === 'Uncaught render error:'
    );

    expect(boundaryLogCall).toBeDefined();
    expect(boundaryLogCall?.[1]).toBeInstanceOf(Error);
    expect((boundaryLogCall?.[1] as Error).message).toBe('render failed');
    expect(boundaryLogCall?.[2]).toEqual(
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it('uses a PUBLIC_URL-aware home link for recovery', () => {
    process.env.PUBLIC_URL = '/portfolio';

    render(
      <AppErrorBoundary>
        <ThrowRenderError />
      </AppErrorBoundary>
    );

    expect(screen.getByRole('link', { name: 'Return Home' })).toHaveAttribute(
      'href',
      '/portfolio/'
    );
  });
});
