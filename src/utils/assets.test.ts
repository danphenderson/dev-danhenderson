import { resolvePublicAssetPath } from './assets';

describe('resolvePublicAssetPath', () => {
  it('prepends PUBLIC_URL to relative paths', () => {
    expect(resolvePublicAssetPath('/assets/photo.jpg', '/my-app')).toBe('/my-app/assets/photo.jpg');
    expect(resolvePublicAssetPath('assets/photo.jpg', '/my-app')).toBe('/my-app/assets/photo.jpg');
  });

  it('returns absolute URLs unchanged', () => {
    expect(resolvePublicAssetPath('https://example.com/img.png', '/my-app')).toBe(
      'https://example.com/img.png'
    );
    expect(resolvePublicAssetPath('http://example.com/img.png', '/my-app')).toBe(
      'http://example.com/img.png'
    );
    expect(resolvePublicAssetPath('//cdn.example.com/img.png', '/my-app')).toBe(
      '//cdn.example.com/img.png'
    );
  });

  it('returns data/blob URLs unchanged', () => {
    expect(resolvePublicAssetPath('data:image/png;base64,abc', '/my-app')).toBe(
      'data:image/png;base64,abc'
    );
    expect(resolvePublicAssetPath('blob:http://localhost/uuid', '/my-app')).toBe(
      'blob:http://localhost/uuid'
    );
  });

  it('returns empty string for empty src', () => {
    expect(resolvePublicAssetPath('', '/my-app')).toBe('');
  });

  it('handles relative paths with ./ prefix', () => {
    expect(resolvePublicAssetPath('./assets/photo.jpg', '/my-app')).toBe(
      '/my-app/assets/photo.jpg'
    );
  });

  it('avoids double-prefixing when path already starts with base', () => {
    expect(resolvePublicAssetPath('/my-app/assets/photo.jpg', '/my-app')).toBe(
      '/my-app/assets/photo.jpg'
    );
  });
});
