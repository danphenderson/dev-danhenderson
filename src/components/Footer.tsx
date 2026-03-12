import * as React from 'react';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useAppStyles } from '../styles/appStyles';
import { BodyText } from './text';

export default function Footer() {
  const appStyles = useAppStyles();

  return (
    <Container maxWidth="xl">
      <BodyText align="center" sx={appStyles.footerTextSx}>
        {'Copyright © '}
        <Link color="inherit" href="https://danhenderson.dev/">
          danhenderson.dev
        </Link>{' '}
        {new Date().getFullYear()}.
      </BodyText>
    </Container>
  );
}
