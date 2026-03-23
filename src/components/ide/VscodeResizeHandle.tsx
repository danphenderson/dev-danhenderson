import * as React from 'react';
import Box from '@mui/material/Box';
import type { IdeResizeEdge } from '../../types/ui';
import { VSCODE_RESIZE, VSCODE_WINDOW_RADIUS } from './vscodeTokens';

export interface VscodeResizeHandleProps {
  disabled?: boolean;
  onResizeStart?: (edge: IdeResizeEdge, event: React.PointerEvent<HTMLDivElement>) => void;
}

const commonSx = {
  position: 'absolute' as const,
  zIndex: 10,
  '&::after': {
    content: '""',
    position: 'absolute' as const,
    inset: 0,
    opacity: 0,
    transition: 'opacity 0.15s',
    backgroundColor: VSCODE_RESIZE.sashHoverColor,
  },
  '&:hover::after': {
    opacity: 1,
  },
};

export const VscodeResizeHandle: React.FC<VscodeResizeHandleProps> = ({
  disabled = false,
  onResizeStart,
}) => {
  if (disabled) return null;

  const handlePointerDown =
    (edge: IdeResizeEdge) => (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onResizeStart?.(edge, event);
    };

  return (
    <>
      {/* Right edge */}
      <Box
        data-testid="resize-handle-right"
        onPointerDown={handlePointerDown('right')}
        sx={{
          ...commonSx,
          top: 0,
          right: -VSCODE_RESIZE.handleSize,
          width: VSCODE_RESIZE.handleSize,
          height: '100%',
          cursor: 'col-resize',
          borderTopRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          borderBottomRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          '&::after': {
            ...commonSx['&::after'],
            borderTopRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
            borderBottomRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          },
        }}
      />

      {/* Bottom edge */}
      <Box
        data-testid="resize-handle-bottom"
        onPointerDown={handlePointerDown('bottom')}
        sx={{
          ...commonSx,
          bottom: -VSCODE_RESIZE.handleSize,
          left: 0,
          width: '100%',
          height: VSCODE_RESIZE.handleSize,
          cursor: 'row-resize',
          borderBottomLeftRadius: `${VSCODE_WINDOW_RADIUS}px`,
          borderBottomRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          '&::after': {
            ...commonSx['&::after'],
            borderBottomLeftRadius: `${VSCODE_WINDOW_RADIUS}px`,
            borderBottomRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          },
        }}
      />

      {/* Bottom-right corner */}
      <Box
        data-testid="resize-handle-corner"
        onPointerDown={handlePointerDown('corner')}
        sx={{
          ...commonSx,
          bottom: -VSCODE_RESIZE.handleSize,
          right: -VSCODE_RESIZE.handleSize,
          width: VSCODE_RESIZE.handleSize * 2,
          height: VSCODE_RESIZE.handleSize * 2,
          cursor: 'nwse-resize',
          borderBottomRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          '&::after': {
            ...commonSx['&::after'],
            borderBottomRightRadius: `${VSCODE_WINDOW_RADIUS}px`,
          },
        }}
      />
    </>
  );
};
