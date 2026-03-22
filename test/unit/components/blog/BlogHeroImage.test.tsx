import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogHeroImage } from '../../../../src/components/blog/BlogHeroImage';

describe('BlogHeroImage', () => {
  const originalPublicUrl = process.env.PUBLIC_URL;

  afterEach(() => {
    process.env.PUBLIC_URL = originalPublicUrl;
  });

  it('resolves local blog hero image paths through PUBLIC_URL while preserving accessibility and loading props', () => {
    process.env.PUBLIC_URL = '/portfolio';

    render(
      <ThemeProvider>
        <BlogHeroImage
          src="/assets/blog/hero.jpg"
          alt="Shared blog hero"
          height={{ xs: 200, sm: 280, md: 360 }}
          overlayOpacity={0.93}
          overlayFadeStop="60%"
          borderRadius={3}
          loading="lazy"
        />
      </ThemeProvider>
    );

    const image = screen.getByRole('img', { name: 'Shared blog hero' });

    expect(image).toHaveAttribute('src', '/portfolio/assets/blog/hero.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});
