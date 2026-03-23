import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVStoryHeader } from '../../../../src/components/cv/CVStoryHeader';

const renderStoryHeader = (overrides?: Partial<Parameters<typeof CVStoryHeader>[0]>) => {
  const onToggleMode = jest.fn();

  render(
    <ThemeProvider>
      <CVStoryHeader mode="default" onToggleMode={onToggleMode} variant="embedded" {...overrides} />
    </ThemeProvider>
  );

  return { onToggleMode };
};

describe('CVStoryHeader', () => {
  it('renders the embedded variant as a single row with trailing actions', () => {
    renderStoryHeader();

    const header = screen.getByTestId('cv-story-header');

    expect(header).toHaveStyle({ justifyContent: 'flex-end', width: '100%' });
    expect(screen.getByText('Full CV')).toBeInTheDocument();
    expect(screen.getByTestId('cv-mode-toggle')).toHaveTextContent('Read my story');
    expect(screen.queryByText(/software engineer building/i)).not.toBeInTheDocument();
  });

  it('keeps the toggle interactive in the embedded variant', () => {
    const { onToggleMode } = renderStoryHeader();

    fireEvent.click(screen.getByTestId('cv-mode-toggle'));

    expect(onToggleMode).toHaveBeenCalledTimes(1);
  });
});
