import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

export default function Footer() {
  return (
    <Container maxWidth="xl">
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://danhenderson.dev/">
        danhenderson.dev
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
    </Container>
  );
}