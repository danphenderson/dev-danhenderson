import { useEffect, useState } from 'react';
import { fallbackGitHubActivity, fallbackGitHubContributions } from '../data/cv';
import type { SharedDataStatus } from '../types/data';
import type { GitHubActivityItem, GitHubContribution } from '../types/cv';
import {
  createGithubHookErrorStatus,
  createInitialGitHubProfileStatus,
  createLoadingGitHubProfileStatus,
  loadGitHubProfileData,
} from './githubProfileData';

export const useGithubProfile = () => {
  const [activity, setActivity] = useState<GitHubActivityItem[]>(fallbackGitHubActivity);
  const [contributions, setContributions] = useState<GitHubContribution[]>(
    fallbackGitHubContributions
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SharedDataStatus>(createInitialGitHubProfileStatus);

  useEffect(() => {
    let cancelled = false;

    const fetchGitHub = async () => {
      setLoading(true);
      setError(null);
      setStatus((previousStatus) => createLoadingGitHubProfileStatus(previousStatus));

      try {
        const {
          activity: nextActivity,
          contributions: nextContributions,
          encounteredError,
          status: nextStatus,
        } = await loadGitHubProfileData();

        if (!cancelled) {
          setActivity(nextActivity);
          setContributions(nextContributions);
          if (encounteredError) {
            const message =
              'Unable to load all GitHub data right now. Showing recent highlights instead.';
            setError(message);
            setStatus({
              ...nextStatus,
              error: message,
            });
          } else {
            setStatus(nextStatus);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            'Unable to load GitHub activity right now. Showing recent highlights instead.';
          setError(message);
          setActivity(fallbackGitHubActivity);
          setContributions(fallbackGitHubContributions);
          setStatus(createGithubHookErrorStatus(message));
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
    };
  }, []);

  return {
    activity,
    contributions,
    loading,
    error,
    status,
  };
};
