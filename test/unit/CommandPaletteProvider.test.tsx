import { render, screen, act } from '@testing-library/react';
import { CommandPaletteProvider, useCommandPalette } from '../../src/CommandPaletteProvider';

const TestConsumer = () => {
  const { isOpen, query, openPalette, closePalette, setQuery } = useCommandPalette();

  return (
    <div>
      <span data-testid="is-open">{String(isOpen)}</span>
      <span data-testid="query">{query}</span>
      <button onClick={() => openPalette()}>Open</button>
      <button onClick={() => openPalette('search term')}>Open with query</button>
      <button onClick={() => closePalette()}>Close</button>
      <button onClick={() => setQuery('updated')}>Set query</button>
    </div>
  );
};

describe('CommandPaletteProvider', () => {
  it('defaults to closed with empty query', () => {
    render(
      <CommandPaletteProvider>
        <TestConsumer />
      </CommandPaletteProvider>
    );

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('query')).toHaveTextContent('');
  });

  it('opens the palette', () => {
    render(
      <CommandPaletteProvider>
        <TestConsumer />
      </CommandPaletteProvider>
    );

    act(() => {
      screen.getByText('Open').click();
    });

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
  });

  it('opens the palette with an initial query', () => {
    render(
      <CommandPaletteProvider>
        <TestConsumer />
      </CommandPaletteProvider>
    );

    act(() => {
      screen.getByText('Open with query').click();
    });

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    expect(screen.getByTestId('query')).toHaveTextContent('search term');
  });

  it('closes the palette and resets the query', () => {
    render(
      <CommandPaletteProvider>
        <TestConsumer />
      </CommandPaletteProvider>
    );

    act(() => {
      screen.getByText('Open with query').click();
    });

    act(() => {
      screen.getByText('Close').click();
    });

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('query')).toHaveTextContent('');
  });

  it('updates the query independently', () => {
    render(
      <CommandPaletteProvider>
        <TestConsumer />
      </CommandPaletteProvider>
    );

    act(() => {
      screen.getByText('Set query').click();
    });

    expect(screen.getByTestId('query')).toHaveTextContent('updated');
  });
});
