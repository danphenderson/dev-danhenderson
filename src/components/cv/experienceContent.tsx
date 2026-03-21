import { Fragment, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import type {
  ExperienceDescription,
  ExperienceProject,
  ExperienceProjectSegment,
} from '../../types/cv';

export const renderExperienceSegments = (segments: ExperienceProjectSegment[]): ReactNode[] =>
  segments.map((segment, segmentIndex) => {
    const content = segment.link ? (
      <CommonLink
        href={segment.link}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        data-tooltip-id={segment.tooltip ? COMMON_LINK_TOOLTIP_ID : undefined}
        data-tooltip-content={segment.tooltip}
        data-tooltip-place={segment.tooltip ? 'top' : undefined}
      >
        {segment.text}
      </CommonLink>
    ) : (
      <Box component="span">{segment.text}</Box>
    );

    return (
      <Fragment key={segmentIndex}>
        {segment.lineBreakBefore ? <br /> : null}
        {content}
      </Fragment>
    );
  });

export const renderExperienceDescriptionContent = (
  description: ExperienceDescription
): ReactNode =>
  typeof description === 'string' ? description : renderExperienceSegments(description);

export const renderExperienceProjectContent = (project: ExperienceProject): ReactNode => {
  if (typeof project === 'string') {
    return project;
  }

  if (Array.isArray(project)) {
    return renderExperienceSegments(project);
  }

  const linkLabel = project.text.replace(/:\s*$/, '');

  return project.link ? (
    <CommonLink href={project.link} target="_blank" rel="noopener noreferrer" underline="hover">
      {linkLabel}
    </CommonLink>
  ) : (
    project.text
  );
};
