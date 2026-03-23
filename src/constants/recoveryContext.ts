import { commandPaletteActions, type CommandPaletteAction } from './commandPaletteActions';
import { recoveryRouteActions } from './routeActions';
import { siteRoutes, type SiteRouteDefinition } from './siteRoutes';

export type RecoverySuggestion = CommandPaletteAction & {
  matchReason: string;
  score: number;
};

export type RecoveryContext = {
  attemptedPath: string;
  attemptedPathLabel: string;
  routeHint: SiteRouteDefinition | null;
  routeHintLabel: string | null;
  suggestedPaletteQuery: string;
  contextualSuggestions: RecoverySuggestion[];
};

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeValue = (value: string): string =>
  safeDecode(value)
    .toLowerCase()
    .replaceAll('/', ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9#\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenizeValue = (value: string): string[] =>
  normalizeValue(value).replaceAll('#', ' ').split(/\s+/).filter(Boolean);

const normalizePathname = (pathname: string): string => {
  const trimmed = pathname.trim();
  if (!trimmed) {
    return '/';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const formatAttemptedPathLabel = (pathname: string): string => {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  return `/${segments.map((segment) => safeDecode(segment)).join('/')}`;
};

const scoreTokenMatch = (token: string, candidate: string): number => {
  if (candidate === token) {
    return 18;
  }

  if (candidate.startsWith(token) || token.startsWith(candidate)) {
    return 12;
  }

  if (candidate.includes(token) || token.includes(candidate)) {
    return 6;
  }

  return 0;
};

const scoreTokenSet = (tokens: string[], candidates: string[]): number =>
  tokens.reduce(
    (total, token) =>
      total +
      candidates.reduce((best, candidate) => Math.max(best, scoreTokenMatch(token, candidate)), 0),
    0
  );

const getDirectRouteHint = (pathname: string): SiteRouteDefinition | null => {
  const directMatches = siteRoutes
    .filter((route) => route.path !== '*' && route.path !== '/')
    .filter((route) => pathname === route.path || pathname.startsWith(`${route.path}/`))
    .sort((left, right) => right.path.length - left.path.length);

  return directMatches[0] ?? null;
};

const getClosestRouteHint = (pathname: string): SiteRouteDefinition | null => {
  const directRouteHint = getDirectRouteHint(pathname);
  if (directRouteHint) {
    return directRouteHint;
  }

  const pathnameTokens = tokenizeValue(pathname);
  if (pathnameTokens.length === 0) {
    return null;
  }

  const firstToken = pathnameTokens[0];
  const rankedRoutes = siteRoutes
    .filter((route) => route.path !== '*' && route.path !== '/')
    .map((route) => {
      const routeTokens = tokenizeValue(`${route.label} ${route.path} ${route.keywords.join(' ')}`);
      const firstTokenScore = routeTokens.reduce(
        (best, candidate) => Math.max(best, scoreTokenMatch(firstToken, candidate)),
        0
      );
      const totalScore = scoreTokenSet(pathnameTokens, routeTokens) + firstTokenScore * 2;

      return {
        route,
        totalScore,
      };
    })
    .filter((candidate) => candidate.totalScore > 0)
    .sort((left, right) => right.totalScore - left.totalScore);

  return rankedRoutes[0]?.route ?? null;
};

const getPaletteQuery = (pathname: string, routeHint: SiteRouteDefinition | null): string => {
  const pathnameTokens = tokenizeValue(pathname);
  if (pathnameTokens.length === 0) {
    return '';
  }

  if (routeHint && routeHint.path !== '/') {
    const routeTokens = tokenizeValue(routeHint.path);
    const remainingTokens = pathnameTokens.slice(routeTokens.length);

    if (remainingTokens.length > 0) {
      return remainingTokens.join(' ');
    }
  }

  return pathnameTokens[pathnameTokens.length - 1] ?? '';
};

const buildMatchReason = (
  action: CommandPaletteAction,
  routeHint: SiteRouteDefinition | null
): string => {
  if (action.kind === 'photography-album') {
    return routeHint?.id === 'photography'
      ? 'Closest matching photography album.'
      : 'Suggested photography album for this path.';
  }

  if (action.kind === 'cv-section') {
    return 'Closest matching CV section.';
  }

  if (routeHint && action.routeId === routeHint.id) {
    return `Closest matching destination inside ${routeHint.label}.`;
  }

  return 'Closest matching route.';
};

const scoreAction = (
  action: CommandPaletteAction,
  pathname: string,
  routeHint: SiteRouteDefinition | null,
  paletteQuery: string
): number => {
  const pathnameTokens = tokenizeValue(pathname);
  const actionTokens = tokenizeValue(
    `${action.label} ${action.description} ${action.path} ${action.keywords.join(' ')}`
  );
  const actionPathTokens = tokenizeValue(action.path);
  const normalizedPathname = normalizeValue(pathname);
  const normalizedActionPath = normalizeValue(action.path);
  const finalToken = pathnameTokens[pathnameTokens.length - 1] ?? '';

  let score = scoreTokenSet(pathnameTokens, actionTokens);

  if (paletteQuery) {
    score += scoreTokenSet(tokenizeValue(paletteQuery), actionTokens) * 2;
  }

  if (routeHint && action.routeId === routeHint.id) {
    score += 26;
  }

  if (pathname && normalizedActionPath.startsWith(normalizedPathname)) {
    score += 70;
  }

  if (routeHint && routeHint.path !== '/' && pathname.startsWith(`${routeHint.path}/`)) {
    score += action.kind === 'route' ? 12 : 0;
  }

  if (finalToken) {
    score += actionTokens.reduce(
      (best, candidate) => Math.max(best, scoreTokenMatch(finalToken, candidate)),
      0
    );
  }

  if (action.kind === 'photography-album' && routeHint?.id === 'photography') {
    score += 18;
  }

  if (action.kind === 'cv-section' && routeHint?.id === 'cv') {
    score += 18;
  }

  if (
    action.kind === 'route' &&
    recoveryRouteActions.some((routeAction) => routeAction.id === action.id)
  ) {
    score += 4;
  }

  if (
    actionPathTokens.length > 0 &&
    pathnameTokens.length > 0 &&
    actionPathTokens[0] === pathnameTokens[0]
  ) {
    score += 10;
  }

  return score;
};

export const getRecoveryContext = (pathname: string): RecoveryContext => {
  const normalizedPathname = normalizePathname(pathname);
  const routeHint = getClosestRouteHint(normalizedPathname);
  const suggestedPaletteQuery = getPaletteQuery(normalizedPathname, routeHint);

  const contextualSuggestions = commandPaletteActions
    .map((action) => ({
      ...action,
      score: scoreAction(action, normalizedPathname, routeHint, suggestedPaletteQuery),
      matchReason: buildMatchReason(action, routeHint),
    }))
    .filter((action) => action.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.label.localeCompare(right.label);
    })
    .filter(
      (action, index, actions) =>
        actions.findIndex((candidate) => candidate.path === action.path) === index
    )
    .slice(0, 3);

  return {
    attemptedPath: normalizedPathname,
    attemptedPathLabel: formatAttemptedPathLabel(normalizedPathname),
    routeHint,
    routeHintLabel: routeHint ? `It looks like you were trying to reach ${routeHint.label}.` : null,
    suggestedPaletteQuery,
    contextualSuggestions,
  };
};
