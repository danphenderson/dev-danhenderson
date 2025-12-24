import { useEffect, useRef, useState } from 'react';
import {
  MAX_VISIBLE_CONTRIBUTIONS,
  fallbackGitHubActivity,
  fallbackGitHubProjects,
  githubUsername,
} from '../data/cv';
import type { GitHubActivityItem, GitHubContribution, GitHubProject } from '../data/cv';

type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  payload?: {
    action?: string;
    ref_type?: string;
    ref?: string;
    before?: string;
    head?: string;
    commits?: { message?: string; sha?: string }[];
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
      const commitShas = commits.map((commit) => commit.sha).filter((sha): sha is string => Boolean(sha));
      const headSha = event.payload?.head || commitShas[commitShas.length - 1];
      return {
        label: `Pushed ${commitCount || 'new'} commit${commitCount === 1 ? '' : 's'} to ${repoName}`,
        href: headSha ? `${repoUrl}/commit/${headSha}` : repoUrl,
      };
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action ?? 'updated';
      const prNumber = event.payload?.pull_request?.number;
      const prUrl = event.payload?.pull_request?.html_url;
      return {
        label: `${action.charAt(0).toUpperCase()}${action.slice(1)} PR${prNumber ? ` #${prNumber}` : ''} on ${repoName}`,
        href: prUrl || (prNumber && repoUrl ? `${repoUrl}/pull/${prNumber}` : repoUrl),
      };
    }
    case 'IssuesEvent': {
      const action = event.payload?.action ?? 'updated';
      const issueNumber = event.payload?.issue?.number;
      const issueUrl = event.payload?.issue?.html_url;
      return {
        label: `${action.charAt(0).toUpperCase()}${action.slice(1)} issue${issueNumber ? ` #${issueNumber}` : ''} on ${repoName}`,
        href: issueUrl || (issueNumber && repoUrl ? `${repoUrl}/issues/${issueNumber}` : repoUrl),
      };
    }
    case 'PullRequestReviewEvent': {
      const prNumber = event.payload?.pull_request?.number;
      const prUrl = event.payload?.pull_request?.html_url;
      return {
        label: `Reviewed a PR${prNumber ? ` #${prNumber}` : ''} on ${repoName}`,
        href: prUrl || (prNumber && repoUrl ? `${repoUrl}/pull/${prNumber}` : repoUrl),
      };
    }
    case 'CreateEvent':
      return {
        label: `Created ${event.payload?.ref_type ?? 'a resource'}${event.payload?.ref ? ` ${event.payload.ref}` : ''} in ${repoName}`,
        href:
          repoUrl && event.payload?.ref_type === 'branch' && event.payload?.ref
            ? `${repoUrl}/tree/${event.payload.ref}`
            : repoUrl && event.payload?.ref_type === 'tag' && event.payload?.ref
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

export const useGithubProfile = () => {
  const [activity, setActivity] = useState<GitHubActivityItem[]>(fallbackGitHubActivity);
  const [projects, setProjects] = useState<GitHubProject[]>(fallbackGitHubProjects);
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lastActivity = useRef<GitHubActivityItem[]>(fallbackGitHubActivity);
  const lastProjects = useRef<GitHubProject[]>(fallbackGitHubProjects);
  const lastContributions = useRef<GitHubContribution[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchGitHub = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
        const requestInit: RequestInit = { headers, signal: controller.signal };

        const [eventsRes, reposRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=20`, requestInit),
          fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, requestInit),
          fetch(
            `https://api.github.com/search/issues?q=author:${githubUsername}+is:public+is:pr+-user:${githubUsername}&sort=updated&order=desc&per_page=30`,
            requestInit
          ),
        ]);

        let encounteredError = false;
        const externalReposSet = new Set<string>();
        let activityList = fallbackGitHubActivity;
        let projectList = fallbackGitHubProjects;
        let contributionsList: GitHubContribution[] = [];

        if (eventsRes.ok) {
          const eventsData: GitHubEvent[] = await eventsRes.json();
          const formattedEvents = eventsData
            .filter((event) =>
              ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent', 'CreateEvent', 'ReleaseEvent'].includes(event.type)
            )
            .map(formatGitHubEvent)
            .filter((item): item is GitHubActivityItem => Boolean(item))
            .slice(0, 6);

          eventsData
            .map((event) => event.repo?.name)
            .filter(
              (repoName): repoName is string =>
                Boolean(repoName) && !repoName.toLowerCase().startsWith(`${githubUsername.toLowerCase()}/`)
            )
            .forEach((name) => externalReposSet.add(name));

          activityList = formattedEvents.length ? formattedEvents : fallbackGitHubActivity;
        } else {
          encounteredError = true;
        }

        if (reposRes.ok) {
          const reposData: GitHubRepo[] = await reposRes.json();
          projectList = reposData
            .filter((repo) => !repo.fork && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 8)
            .map((repo) => ({ name: repo.name, url: repo.html_url }));
        } else {
          encounteredError = true;
        }

        if (contribRes.ok) {
          type GitHubSearchIssues = { items: { repository_url: string }[] };
          const contribData: GitHubSearchIssues = await contribRes.json();
          const searchRepos = contribData.items
            .map((item) => item.repository_url?.split('repos/')[1])
            .filter(
              (name): name is string =>
                Boolean(name) && !name.toLowerCase().startsWith(`${githubUsername.toLowerCase()}/`)
            );
          searchRepos.forEach((name) => externalReposSet.add(name));
        } else {
          encounteredError = true;
        }

        const contributions = Array.from(externalReposSet).slice(0, MAX_VISIBLE_CONTRIBUTIONS);
        contributionsList = contributions.map((name) => ({
          name,
          url: `https://github.com/${name}`,
          stars: 0,
        }));

        if (contributionsList.length) {
          const enriched = await Promise.all(
            contributionsList.map(async (repo) => {
              try {
                const res = await fetch(`https://api.github.com/repos/${repo.name}`, { headers, signal: controller.signal });
                if (!res.ok) {
                  encounteredError = true;
                  return repo;
                }
                const data: GitHubRepo = await res.json();
                return {
                  name: data.full_name || repo.name,
                  url: data.html_url || repo.url,
                  stars: data.stargazers_count || 0,
                };
              } catch (err) {
                if ((err as Error).name === 'AbortError') {
                  return repo;
                }
                encounteredError = true;
                return repo;
              }
            })
          );

          contributionsList = enriched
            .sort((a, b) => (b.stars || 0) - (a.stars || 0))
            .map(({ name, url, stars }) => ({ name, url, stars }));
        }

        const effectiveActivity = activityList.length ? activityList : lastActivity.current;
        const effectiveProjects = projectList.length ? projectList : lastProjects.current;
        const effectiveContribs = contributionsList.length ? contributionsList : lastContributions.current;

        if (!cancelled) {
          lastActivity.current = effectiveActivity;
          lastProjects.current = effectiveProjects;
          lastContributions.current = effectiveContribs;

          setActivity(effectiveActivity);
          setProjects(effectiveProjects);
          setContributions(effectiveContribs);
          if (encounteredError) {
            setError('Unable to load all GitHub data right now. Showing recent highlights instead.');
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        if (!cancelled) {
          setError('Unable to load GitHub activity right now. Showing recent highlights instead.');
          setActivity(lastActivity.current.length ? lastActivity.current : fallbackGitHubActivity);
          setProjects(lastProjects.current.length ? lastProjects.current : fallbackGitHubProjects);
          setContributions(lastContributions.current);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGitHub();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return {
    activity,
    projects,
    contributions,
    loading,
    error,
  };
};
