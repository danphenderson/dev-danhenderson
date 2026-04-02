import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { VscodeTitleBar } from '../../../../src/components/ide/VscodeTitleBar';

const renderTitleBar = (
  props: Partial<{
    onCommandPaletteToggle: () => void;
    onClose: () => void;
    onMinimize: () => void;
    onExpand: () => void;
    showAuxiliaryControls: boolean;
  }> = {}
) =>
  render(
    <ThemeProvider>
      <VscodeTitleBar {...props} />
    </ThemeProvider>
  );

describe('VscodeTitleBar', () => {
  it('renders the title bar with traffic dots', () => {
    renderTitleBar();
    expect(screen.getByTestId('vscode-title-bar')).toBeInTheDocument();
    expect(screen.getByLabelText('Close window')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument();
    expect(screen.getByLabelText('Expand window')).toBeInTheDocument();
  });

  it('shows hover tooltips for each traffic dot action', async () => {
    renderTitleBar();

    const actions = ['Close window', 'Minimize window', 'Expand window'] as const;

    for (const action of actions) {
      const dot = screen.getByLabelText(action);

      fireEvent.mouseOver(dot);
      expect(await screen.findByRole('tooltip')).toHaveTextContent(action);
      fireEvent.mouseLeave(dot);
      await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    }
  });

  it('renders the auxiliary controls by default', () => {
    renderTitleBar();
    expect(screen.getByTestId('vscode-title-bar-aux-controls')).toBeVisible();
    expect(screen.getByText('46')).toBeVisible();
  });

  it('hides the auxiliary controls when requested', () => {
    renderTitleBar({ showAuxiliaryControls: false });
    expect(screen.getByTestId('vscode-title-bar-aux-controls')).not.toBeVisible();
    expect(screen.queryByText('46')).not.toBeVisible();
  });

  describe('traffic dot onClick actions', () => {
    it('calls onClose when the red dot is clicked', () => {
      const onClose = jest.fn();
      renderTitleBar({ onClose });
      fireEvent.click(screen.getByLabelText('Close window'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onMinimize when the yellow dot is clicked', () => {
      const onMinimize = jest.fn();
      renderTitleBar({ onMinimize });
      fireEvent.click(screen.getByLabelText('Minimize window'));
      expect(onMinimize).toHaveBeenCalledTimes(1);
    });

    it('calls onExpand when the green dot is clicked', () => {
      const onExpand = jest.fn();
      renderTitleBar({ onExpand });
      fireEvent.click(screen.getByLabelText('Expand window'));
      expect(onExpand).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the red dot is activated with Enter', () => {
      const onClose = jest.fn();
      renderTitleBar({ onClose });
      const closeDot = screen.getByLabelText('Close window');

      closeDot.focus();
      fireEvent.keyDown(closeDot, { key: 'Enter' });

      expect(closeDot).toHaveFocus();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onMinimize when the yellow dot is activated with Space', () => {
      const onMinimize = jest.fn();
      renderTitleBar({ onMinimize });
      const minimizeDot = screen.getByLabelText('Minimize window');

      minimizeDot.focus();
      fireEvent.keyDown(minimizeDot, { key: ' ' });

      expect(onMinimize).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClose is undefined and red dot is clicked', () => {
      renderTitleBar();
      expect(() => fireEvent.click(screen.getByLabelText('Close window'))).not.toThrow();
    });

    it('does not throw when onMinimize is undefined and yellow dot is clicked', () => {
      renderTitleBar();
      expect(() => fireEvent.click(screen.getByLabelText('Minimize window'))).not.toThrow();
    });

    it('does not throw when onExpand is undefined and green dot is clicked', () => {
      renderTitleBar();
      expect(() => fireEvent.click(screen.getByLabelText('Expand window'))).not.toThrow();
    });
  });

  describe('command palette toggle', () => {
    it('calls onCommandPaletteToggle when search bar is clicked', () => {
      const onCommandPaletteToggle = jest.fn();
      renderTitleBar({ onCommandPaletteToggle });
      // The search bar contains "dev-danhenderson" text
      fireEvent.click(screen.getByText('dev-danhenderson'));
      expect(onCommandPaletteToggle).toHaveBeenCalledTimes(1);
    });
  });
});
