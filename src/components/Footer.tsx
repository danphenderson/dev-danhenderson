import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useAppStyles } from '../styles/appStyles';

export default function Footer() {
  const appStyles = useAppStyles();

  return (
    <Container maxWidth="xl">
      <Typography variant="body2" align="center" sx={appStyles.footerTextSx}>
        {'Copyright © '}
        <Link color="inherit" href="https://danhenderson.dev/">
          danhenderson.dev
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Container>
  );
}
