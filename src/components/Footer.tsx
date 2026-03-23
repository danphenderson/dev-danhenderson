import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { CommonLink } from './CommonLink';
import { PerformanceScorecard } from './PerformanceScorecard';
import { Text } from './text';
import { MotionSection, fadeIn } from '../motion';

export default function Footer() {
  return (
    <MotionSection id="site-footer" variants={fadeIn} rootMargin="0px 0px 0px 0px">
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          <Text role="bodyMuted" align="center">
            {'Copyright © '}
            <CommonLink color="inherit" href="https://danhenderson.dev/">
              danhenderson.dev
            </CommonLink>{' '}
            {new Date().getFullYear()}.
          </Text>
          <PerformanceScorecard />
        </Box>
      </Container>
    </MotionSection>
  );
}
