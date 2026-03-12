import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { createAppStyleMap } from './appStyleBuilders';

export const useAppStyles = () => {
  const theme = useTheme();

  return useMemo(() => createAppStyleMap(theme), [theme]);
};
