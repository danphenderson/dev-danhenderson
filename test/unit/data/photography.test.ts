import { photographyCategories, fallbackBackgroundImage } from '../../../src/data/photography';

describe('photography.ts schema', () => {
  it('exports a non-empty photographyCategories array', () => {
    expect(Array.isArray(photographyCategories)).toBe(true);
    expect(photographyCategories.length).toBeGreaterThan(0);
  });

  it('fallbackBackgroundImage is a non-empty string', () => {
    expect(typeof fallbackBackgroundImage).toBe('string');
    expect(fallbackBackgroundImage.length).toBeGreaterThan(0);
  });

  it('every category has required fields', () => {
    for (const cat of photographyCategories) {
      expect(typeof cat.slug).toBe('string');
      expect(cat.slug.length).toBeGreaterThan(0);
      expect(typeof cat.name).toBe('string');
      expect(cat.name.length).toBeGreaterThan(0);
      expect(typeof cat.description).toBe('string');
      expect(typeof cat.src).toBe('string');
      expect(cat.src.length).toBeGreaterThan(0);
      expect(Array.isArray(cat.album)).toBe(true);
      expect(cat.album.length).toBeGreaterThan(0);
    }
  });

  it('all category slugs are unique', () => {
    const slugs = photographyCategories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every album photo has required img and title fields', () => {
    for (const cat of photographyCategories) {
      for (const photo of cat.album) {
        expect(typeof photo.img).toBe('string');
        expect(photo.img.length).toBeGreaterThan(0);
        expect(typeof photo.title).toBe('string');
        expect(photo.title.length).toBeGreaterThan(0);
      }
    }
  });

  it('coordinates, when present, have valid lat/lng values', () => {
    for (const cat of photographyCategories) {
      if (cat.coordinates) {
        expect(typeof cat.coordinates.lat).toBe('number');
        expect(typeof cat.coordinates.lng).toBe('number');
        expect(cat.coordinates.lat).toBeGreaterThanOrEqual(-90);
        expect(cat.coordinates.lat).toBeLessThanOrEqual(90);
        expect(cat.coordinates.lng).toBeGreaterThanOrEqual(-180);
        expect(cat.coordinates.lng).toBeLessThanOrEqual(180);
      }
      for (const photo of cat.album) {
        if (photo.coordinates) {
          expect(typeof photo.coordinates.lat).toBe('number');
          expect(typeof photo.coordinates.lng).toBe('number');
          expect(photo.coordinates.lat).toBeGreaterThanOrEqual(-90);
          expect(photo.coordinates.lat).toBeLessThanOrEqual(90);
          expect(photo.coordinates.lng).toBeGreaterThanOrEqual(-180);
          expect(photo.coordinates.lng).toBeLessThanOrEqual(180);
        }
      }
    }
  });

  it('at least one category is featured', () => {
    const featured = photographyCategories.filter((c) => c.featured);
    expect(featured.length).toBeGreaterThanOrEqual(1);
  });
});
