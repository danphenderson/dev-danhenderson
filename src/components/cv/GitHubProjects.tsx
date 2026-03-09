import type { GitHubProject } from '../../data/cv';
import { GitHubLinkChipList } from './GitHubLinkChipList';

type GitHubProjectsProps = {
  projects: GitHubProject[];
};

export const GitHubProjects = ({ projects }: GitHubProjectsProps) => {
  return (
    <GitHubLinkChipList
      items={projects.map((project) => ({
        key: project.name,
        label: project.name,
        href: project.url,
      }))}
      layout="wrap"
    />
  );
};
