import { useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useAppStyles } from '../styles/appStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { CommonLink } from './CommonLink';
import { PerformanceScorecard } from './PerformanceScorecard';
import { BodyText } from './text';

export default function Footer() {
  const appStyles = useAppStyles();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          return;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Container
      maxWidth="xl"
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(12px)',
        transition: `opacity 0.5s ${SPRING_EASING_CSS}, transform 0.5s ${SPRING_EASING_CSS}`,
      }}
    >
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
  );
}
