import { useMemo } from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { createComponentStyleMap } from './componentStyleBuilders';

export const useComponentStyles = () => {
  const theme = useMuiTheme();

  return useMemo(() => createComponentStyleMap(theme), [theme]);
};
