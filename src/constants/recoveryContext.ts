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

type TokenMatchSummary = {
  exact: number;
  prefix: number;
  contains: number;
};

type OrderedTokenAlignment = {
  level: 0 | 1 | 2 | 3;
  exact: number;
  prefix: number;
};

type RankedRecoveryCandidate = {
  action: CommandPaletteAction;
  ranking: {
    alignment: OrderedTokenAlignment;
    actionPathMatches: TokenMatchSummary;
    queryMatches: TokenMatchSummary;
    pathMatches: TokenMatchSummary;
    sameRoute: boolean;
    contextualKindMatch: boolean;
    isRecoveryRoute: boolean;
    recoveryPriority: number;
  };
};

const MAX_CONTEXTUAL_SUGGESTIONS = 3;
const NO_RECOVERY_PRIORITY = Number.MAX_SAFE_INTEGER;
const recoveryRoutePriorityMap = new Map(
  recoveryRouteActions.map((action) => [action.id, action.recoveryPriority])
);

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

const compareDescending = (left: number, right: number): number => right - left;

const compareAscending = (left: number, right: number): number => left - right;

const compareBooleanDescending = (left: boolean, right: boolean): number =>
  Number(right) - Number(left);

const getLooseTokenMatchStrength = (token: string, candidate: string): 0 | 1 | 2 | 3 => {
  if (candidate === token) {
    return 3;
  }

  if (
    Math.min(token.length, candidate.length) >= 2 &&
    (candidate.startsWith(token) || token.startsWith(candidate))
  ) {
    return 2;
  }

  if (
    token.length >= 3 &&
    candidate.length >= 3 &&
    (candidate.includes(token) || token.includes(candidate))
  ) {
    return 1;
  }

  return 0;
};

const summarizeTokenMatches = (tokens: string[], candidates: string[]): TokenMatchSummary =>
  tokens.reduce<TokenMatchSummary>(
    (summary, token) => {
      const bestMatchStrength = candidates.reduce<0 | 1 | 2 | 3>(
        (best, candidate) =>
          Math.max(best, getLooseTokenMatchStrength(token, candidate)) as 0 | 1 | 2 | 3,
        0
      );

      if (bestMatchStrength === 3) {
        summary.exact += 1;
      } else if (bestMatchStrength === 2) {
        summary.prefix += 1;
      } else if (bestMatchStrength === 1) {
        summary.contains += 1;
      }

      return summary;
    },
    {
      exact: 0,
      prefix: 0,
      contains: 0,
    }
  );

const hasTokenMatches = ({ exact, prefix, contains }: TokenMatchSummary): boolean =>
  exact > 0 || prefix > 0 || contains > 0;

const compareTokenMatchSummaries = (left: TokenMatchSummary, right: TokenMatchSummary): number =>
  compareDescending(left.exact, right.exact) ||
  compareDescending(left.prefix, right.prefix) ||
  compareDescending(left.contains, right.contains);

const hasStrongTokenMatches = ({ exact, prefix }: TokenMatchSummary): boolean =>
  exact > 0 || prefix > 0;

const getOrderedTokenMatchStrength = (token: string, candidate: string): 0 | 2 | 3 => {
  if (candidate === token) {
    return 3;
  }

  if (
    Math.min(token.length, candidate.length) >= 3 &&
    (candidate.startsWith(token) || token.startsWith(candidate))
  ) {
    return 2;
  }

  return 0;
};

const getOrderedTokenAlignment = (
  attemptedTokens: string[],
  candidateTokens: string[]
): OrderedTokenAlignment => {
  if (attemptedTokens.length === 0 || candidateTokens.length === 0) {
    return {
      level: 0,
      exact: 0,
      prefix: 0,
    };
  }

  let exact = 0;
  let prefix = 0;
  let matchedCount = 0;

  for (
    let index = 0;
    index < Math.min(attemptedTokens.length, candidateTokens.length);
    index += 1
  ) {
    const matchStrength = getOrderedTokenMatchStrength(
      attemptedTokens[index] ?? '',
      candidateTokens[index] ?? ''
    );

    if (matchStrength === 0) {
      break;
    }

    matchedCount += 1;

    if (matchStrength === 3) {
      exact += 1;
    } else {
      prefix += 1;
    }
  }

  if (matchedCount === 0) {
    return {
      level: 0,
      exact,
      prefix,
    };
  }

  const matchedAllAttemptedTokens = matchedCount === attemptedTokens.length;
  const matchedAllCandidateTokens = matchedCount === candidateTokens.length;

  if (matchedAllAttemptedTokens && matchedAllCandidateTokens) {
    return {
      level: 3,
      exact,
      prefix,
    };
  }

  if (matchedAllCandidateTokens) {
    return {
      level: 2,
      exact,
      prefix,
    };
  }

  if (matchedAllAttemptedTokens) {
    return {
      level: 1,
      exact,
      prefix,
    };
  }

  return {
    level: 0,
    exact,
    prefix,
  };
};

const compareOrderedTokenAlignment = (
  left: OrderedTokenAlignment,
  right: OrderedTokenAlignment
): number =>
  compareDescending(left.level, right.level) ||
  compareDescending(left.exact, right.exact) ||
  compareDescending(left.prefix, right.prefix);

const startsWithTokenSequence = (tokens: string[], sequence: string[]): boolean => {
  if (sequence.length === 0 || tokens.length < sequence.length) {
    return false;
  }

  return sequence.every((token, index) => tokens[index] === token);
};

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

  const firstToken = pathnameTokens[0] ?? '';
  const rankedRoutes = siteRoutes
    .filter((route) => route.path !== '*' && route.path !== '/')
    .map((route) => {
      const routeTokens = tokenizeValue(`${route.label} ${route.path} ${route.keywords.join(' ')}`);
      const firstTokenMatches = summarizeTokenMatches([firstToken], routeTokens);
      const allTokenMatches = summarizeTokenMatches(pathnameTokens, routeTokens);

      return {
        route,
        firstTokenMatches,
        allTokenMatches,
        routeTokenLength: tokenizeValue(route.path).length,
      };
    })
    .filter(
      (candidate) =>
        hasTokenMatches(candidate.firstTokenMatches) || hasTokenMatches(candidate.allTokenMatches)
    )
    .sort(
      (left, right) =>
        compareTokenMatchSummaries(left.firstTokenMatches, right.firstTokenMatches) ||
        compareTokenMatchSummaries(left.allTokenMatches, right.allTokenMatches) ||
        compareDescending(left.routeTokenLength, right.routeTokenLength) ||
        left.route.label.localeCompare(right.route.label)
    );

  return rankedRoutes[0]?.route ?? null;
};

const getPaletteQuery = (pathname: string, routeHint: SiteRouteDefinition | null): string => {
  const pathnameTokens = tokenizeValue(pathname);
  if (pathnameTokens.length === 0) {
    return '';
  }

  if (routeHint && routeHint.path !== '/') {
    const routeTokens = tokenizeValue(routeHint.path);
    if (startsWithTokenSequence(pathnameTokens, routeTokens)) {
      const remainingTokens = pathnameTokens.slice(routeTokens.length);

      if (remainingTokens.length > 0) {
        return remainingTokens.join(' ');
      }
    }

    return pathnameTokens.join(' ');
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

const tokenizeActionPath = (path: string): string[] => {
  const [pathnameWithQuery, hashFragment = ''] = path.split('#');
  const [pathname, queryFragment = ''] = pathnameWithQuery.split('?');
  const pathTokens = tokenizeValue(pathname);
  const suffixTokens = tokenizeValue(hashFragment || queryFragment);

  while (
    suffixTokens.length > 0 &&
    pathTokens.length > 0 &&
    suffixTokens[0] === pathTokens[pathTokens.length - 1]
  ) {
    suffixTokens.shift();
  }

  return [...pathTokens, ...suffixTokens];
};

const buildRankedRecoveryCandidate = (
  action: CommandPaletteAction,
  pathname: string,
  routeHint: SiteRouteDefinition | null,
  paletteQuery: string
): RankedRecoveryCandidate => {
  const pathnameTokens = tokenizeValue(pathname);
  const actionTokens = tokenizeValue(
    `${action.label} ${action.description} ${action.path} ${action.keywords.join(' ')}`
  );
  const actionPathTokens = tokenizeActionPath(action.path);
  const queryTokens = tokenizeValue(paletteQuery);
  const isRecoveryRoute = action.kind === 'route' && recoveryRoutePriorityMap.has(action.id);

  return {
    action,
    ranking: {
      alignment: getOrderedTokenAlignment(pathnameTokens, actionPathTokens),
      actionPathMatches: summarizeTokenMatches(queryTokens, actionPathTokens),
      queryMatches: summarizeTokenMatches(queryTokens, actionTokens),
      pathMatches: summarizeTokenMatches(pathnameTokens, actionTokens),
      sameRoute: Boolean(routeHint && action.routeId === routeHint.id),
      contextualKindMatch:
        (action.kind === 'photography-album' && routeHint?.id === 'photography') ||
        (action.kind === 'cv-section' && routeHint?.id === 'cv'),
      isRecoveryRoute,
      recoveryPriority: recoveryRoutePriorityMap.get(action.id) ?? NO_RECOVERY_PRIORITY,
    },
  };
};

const isContextualRecoveryCandidate = ({ ranking }: RankedRecoveryCandidate): boolean =>
  ranking.alignment.level > 0 ||
  hasStrongTokenMatches(ranking.actionPathMatches) ||
  hasStrongTokenMatches(ranking.queryMatches) ||
  hasStrongTokenMatches(ranking.pathMatches) ||
  ranking.sameRoute ||
  ranking.contextualKindMatch;

const compareRankedRecoveryCandidates = (
  left: RankedRecoveryCandidate,
  right: RankedRecoveryCandidate
): number => {
  // Ranking precedence is intentionally explicit: prefer path-aligned suggestions,
  // then query/text relevance, then route-context fallbacks.
  return (
    compareOrderedTokenAlignment(left.ranking.alignment, right.ranking.alignment) ||
    compareTokenMatchSummaries(left.ranking.actionPathMatches, right.ranking.actionPathMatches) ||
    compareTokenMatchSummaries(left.ranking.queryMatches, right.ranking.queryMatches) ||
    compareTokenMatchSummaries(left.ranking.pathMatches, right.ranking.pathMatches) ||
    compareBooleanDescending(left.ranking.sameRoute, right.ranking.sameRoute) ||
    compareBooleanDescending(left.ranking.contextualKindMatch, right.ranking.contextualKindMatch) ||
    compareBooleanDescending(left.ranking.isRecoveryRoute, right.ranking.isRecoveryRoute) ||
    compareAscending(left.ranking.recoveryPriority, right.ranking.recoveryPriority) ||
    left.action.label.localeCompare(right.action.label)
  );
};

export const getRecoveryContext = (pathname: string): RecoveryContext => {
  const normalizedPathname = normalizePathname(pathname);
  const routeHint = getClosestRouteHint(normalizedPathname);
  const suggestedPaletteQuery = getPaletteQuery(normalizedPathname, routeHint);

  const contextualSuggestions = commandPaletteActions
    .map((action) =>
      buildRankedRecoveryCandidate(action, normalizedPathname, routeHint, suggestedPaletteQuery)
    )
    .filter(isContextualRecoveryCandidate)
    .sort(compareRankedRecoveryCandidates)
    .filter(
      (candidate, index, candidates) =>
        candidates.findIndex(
          (otherCandidate) => otherCandidate.action.path === candidate.action.path
        ) === index
    )
    .slice(0, MAX_CONTEXTUAL_SUGGESTIONS)
    .map((candidate, index, candidates) => ({
      ...candidate.action,
      score: candidates.length - index,
      matchReason: buildMatchReason(candidate.action, routeHint),
    }));

  return {
    attemptedPath: normalizedPathname,
    attemptedPathLabel: formatAttemptedPathLabel(normalizedPathname),
    routeHint,
    routeHintLabel: routeHint ? `It looks like you were trying to reach ${routeHint.label}.` : null,
    suggestedPaletteQuery,
    contextualSuggestions,
  };
};
