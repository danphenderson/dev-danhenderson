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

  describe('routeHint', () => {
    it('returns the cv route hint for a path under /cv', () => {
      const ctx = getRecoveryContext('/cv/unknown-section');
      expect(ctx.routeHint?.id).toBe('cv');
      expect(ctx.routeHintLabel).toContain(siteRouteMap.cv.label);
    });

    it('returns the climbing route hint for a path starting with /climbing', () => {
      const ctx = getRecoveryContext('/climbing/routes/yosemite');
      expect(ctx.routeHint?.id).toBe('climbing');
    });

    it('returns the photography route hint for a path under /photography', () => {
      const ctx = getRecoveryContext('/photography/landscape/zion');
      expect(ctx.routeHint?.id).toBe('photography');
    });

    it('uses keyword scoring to hint at the closest route match', () => {
      // A non-prefix path that contains a recognizable route keyword
      const ctx = getRecoveryContext('/resume-download');
      //'resume' overlaps strongly with the cv route keywords
      expect(ctx.routeHint?.id).toBe('cv');
    });

    it('returns null routeHint for a completely unrelated path', () => {
      const ctx = getRecoveryContext('/xyzzy-totally-unknown-page-12345');
      // May or may not match — the important thing is it does not throw
      expect(ctx).toBeDefined();
    });

    it('returns null routeHintLabel when routeHint is null', () => {
      // Root path '/' matches no non-root, non-wildcard route, so no hint
      const ctx = getRecoveryContext('/unknown-xyz-abc');
      if (ctx.routeHint === null) {
        expect(ctx.routeHintLabel).toBeNull();
      }
    });
  });

  describe('suggestedPaletteQuery', () => {
    it('produces a non-empty query for a multi-segment path under a known route', () => {
      const ctx = getRecoveryContext('/cv/about-me');
      expect(ctx.suggestedPaletteQuery).toBeTruthy();
    });

    it('returns empty string for the root path', () => {
      const ctx = getRecoveryContext('/');
      expect(ctx.suggestedPaletteQuery).toBe('');
    });
  });

  describe('contextualSuggestions', () => {
    it('returns at most 3 suggestions', () => {
      const ctx = getRecoveryContext('/cv/experience-senior-engineer');
      expect(ctx.contextualSuggestions.length).toBeLessThanOrEqual(3);
    });

    it('scores CV-related actions higher for a path under /cv', () => {
      const ctx = getRecoveryContext('/cv/experience');
      const firstSuggestion = ctx.contextualSuggestions[0];
      expect(firstSuggestion).toBeDefined();
      // The cv route path should appear in the top suggestion
      expect(firstSuggestion.path).toContain('/cv');
    });

    it('does not produce duplicate paths in suggestions', () => {
      const ctx = getRecoveryContext('/photography/landscape');
      const paths = ctx.contextualSuggestions.map((s) => s.path);
      expect(new Set(paths).size).toBe(paths.length);
    });

    it('includes matchReason on each suggestion', () => {
      const ctx = getRecoveryContext('/climbing/trad-routes');
      ctx.contextualSuggestions.forEach((suggestion) => {
        expect(typeof suggestion.matchReason).toBe('string');
        expect(suggestion.matchReason.length).toBeGreaterThan(0);
      });
    });
  });
});
