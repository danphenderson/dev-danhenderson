import Container from '@mui/material/Container';
import { useAppStyles } from '../styles/appStyles';
import { CommonLink } from './CommonLink';
import { BodyText } from './text';
import { MotionSection, fadeIn } from '../motion';

export default function Footer() {
  const appStyles = useAppStyles();

  return (
    <MotionSection variants={fadeIn} rootMargin="0px 0px 0px 0px">
      <Container maxWidth="xl">
        <BodyText align="center" sx={appStyles.footerTextSx}>
          {'Copyright © '}
          <CommonLink color="inherit" href="https://danhenderson.dev/">
            danhenderson.dev
          </CommonLink>{' '}
          {new Date().getFullYear()}.
        </BodyText>
      </Container>
    </MotionSection>
  );
}
