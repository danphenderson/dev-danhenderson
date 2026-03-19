import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { VscodeResizeHandle } from '../../../../src/components/ide/VscodeResizeHandle';

const renderHandle = (
  props: Partial<{
    disabled: boolean;
    onResizeStart: (
      edge: 'right' | 'bottom' | 'corner',
      event: React.PointerEvent<HTMLDivElement>
    ) => void;
  }> = {}
) =>
  render(
    <ThemeProvider>
      <div style={{ position: 'relative', width: '400px', height: '300px' }}>
        <VscodeResizeHandle disabled={props.disabled} onResizeStart={props.onResizeStart} />
      </div>
    </ThemeProvider>
  );

describe('VscodeResizeHandle', () => {
  it('renders nothing when disabled', () => {
    renderHandle({ disabled: true });

    expect(screen.queryByTestId('resize-handle-right')).not.toBeInTheDocument();
    expect(screen.queryByTestId('resize-handle-bottom')).not.toBeInTheDocument();
    expect(screen.queryByTestId('resize-handle-corner')).not.toBeInTheDocument();
  });

  it('renders all resize handles when enabled', () => {
    renderHandle();

    expect(screen.getByTestId('resize-handle-right')).toBeInTheDocument();
    expect(screen.getByTestId('resize-handle-bottom')).toBeInTheDocument();
    expect(screen.getByTestId('resize-handle-corner')).toBeInTheDocument();
  });

  it('forwards the right-edge callback', () => {
    const onResizeStart = jest.fn();
    renderHandle({ onResizeStart });

    fireEvent.pointerDown(screen.getByTestId('resize-handle-right'), { button: 0 });

    expect(onResizeStart).toHaveBeenCalledWith('right', expect.anything());
  });

  it('forwards the bottom-edge callback', () => {
    const onResizeStart = jest.fn();
    renderHandle({ onResizeStart });

    fireEvent.pointerDown(screen.getByTestId('resize-handle-bottom'), { button: 0 });

    expect(onResizeStart).toHaveBeenCalledWith('bottom', expect.anything());
  });

  it('forwards the corner callback', () => {
    const onResizeStart = jest.fn();
    renderHandle({ onResizeStart });

    fireEvent.pointerDown(screen.getByTestId('resize-handle-corner'), { button: 0 });

    expect(onResizeStart).toHaveBeenCalledWith('corner', expect.anything());
  });
});
