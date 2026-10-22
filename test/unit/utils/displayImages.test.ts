import { getDisplayImage } from '../../../src/utils/displayImages';
import { resolvePublicAssetPath } from '../../../src/utils/assets';

const original = '/assets/photography/landscape/landscape-tieton-south-fork-1.jpg';

describe('display images', () => {
  it('uses real width-descriptor files, leaving the original download path intact', () => {
    const image = getDisplayImage(original);
    expect(image.src).toMatch(/^\/assets\/display\/.*\.webp$/);
    expect(image.srcSet).toMatch(/480w, .*960w/);
    expect(image.srcSet).not.toContain('?');
    expect(image.width).toBeGreaterThanOrEqual(960);
    expect(resolvePublicAssetPath(original)).toBe(original);
  });

  it.each(['/portfolio', 'https://example.com/portfolio'])(
    'handles already-prefixed inputs under %s',
    (base) => {
      const image = getDisplayImage(`${base}${original}`, 1600, base);
      expect(image.src).toMatch(new RegExp(`^${base}/assets/display/`));
      expect(
        image.srcSet?.split(', ').every((part) => part.startsWith(`${base}/assets/display/`))
      ).toBe(true);
      expect(image.src).not.toContain('/portfolio/portfolio');
    }
  );

  it('passes through unknown, remote, and inline images', () => {
    expect(getDisplayImage('/new.jpg', 960, '/portfolio')).toEqual({ src: '/portfolio/new.jpg' });
    expect(getDisplayImage('https://example.org/photo.jpg')).toEqual({
      src: 'https://example.org/photo.jpg',
    });
    expect(getDisplayImage('data:image/png;base64,123')).toEqual({
      src: 'data:image/png;base64,123',
    });
  });
});
