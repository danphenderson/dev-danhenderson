import { useMemo } from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { createTextStyleMap } from './textStyleBuilders';

export const useTextStyles = () => {
  const theme = useMuiTheme();

  return useMemo(() => createTextStyleMap(theme), [theme]);
};
