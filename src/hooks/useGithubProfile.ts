import { useEffect, useState } from 'react';
import { fallbackGitHubActivity, fallbackGitHubContributions } from '../data/cv';
import type { GitHubActivityItem, GitHubContribution } from '../types/cv';
import { loadGitHubProfileData } from './githubProfileData';

export const useGithubProfile = () => {
  const [activity, setActivity] = useState<GitHubActivityItem[]>(fallbackGitHubActivity);
  const [contributions, setContributions] = useState<GitHubContribution[]>(
    fallbackGitHubContributions
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGitHub = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          activity: nextActivity,
          contributions: nextContributions,
          encounteredError,
        } = await loadGitHubProfileData();

        if (!cancelled) {
          setActivity(nextActivity);
          setContributions(nextContributions);
          if (encounteredError) {
            setError(
              'Unable to load all GitHub data right now. Showing recent highlights instead.'
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load GitHub activity right now. Showing recent highlights instead.');
          setActivity(fallbackGitHubActivity);
          setContributions(fallbackGitHubContributions);
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
  };
};
