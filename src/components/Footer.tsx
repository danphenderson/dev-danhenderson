import { useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import { useAppStyles } from '../styles/appStyles';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { CommonLink } from './CommonLink';
import { BodyText } from './text';

export default function Footer() {
  const appStyles = useAppStyles();
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <Container
      maxWidth="xl"
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(12px)',
        transition: prefersReducedMotion
          ? 'none'
          : `opacity 0.5s ${SPRING_EASING_CSS}, transform 0.5s ${SPRING_EASING_CSS}`,
      }}
    >
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
