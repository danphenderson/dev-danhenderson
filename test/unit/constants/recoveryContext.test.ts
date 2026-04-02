import { getRecoveryContext } from '../../../src/constants/recoveryContext';
import { siteRouteMap } from '../../../src/constants/siteRoutes';

describe('getRecoveryContext', () => {
  describe('attemptedPath / attemptedPathLabel normalization', () => {
    it('normalizes a path without a leading slash', () => {
      const ctx = getRecoveryContext('cv/about');
      expect(ctx.attemptedPath).toBe('/cv/about');
      expect(ctx.attemptedPathLabel).toBe('/cv/about');
    });

    it('handles an empty string path as root /', () => {
      const ctx = getRecoveryContext('');
      expect(ctx.attemptedPath).toBe('/');
      expect(ctx.attemptedPathLabel).toBe('/');
    });

    it('URL-decodes percent-encoded segments in the label', () => {
      const ctx = getRecoveryContext('/photography/grand%20canyon');
      expect(ctx.attemptedPathLabel).toBe('/photography/grand canyon');
    });

    it('handles malformed percent-encoding without throwing', () => {
      expect(() => getRecoveryContext('/photography/%E0%A4%A')).not.toThrow();
    });
  });

  describe('routeHint and suggestedPaletteQuery', () => {
    it('returns the cv route hint for a path under /cv', () => {
      const ctx = getRecoveryContext('/cv/unknown-section');
      expect(ctx.routeHint?.id).toBe('cv');
      expect(ctx.routeHintLabel).toContain(siteRouteMap.cv.label);
    });

    it('keeps short route-token prefix hints for near-miss route paths', () => {
      const ctx = getRecoveryContext('/cvv');

      expect(ctx.routeHint?.id).toBe('cv');
      expect(ctx.routeHintLabel).toContain(siteRouteMap.cv.label);
      expect(ctx.contextualSuggestions.length).toBeGreaterThan(0);
    });

    it('returns the climbing route hint for a path starting with /climbing', () => {
      const ctx = getRecoveryContext('/climbing/routes/yosemite');
      expect(ctx.routeHint?.id).toBe('climbing');
    });

    it('returns the photography route hint for a path under /photography', () => {
      const ctx = getRecoveryContext('/photography/landscape/zion');
      expect(ctx.routeHint?.id).toBe('photography');
      expect(ctx.suggestedPaletteQuery).toBe('landscape zion');
    });

    it('uses keyword matching to hint at the closest route match', () => {
      const ctx = getRecoveryContext('/resume-download');
      expect(ctx.routeHint?.id).toBe('cv');
      expect(ctx.suggestedPaletteQuery).toBe('resume download');
    });

    it('produces a non-empty query for a multi-segment path under a known route', () => {
      const ctx = getRecoveryContext('/cv/about-me');
      expect(ctx.suggestedPaletteQuery).toBe('about me');
    });

    it('returns empty string for the root path', () => {
      const ctx = getRecoveryContext('/');
      expect(ctx.suggestedPaletteQuery).toBe('');
    });

    it('returns no route hint for a completely unrelated path', () => {
      const ctx = getRecoveryContext('/unknown-xyz-abc');
      expect(ctx.routeHint).toBeNull();
      expect(ctx.routeHintLabel).toBeNull();
    });
  });

  describe('contextualSuggestions', () => {
    it('prioritizes the matching cv section for typo-like section paths', () => {
      const ctx = getRecoveryContext('/cv/abou');

      expect(ctx.suggestedPaletteQuery).toBe('abou');
      expect(ctx.contextualSuggestions[0]?.path).toBe(`${siteRouteMap.cv.path}#cv-about`);
      expect(ctx.contextualSuggestions[0]?.matchReason).toBe('Closest matching CV section.');
    });

    it('prefers the cv route action when the path only matches route keywords', () => {
      const ctx = getRecoveryContext('/resume-download');

      expect(ctx.contextualSuggestions[0]?.path).toBe(siteRouteMap.cv.path);
    });

    it('prioritizes matching photography albums over the base photography route', () => {
      const ctx = getRecoveryContext('/photography/landscape/zion');
      const paths = ctx.contextualSuggestions.map((suggestion) => suggestion.path);

      expect(paths[0]).toBe(`${siteRouteMap.photography.path}/landscape`);

      const photographyRouteIndex = paths.indexOf(siteRouteMap.photography.path);
      if (photographyRouteIndex !== -1) {
        expect(photographyRouteIndex).toBeGreaterThan(0);
      }
    });

    it('returns unique suggestions and limits the result set to three items', () => {
      const ctx = getRecoveryContext('/cv/experience-senior-engineer');
      const paths = ctx.contextualSuggestions.map((suggestion) => suggestion.path);

      expect(ctx.contextualSuggestions.length).toBeLessThanOrEqual(3);
      expect(new Set(paths).size).toBe(paths.length);
    });

    it('returns no contextual suggestions for unrelated paths', () => {
      const ctx = getRecoveryContext('/unknown-xyz-abc');

      expect(ctx.contextualSuggestions).toEqual([]);
    });
  });
});
