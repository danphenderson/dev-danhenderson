import { certificates, resumePdfUrl } from '../../src/data/cv';
import { photographyCategories } from '../../src/data/photography';

const { assertSignature, assertResponse, collectAssetPaths }: {
  assertSignature: (body: Buffer, asset: string) => void;
  assertResponse: (response: unknown, body: Buffer, asset: string) => void;
  collectAssetPaths: () => Promise<string[]>;
} = require('../../scripts/checkAssets');

describe('asset delivery gate', () => {
  it('includes every CV document and photography original without a duplicate inventory', async () => {
    const paths = await collectAssetPaths();
    expect(paths).toEqual(expect.arrayContaining([
      resumePdfUrl,
      ...certificates.map((certificate) => certificate.link),
      ...photographyCategories.flatMap((category) => [
        category.src,
        ...category.album.map((photo) => photo.img),
      ]),
    ]));
    expect(paths.some((asset) => asset.endsWith('.webp'))).toBe(true);
  });

  it.each(['.pdf', '.jpg', '.png', '.webp'])('rejects HTML and pointer files labeled %s', (extension) => {
    for (const body of ['<!doctype html>', 'version https://git-lfs.github.com/spec/v1']) {
      expect(() => assertSignature(Buffer.from(body), `asset${extension}`)).toThrow('invalid');
    }
  });

  it('rejects 404s, wrong MIME, and HTML with a forged PDF MIME', () => {
    const response = (status: number, type: string) => ({
      status,
      headers: { get: () => type },
    });
    const pdf = Buffer.from('%PDF-1.7');
    expect(() => assertResponse(response(404, 'application/pdf'), pdf, 'resume.pdf')).toThrow('HTTP 404');
    expect(() => assertResponse(response(200, 'text/html'), pdf, 'resume.pdf')).toThrow('wrong Content-Type');
    expect(() => assertResponse(response(200, 'application/pdf'), Buffer.from('<html>'), 'resume.pdf')).toThrow('invalid');
    expect(() => assertResponse(response(200, 'application/pdf'), pdf, 'resume.pdf')).not.toThrow();
  });
});
