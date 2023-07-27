import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Footer() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://danhenderson.dev/">
        danhenderson.dev
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}