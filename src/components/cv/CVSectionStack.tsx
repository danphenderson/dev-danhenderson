import type { ReactNode } from 'react';
import { Stack } from '@mui/material';

type CVSectionStackProps = {
  children: ReactNode;
  spacing?: number;
};

export const CVSectionStack = ({ children, spacing = 2.5 }: CVSectionStackProps) => (
  <Stack spacing={spacing}>
    {children}
  </Stack>
);
