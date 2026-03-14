import * as React from 'react';
import Container from '@mui/material/Container';
import { useAppStyles } from '../styles/appStyles';
import { CommonLink } from './CommonLink';
import { BodyText } from './text';

export default function Footer() {
  const appStyles = useAppStyles();

  return (
    <Container maxWidth="xl">
      <BodyText align="center" sx={appStyles.footerTextSx}>
        {'Copyright © '}
        <CommonLink color="inherit" href="https://danhenderson.dev/">
          danhenderson.dev
        </CommonLink>{' '}
        {new Date().getFullYear()}.
      </BodyText>
    </Container>
  );
}
