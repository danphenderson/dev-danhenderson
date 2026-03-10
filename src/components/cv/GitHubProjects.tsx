import type { GitHubProject } from '../../data/cv';
import { GitHubLinkChipList } from './GitHubLinkChipList';

type GitHubProjectsProps = {
  projects: GitHubProject[];
  animateItems?: boolean;
  startDelayMs?: number;
  itemStaggerMs?: number;
};

export const GitHubProjects = ({
  projects,
  animateItems = false,
  startDelayMs = 0,
  itemStaggerMs,
}: GitHubProjectsProps) => {
  return (
    <GitHubLinkChipList
      items={projects.map((project) => ({
        key: project.name,
        label: project.name,
        href: project.url,
      }))}
      layout="wrap"
      animateItems={animateItems}
      startDelayMs={startDelayMs}
      itemStaggerMs={itemStaggerMs}
    />
  );
};
