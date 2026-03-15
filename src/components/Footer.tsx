import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useAppStyles } from '../styles/appStyles';
import { CommonLink } from './CommonLink';
import { PerformanceScorecard } from './PerformanceScorecard';
import { BodyText } from './text';
import { MotionSection, fadeIn } from '../motion';

export default function Footer() {
  const appStyles = useAppStyles();

  return (
    <MotionSection variants={fadeIn} rootMargin="0px 0px 0px 0px">
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          <BodyText align="center" sx={appStyles.footerTextSx}>
            {'Copyright © '}
            <CommonLink color="inherit" href="https://danhenderson.dev/">
              danhenderson.dev
            </CommonLink>{' '}
            {new Date().getFullYear()}.
          </BodyText>
          <PerformanceScorecard />
        </Box>
      </Container>
    </MotionSection>
  );
}
