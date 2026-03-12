import { useEffect, useState } from 'react';
import { fallbackGitHubActivity, fallbackGitHubContributions, fallbackGitHubProjects } from '../data/cv';
import type { GitHubActivityItem, GitHubContribution, GitHubProject } from '../types/cv';
import { loadGitHubProfileData } from './githubProfileData';

export const useGithubProfile = () => {
  const [activity, setActivity] = useState<GitHubActivityItem[]>(fallbackGitHubActivity);
  const [projects, setProjects] = useState<GitHubProject[]>(fallbackGitHubProjects);
  const [contributions, setContributions] = useState<GitHubContribution[]>(fallbackGitHubContributions);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGitHub = async () => {
      setLoading(true);
      setError(null);

      try {
        const { activity: nextActivity, projects: nextProjects, contributions: nextContributions, encounteredError } =
          await loadGitHubProfileData();

        if (!cancelled) {
          setActivity(nextActivity);
          setProjects(nextProjects);
          setContributions(nextContributions);
          if (encounteredError) {
            setError('Unable to load all GitHub data right now. Showing recent highlights instead.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load GitHub activity right now. Showing recent highlights instead.');
          setActivity(fallbackGitHubActivity);
          setProjects(fallbackGitHubProjects);
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
    projects,
    contributions,
    loading,
    error,
  };
};
