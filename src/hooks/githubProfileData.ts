import {
  MAX_CONTRIBUTION_ENRICHMENTS,
  MAX_VISIBLE_CONTRIBUTIONS,
  fallbackGitHubActivity,
  fallbackGitHubContributions,
  githubUsername,
} from '../data/cv';
import type {
  SharedDataSourceDetail,
  SharedDataStatus,
  SharedDataStatusReason,
} from '../types/data';
import type { GitHubActivityItem, GitHubProfileData } from '../types/cv';

export type { GitHubProfileData };

type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  payload?: {
    action?: string;
    ref_type?: string;
    ref?: string;
    head?: string;
    commits?: { sha?: string }[];
    pull_request?: { number?: number; html_url?: string };
    issue?: { number?: number; html_url?: string };
    release?: { html_url?: string; tag_name?: string };
  };
};

type GitHubRepo = {
  id: number;
  name: string;
  full_name?: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
};

type GitHubSearchIssues = {
  items: { repository_url: string }[];
};

const CACHE_TTL_MS = 5 * 60 * 1000;

const CONTRIBUTION_EVENT_TYPES = new Set([
  'PullRequestEvent',
  'PullRequestReviewEvent',
  'PullRequestReviewCommentEvent',
  'IssuesEvent',
  'IssueCommentEvent',
]);

type GitHubProfileCacheEntry = {
  data: GitHubProfileData;
  expiresAt: number;
};

let cacheEntry: GitHubProfileCacheEntry | null = null;
let inFlightPromise: Promise<GitHubProfileData> | null = null;

const createGitHubStatus = ({
  source,
  loading,
  error,
  isFallback,
  reason,
  label,
  lastUpdated,
  sourceDetail,
}: {
  source: SharedDataStatus['source'];
  loading: boolean;
  error: string | null;
  isFallback: boolean;
  reason: SharedDataStatusReason;
  label: string;
  lastUpdated?: string;
  sourceDetail?: SharedDataSourceDetail[];
}): SharedDataStatus => ({
  source,
  loading,
  error,
  isFallback,
  reason,
  freshness: {
    label,
    lastUpdated,
    staleAfterMs: CACHE_TTL_MS,
    isStale: lastUpdated ? Date.now() - new Date(lastUpdated).getTime() > CACHE_TTL_MS : false,
  },
  ...(sourceDetail ? { sourceDetail } : {}),
});

export const createInitialGitHubProfileStatus = (): SharedDataStatus =>
  createGitHubStatus({
    source: 'static',
    loading: false,
    error: null,
    isFallback: true,
    reason: 'initial-fallback',
    label: 'Bundled fallback GitHub highlights are ready while live data loads.',
  });

export const createBundledGitHubProfileStatus = (): SharedDataStatus =>
  createGitHubStatus({
    source: 'static',
    loading: false,
    error: null,
    isFallback: false,
    reason: 'bundled-content',
    label: 'Bundled GitHub highlights are used by default in development and test environments.',
  });

export const shouldUseBundledGitHubProfileDataByDefault = () =>
  process.env.NODE_ENV !== 'production' &&
  process.env.REACT_APP_ENABLE_GITHUB_API_IN_DEV !== 'true';

export const createLoadingGitHubProfileStatus = (
  previousStatus: SharedDataStatus
): SharedDataStatus => ({
  ...previousStatus,
  loading: true,
  error: null,
});

export const createGithubHookErrorStatus = (message: string): SharedDataStatus =>
  createGitHubStatus({
    source: 'static',
    loading: false,
    error: message,
    isFallback: true,
    reason: 'network-error',
    label: 'Bundled fallback GitHub highlights are shown because the live request failed.',
  });

const formatGitHubEvent = (event: GitHubEvent): GitHubActivityItem | null => {
  const repoName = event.repo?.name;
  if (!repoName) {
    return null;
  }

  const repoUrl = `https://github.com/${repoName}`;

  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits ?? [];
      const commitCount = commits.length;
      const commitShas = commits
        .map((commit) => commit.sha)
        .filter((sha): sha is string => Boolean(sha));
      const headSha = event.payload?.head || commitShas[commitShas.length - 1];

      return {
        label: `Pushed ${commitCount || 'new'} commit${
          commitCount === 1 ? '' : 's'
        } to ${repoName}`,
        href: headSha ? `${repoUrl}/commit/${headSha}` : repoUrl,
      };
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action ?? 'updated';
      const prNumber = event.payload?.pull_request?.number;
      const prUrl = event.payload?.pull_request?.html_url;

      return {
        label: `${action.charAt(0).toUpperCase()}${action.slice(1)} PR${
          prNumber ? ` #${prNumber}` : ''
        } on ${repoName}`,
        href: prUrl || (prNumber ? `${repoUrl}/pull/${prNumber}` : repoUrl),
      };
    }
    case 'IssuesEvent': {
      const action = event.payload?.action ?? 'updated';
      const issueNumber = event.payload?.issue?.number;
      const issueUrl = event.payload?.issue?.html_url;

      return {
        label: `${action.charAt(0).toUpperCase()}${action.slice(1)} issue${
          issueNumber ? ` #${issueNumber}` : ''
        } on ${repoName}`,
        href: issueUrl || (issueNumber ? `${repoUrl}/issues/${issueNumber}` : repoUrl),
      };
    }
    case 'PullRequestReviewEvent': {
      const prNumber = event.payload?.pull_request?.number;
      const prUrl = event.payload?.pull_request?.html_url;

      return {
        label: `Reviewed a PR${prNumber ? ` #${prNumber}` : ''} on ${repoName}`,
        href: prUrl || (prNumber ? `${repoUrl}/pull/${prNumber}` : repoUrl),
      };
    }
    case 'CreateEvent':
      return {
        label: `Created ${event.payload?.ref_type ?? 'a resource'}${
          event.payload?.ref ? ` ${event.payload.ref}` : ''
        } in ${repoName}`,
        href:
          event.payload?.ref_type === 'branch' && event.payload?.ref
            ? `${repoUrl}/tree/${event.payload.ref}`
            : event.payload?.ref_type === 'tag' && event.payload?.ref
              ? `${repoUrl}/releases/tag/${event.payload.ref}`
              : repoUrl,
      };
    case 'ReleaseEvent': {
      const releaseTag = event.payload?.release?.tag_name;
      const releaseUrl = event.payload?.release?.html_url;

      return {
        label: `Published ${releaseTag ? `release ${releaseTag}` : 'a release'} on ${repoName}`,
        href: releaseUrl || `${repoUrl}/releases`,
      };
    }
    default:
      return { label: `${event.type.replace(/Event$/, '')} on ${repoName}`, href: repoUrl };
  }
};

const fetchJson = async <T>(url: string) => {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });

  if (!response.ok) {
    throw new Error(`GitHub request failed for ${url}`);
  }

  return response.json() as Promise<T>;
};

const getExternalContributionRepos = (events: GitHubEvent[]) => {
  const externalRepos = new Set<string>();

  events
    .filter((event) => CONTRIBUTION_EVENT_TYPES.has(event.type))
    .map((event) => event.repo?.name)
    .filter(
      (repoName): repoName is string =>
        Boolean(repoName) && !repoName.toLowerCase().startsWith(`${githubUsername.toLowerCase()}/`)
    )
    .forEach((repoName) => externalRepos.add(repoName));

  return externalRepos;
};

const buildActivity = (events: GitHubEvent[]) => {
  const activity = events
    .filter((event) =>
      [
        'PushEvent',
        'PullRequestEvent',
        'IssuesEvent',
        'PullRequestReviewEvent',
        'CreateEvent',
        'ReleaseEvent',
      ].includes(event.type)
    )
    .map(formatGitHubEvent)
    .filter((item): item is GitHubActivityItem => Boolean(item))
    .slice(0, 6);

  return activity.length ? activity : fallbackGitHubActivity;
};

const buildContributionCandidates = (repoNames: Set<string>) =>
  Array.from(repoNames)
    .slice(0, MAX_VISIBLE_CONTRIBUTIONS)
    .map((name) => ({
      name,
      url: `https://github.com/${name}`,
      stars: 0,
    }));

const enrichContributions = async (
  contributionCandidates: Array<{ name: string; url: string; stars: number }>
) => {
  let encounteredError = false;

  if (!contributionCandidates.length) {
    return {
      contributions: fallbackGitHubContributions,
      encounteredError,
    };
  }

  const enrichmentCandidates = contributionCandidates.slice(0, MAX_CONTRIBUTION_ENRICHMENTS);
  const tailCandidates = contributionCandidates.slice(MAX_CONTRIBUTION_ENRICHMENTS);

  const enrichedHead = await Promise.all(
    enrichmentCandidates.map(async (repo) => {
      try {
        const data = await fetchJson<GitHubRepo>(`https://api.github.com/repos/${repo.name}`);

        return {
          name: data.full_name || repo.name,
          url: data.html_url || repo.url,
          stars: data.stargazers_count || 0,
        };
      } catch (_error) {
        encounteredError = true;
        return repo;
      }
    })
  );

  return {
    contributions: [...enrichedHead, ...tailCandidates]
      .sort((a, b) => (b.stars || 0) - (a.stars || 0))
      .map(({ name, url, stars }) => ({ name, url, stars })),
    encounteredError,
  };
};

const fetchGitHubProfileData = async (): Promise<GitHubProfileData> => {
  let encounteredError = false;
  let usedFallbackActivity = false;
  let usedFallbackContributions = false;

  const [eventsResult, contributionsResult] = await Promise.allSettled([
    fetchJson<GitHubEvent[]>(
      `https://api.github.com/users/${githubUsername}/events/public?per_page=20`
    ),
    fetchJson<GitHubSearchIssues>(
      `https://api.github.com/search/issues?q=author:${githubUsername}+is:public+is:pr+-user:${githubUsername}&sort=updated&order=desc&per_page=30`
    ),
  ]);

  const eventsOk = eventsResult.status === 'fulfilled';
  const contributionsOk = contributionsResult.status === 'fulfilled';
  const externalRepos = new Set<string>();

  const activity = eventsOk
    ? buildActivity(eventsResult.value)
    : ((encounteredError = true), (usedFallbackActivity = true), fallbackGitHubActivity);

  if (eventsOk && activity === fallbackGitHubActivity) {
    usedFallbackActivity = true;
  }

  if (eventsOk) {
    getExternalContributionRepos(eventsResult.value).forEach((repoName) =>
      externalRepos.add(repoName)
    );
  }

  if (contributionsOk) {
    contributionsResult.value.items
      .map((item) => item.repository_url?.split('repos/')[1])
      .filter(
        (name): name is string =>
          Boolean(name) && !name.toLowerCase().startsWith(`${githubUsername.toLowerCase()}/`)
      )
      .forEach((repoName) => externalRepos.add(repoName));
  } else {
    encounteredError = true;
  }

  const enrichedContributions = await enrichContributions(
    buildContributionCandidates(externalRepos)
  );
  encounteredError = encounteredError || enrichedContributions.encounteredError;
  usedFallbackContributions = enrichedContributions.contributions === fallbackGitHubContributions;

  const lastUpdated = new Date().toISOString();
  const isFallback = usedFallbackActivity || usedFallbackContributions;
  const reason: SharedDataStatusReason = isFallback
    ? encounteredError
      ? usedFallbackActivity && usedFallbackContributions
        ? 'fallback-content'
        : 'partial-fallback'
      : 'fallback-content'
    : 'live-fetch';
  const label = isFallback
    ? 'GitHub activity is partially or fully backed by bundled fallback highlights.'
    : 'GitHub activity was fetched live and cached for subsequent visits.';

  const sourceDetail: SharedDataSourceDetail[] = [
    {
      id: 'events',
      label: 'Public events',
      ok: eventsOk,
    },
    {
      id: 'contributions',
      label: 'Contribution search',
      ok: contributionsOk,
    },
    {
      id: 'enrichment',
      label: 'Repo enrichment',
      ok: !enrichedContributions.encounteredError,
    },
  ];

  return {
    activity,
    contributions: enrichedContributions.contributions,
    encounteredError,
    status: createGitHubStatus({
      source: 'remote',
      loading: false,
      error: null,
      isFallback,
      reason,
      label,
      lastUpdated,
      sourceDetail,
    }),
  };
};

const createBundledGitHubProfileData = (): GitHubProfileData => ({
  activity: fallbackGitHubActivity,
  contributions: fallbackGitHubContributions,
  encounteredError: false,
  status: createBundledGitHubProfileStatus(),
});

export const loadGitHubProfileData = async () => {
  if (shouldUseBundledGitHubProfileDataByDefault()) {
    return createBundledGitHubProfileData();
  }

  const now = Date.now();

  if (cacheEntry && cacheEntry.expiresAt > now) {
    return {
      ...cacheEntry.data,
      status: createGitHubStatus({
        source: 'cache',
        loading: false,
        error: null,
        isFallback: cacheEntry.data.status.isFallback,
        reason: 'cache-hit',
        label: 'GitHub activity is served from the recent in-memory cache.',
        lastUpdated: cacheEntry.data.status.freshness.lastUpdated,
        sourceDetail: cacheEntry.data.status.sourceDetail,
      }),
    };
  }

  if (!inFlightPromise) {
    inFlightPromise = fetchGitHubProfileData()
      .then((data) => {
        cacheEntry = {
          data,
          expiresAt: Date.now() + CACHE_TTL_MS,
        };
        return data;
      })
      .finally(() => {
        inFlightPromise = null;
      });
  }

  return inFlightPromise;
};

export const resetGitHubProfileDataCacheForTests = () => {
  cacheEntry = null;
  inFlightPromise = null;
};
