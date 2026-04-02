import { fireEvent, render, screen, act } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogCodeBlock } from '../../../../src/components/blog/BlogCodeBlock';

describe('BlogCodeBlock', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the code content and language badge', () => {
    render(
      <ThemeProvider>
        <BlogCodeBlock language="typescript" code="const x = 1;" />
      </ThemeProvider>
    );

    expect(screen.getByText('const x = 1;')).toHaveTextContent('const x = 1;');
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('renders Python syntax token spans for highlighted code', () => {
    const { container } = render(
      <ThemeProvider>
        <BlogCodeBlock
          language="python"
          code={'from typing import Optional\n\ndef f(x: Optional[T] = None):\n    return x'}
        />
      </ThemeProvider>
    );

    const codeElement = container.querySelector('code');

    expect(codeElement?.textContent).toBe(
      'from typing import Optional\n\ndef f(x: Optional[T] = None):\n    return x'
    );
    expect(container.querySelector('[data-token-kind="keyword"]')?.textContent).toBe('from');
    expect(container.querySelector('[data-token-kind="type"]')?.textContent).toBe('Optional');
    expect(container.querySelector('[data-token-kind="function"]')?.textContent).toBe('f');
    expect(container.querySelector('[data-token-kind="constant"]')?.textContent).toBe('None');
  });

  it('renders the filename when provided', () => {
    render(
      <ThemeProvider>
        <BlogCodeBlock language="tsx" code="<App />" filename="App.tsx" />
      </ThemeProvider>
    );

    expect(screen.getByText('App.tsx')).toBeInTheDocument();
  });

  it('renders the caption when provided', () => {
    render(
      <ThemeProvider>
        <BlogCodeBlock language="ts" code="export {}" caption="Module entry point." />
      </ThemeProvider>
    );

    expect(screen.getByText('Module entry point.')).toBeInTheDocument();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <ThemeProvider>
        <BlogCodeBlock language="typescript" code="const x = 42;" />
      </ThemeProvider>
    );

    const copyButton = screen.getByRole('button', { name: 'Copy code to clipboard' });

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(writeText).toHaveBeenCalledWith('const x = 42;');
  });
});
