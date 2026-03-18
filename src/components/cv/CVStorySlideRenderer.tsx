import { Fragment, type ReactNode, useState } from 'react';
import { motion } from 'motion/react';
import { Box, Stack, Tabs, Tab } from '@mui/material';
import { HeaderLabel, HeaderTitle, StrongMetaText, MetaText, BodyText } from '../text';
import { SkillsChipList } from '../SkillsChipList';
import { CommonLink } from '../CommonLink';
import { MotionItem } from '../../motion';
import {
  storyContentContainer,
  storyLabelReveal,
  storyTitleReveal,
  storyMetaReveal,
  storyBodyReveal,
  storyChipsReveal,
  storyLinkReveal,
  storyBulletContainer,
  storyBulletItem,
} from '../../motion/variants';
import type { CVStoryItem } from '../../types/cv';
import type { ExperienceDescription, ExperienceProjectSegment } from '../../types/cv';

type CVStorySlideRendererProps = { item: CVStoryItem };

/* ── Rendering helpers (not exported) ── */

const renderExperienceDescription = (desc: ExperienceDescription): ReactNode => {
  if (typeof desc === 'string') {
    return <BodyText>{desc}</BodyText>;
  }
  return (
    <BodyText>
      {desc.map((seg: ExperienceProjectSegment, i: number) => (
        <Fragment key={i}>
          {seg.lineBreakBefore && <br />}
          {seg.link ? (
            <CommonLink href={seg.link} target="_blank" rel="noopener noreferrer">
              {seg.text}
            </CommonLink>
          ) : (
            seg.text
          )}
        </Fragment>
      ))}
    </BodyText>
  );
};

const renderBulletList = (items: string[], max?: number): ReactNode => {
  const visible = max ? items.slice(0, max) : items;
  return (
    <motion.ul
      variants={storyBulletContainer}
      initial="hidden"
      animate="visible"
      style={{ paddingLeft: 20, margin: 0, listStyleType: '"– "' }}
    >
      {visible.map((item, i) => (
        <motion.li key={i} variants={storyBulletItem}>
          <BodyText>{item}</BodyText>
        </motion.li>
      ))}
    </motion.ul>
  );
};

/* ── Per-kind slide layouts ── */

const AboutSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'about' }> }) => {
  const { data: about } = item;
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <HeaderLabel>About</HeaderLabel>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <HeaderTitle>{about.name}</HeaderTitle>
        </MotionItem>
        <MotionItem variants={storyMetaReveal}>
          <StrongMetaText sx={{ display: 'inline' }}>{about.title}</StrongMetaText>
          <MetaText sx={{ display: 'inline' }}> • </MetaText>
          <MetaText sx={{ display: 'inline' }}>{about.location}</MetaText>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyBodyReveal}>
        <BodyText sx={{ whiteSpace: 'pre-line', lineHeight: 1.75 }}>{about.bio}</BodyText>
      </MotionItem>
      {about.opportunities && about.opportunities.length > 0 && (
        <MotionItem variants={storyChipsReveal}>
          <SkillsChipList skills={about.opportunities} animation="slide" />
        </MotionItem>
      )}
      {about.bioLink && (
        <MotionItem variants={storyLinkReveal}>
          <CommonLink href={about.bioLink.url} target="_blank" rel="noopener noreferrer">
            {about.bioLink.text}
          </CommonLink>
        </MotionItem>
      )}
    </Stack>
  );
};

const ExperienceSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'experience' }> }) => {
  const { data: exp } = item;
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <HeaderLabel>
            {exp.companyUrl ? (
              <CommonLink
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-content={exp.companyTooltip}
              >
                {exp.company}
              </CommonLink>
            ) : (
              exp.company
            )}
          </HeaderLabel>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <HeaderTitle>{exp.title}</HeaderTitle>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyMetaReveal}>
        <MetaText>
          {exp.startDate} – {exp.endDate}
        </MetaText>
      </MotionItem>
      {exp.description && (
        <MotionItem variants={storyBodyReveal}>
          {renderExperienceDescription(exp.description)}
        </MotionItem>
      )}
      {exp.skills && exp.skills.length > 0 && (
        <MotionItem variants={storyChipsReveal}>
          <SkillsChipList skills={exp.skills} animation="slide" />
        </MotionItem>
      )}
    </Stack>
  );
};

const EducationSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'education' }> }) => {
  const { data: entry } = item;
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <HeaderLabel>{entry.university}</HeaderLabel>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <HeaderTitle>{entry.program}</HeaderTitle>
        </MotionItem>
      </Stack>
      <Stack spacing={0.5}>
        <MotionItem variants={storyMetaReveal}>
          <MetaText>{entry.dateRange ?? entry.expectedCompletion ?? ''}</MetaText>
        </MotionItem>
        {entry.gpa && entry.gpa.length > 0 && (
          <MotionItem variants={storyMetaReveal}>
            <MetaText>{entry.gpa.map((g) => `${g.label}: ${g.value}`).join('  ·  ')}</MetaText>
          </MotionItem>
        )}
      </Stack>
      <MotionItem variants={storyBodyReveal}>
        <BodyText>{entry.summary}</BodyText>
      </MotionItem>
      {entry.highlights && entry.highlights.length > 0 && (
        <MotionItem variants={storyBodyReveal}>{renderBulletList(entry.highlights, 4)}</MotionItem>
      )}
      {entry.skills && entry.skills.length > 0 && (
        <MotionItem variants={storyChipsReveal}>
          <SkillsChipList skills={entry.skills} animation="slide" />
        </MotionItem>
      )}
    </Stack>
  );
};

const CertificateSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'certificate' }> }) => {
  const { data: cert } = item;
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <MotionItem variants={storyLabelReveal}>
        <HeaderLabel>{cert.issuer}</HeaderLabel>
      </MotionItem>
      <MotionItem variants={storyTitleReveal}>
        <HeaderTitle>{cert.title}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={storyMetaReveal}>
        <MetaText>{cert.date}</MetaText>
      </MotionItem>
      {cert.link && (
        <MotionItem variants={storyLinkReveal}>
          <CommonLink href={cert.link} target="_blank" rel="noopener noreferrer">
            View certificate
          </CommonLink>
        </MotionItem>
      )}
    </Stack>
  );
};

const VolunteeringSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'volunteering' }> }) => {
  const { data: entry } = item;
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <HeaderLabel>
            {entry.organizationUrl ? (
              <CommonLink href={entry.organizationUrl} target="_blank" rel="noopener noreferrer">
                {entry.organization}
              </CommonLink>
            ) : (
              entry.organization
            )}
          </HeaderLabel>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <HeaderTitle>{entry.role}</HeaderTitle>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyMetaReveal}>
        <MetaText>
          {entry.dateRange}
          {entry.location ? ` · ${entry.location}` : ''}
        </MetaText>
      </MotionItem>
      <MotionItem variants={storyBodyReveal}>
        <BodyText>{entry.summary}</BodyText>
      </MotionItem>
      {entry.highlights && entry.highlights.length > 0 && (
        <MotionItem variants={storyBodyReveal}>{renderBulletList(entry.highlights)}</MotionItem>
      )}
    </Stack>
  );
};

const CodingSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'coding' }> }) => {
  const { data: example } = item;
  const [activeTab, setActiveTab] = useState(0);

  const primaryLink = example.links?.[0];
  let isGitHub = false;
  if (primaryLink) {
    try {
      const host = new URL(primaryLink).hostname;
      isGitHub = host === 'github.com' || host.endsWith('.github.com');
    } catch {
      // invalid URL — not GitHub
    }
  }

  const skillsTabs = (example.tabs ?? []).filter(
    (t): t is Extract<typeof t, { kind: 'skills' }> => t.kind === 'skills'
  );
  const allTabs = example.tabs ?? [];

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <HeaderLabel>Project</HeaderLabel>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <HeaderTitle>{example.title}</HeaderTitle>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyBodyReveal}>
        <BodyText>{example.description}</BodyText>
      </MotionItem>
      {primaryLink && (
        <MotionItem variants={storyLinkReveal}>
          <CommonLink href={primaryLink} target="_blank" rel="noopener noreferrer">
            {isGitHub ? 'View on GitHub' : 'View project'}
          </CommonLink>
        </MotionItem>
      )}
      {allTabs.length === 1 && skillsTabs.length === 1 && (
        <MotionItem variants={storyChipsReveal}>
          <SkillsChipList skills={skillsTabs[0].skills} animation="slide" />
        </MotionItem>
      )}
      {allTabs.length > 1 && (
        <MotionItem variants={storyBodyReveal}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 1.5 }}
          >
            {allTabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>
          {allTabs.map((tab, i) => (
            <Box key={tab.value} sx={{ display: activeTab === i ? 'block' : 'none' }}>
              {tab.kind === 'skills' ? (
                <SkillsChipList skills={tab.skills} animation="slide" />
              ) : (
                renderBulletList(tab.items, 3)
              )}
            </Box>
          ))}
        </MotionItem>
      )}
    </Stack>
  );
};

/* ── Main renderer ── */

export const CVStorySlideRenderer = ({ item }: CVStorySlideRendererProps) => {
  return (
    <motion.div
      variants={storyContentContainer}
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: 720,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        minHeight: '100%',
      }}
    >
      <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 5 }, width: '100%' }}>
        {item.kind === 'about' && <AboutSlide item={item} />}
        {item.kind === 'experience' && <ExperienceSlide item={item} />}
        {item.kind === 'education' && <EducationSlide item={item} />}
        {item.kind === 'certificate' && <CertificateSlide item={item} />}
        {item.kind === 'volunteering' && <VolunteeringSlide item={item} />}
        {item.kind === 'coding' && <CodingSlide item={item} />}
      </Box>
    </motion.div>
  );
};
