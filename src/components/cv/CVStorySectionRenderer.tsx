import type { ReactNode, RefObject } from 'react';
import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Box, Divider, Stack, Tabs, Tab } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { Text } from '../text';
import { SkillsChipList } from '../SkillsChipList';
import { CommonLink } from '../CommonLink';
import {
  MotionSection,
  MotionItem,
  useMotionScale,
  duration,
  DEFAULT_INTERSECTION_ROOT_MARGIN,
  DEFAULT_INTERSECTION_THRESHOLD,
} from '../../motion';
import {
  renderExperienceDescriptionContent,
  renderExperienceProjectContent,
  renderExperienceSegments,
} from './experienceContent';
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
  storyDividerReveal,
} from '../../motion/variants';
import type { CVStoryItem, CVStoryContactChannel } from '../../types/cv';

type CVStorySectionRendererProps = {
  item: CVStoryItem;
  index: number;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
};

const asMotionMargin = (margin: string) =>
  margin as Parameters<typeof useInView>[1] extends { margin?: infer Margin } ? Margin : never;

const StorySkillsChipList = ({
  skills,
  scrollContainerRef,
}: {
  skills: string[];
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { duration: durationFactor } = useMotionScale();
  const isRowInView = useInView(rowRef, {
    once: true,
    root: scrollContainerRef,
    margin: asMotionMargin(DEFAULT_INTERSECTION_ROOT_MARGIN),
    amount: DEFAULT_INTERSECTION_THRESHOLD || undefined,
  });

  return (
    <MotionItem variants={storyChipsReveal}>
      <Box ref={rowRef}>
        <SkillsChipList
          skills={skills}
          in={durationFactor === 0 || isRowInView}
          animation="slide"
          startDelayMs={Math.round(duration.normal * 1000)}
        />
      </Box>
    </MotionItem>
  );
};

/* ── Rendering helpers (not exported) ── */
const renderBulletList = (items: ReactNode[], max?: number): ReactNode => {
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
          <Text role="body">{item}</Text>
        </motion.li>
      ))}
    </motion.ul>
  );
};

const channelIcon: Record<CVStoryContactChannel['icon'], ReactNode> = {
  email: <EmailOutlinedIcon sx={{ fontSize: 20 }} />,
  github: <GitHubIcon sx={{ fontSize: 20 }} />,
  linkedin: <LinkedInIcon sx={{ fontSize: 20 }} />,
  web: <LanguageIcon sx={{ fontSize: 20 }} />,
};

/* ── Section divider between kind transitions ── */

const StorySectionDivider = () => (
  <MotionSection variants={storyDividerReveal} rootMargin="0px 0px -5% 0px">
    <Divider
      sx={{
        maxWidth: 120,
        mx: 'auto',
        my: { xs: 2, sm: 3 },
        borderColor: 'divider',
      }}
    />
  </MotionSection>
);

/* ── Per-kind section layouts ── */

const AboutSection = ({
  item,
  scrollContainerRef,
}: {
  item: Extract<CVStoryItem, { kind: 'about' }>;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
}) => {
  const { data: about } = item;

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <Text role="sectionEyebrow" tone="support">
            About
          </Text>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <Text role="sectionTitle">{about.name}</Text>
        </MotionItem>
        <MotionItem variants={storyMetaReveal}>
          <Text role="metaStrong" sx={{ display: 'inline' }}>
            {about.title}
          </Text>
          <Text role="meta" sx={{ display: 'inline' }}>
            {' '}
            •{' '}
          </Text>
          <Text role="meta" sx={{ display: 'inline' }}>
            {about.location}
          </Text>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyBodyReveal}>
        <Text role="body" sx={{ whiteSpace: 'pre-line', lineHeight: 1.75 }}>
          {about.bio}
        </Text>
      </MotionItem>
      {about.opportunities && about.opportunities.length > 0 && (
        <StorySkillsChipList skills={about.opportunities} scrollContainerRef={scrollContainerRef} />
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

const ExperienceSection = ({
  item,
  scrollContainerRef,
}: {
  item: Extract<CVStoryItem, { kind: 'experience' }>;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
}) => {
  const { data: exp } = item;

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <Text role="sectionEyebrow" tone="support">
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
          </Text>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <Text role="sectionTitle">{exp.title}</Text>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyMetaReveal}>
        <Text role="meta">
          {exp.startDate} – {exp.endDate}
          {exp.industry ? ` · ${exp.industry}` : ''}
        </Text>
      </MotionItem>
      {exp.description && (
        <MotionItem variants={storyBodyReveal}>
          <Text role="body">{renderExperienceDescriptionContent(exp.description)}</Text>
        </MotionItem>
      )}
      {exp.projects && exp.projects.length > 0 && (
        <MotionItem variants={storyBodyReveal}>
          {renderBulletList(exp.projects.map(renderExperienceProjectContent))}
        </MotionItem>
      )}
      {exp.skills && exp.skills.length > 0 && (
        <StorySkillsChipList skills={exp.skills} scrollContainerRef={scrollContainerRef} />
      )}
    </Stack>
  );
};

const EducationSection = ({
  item,
  scrollContainerRef,
}: {
  item: Extract<CVStoryItem, { kind: 'education' }>;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
}) => {
  const { data: entry } = item;

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <Text role="sectionEyebrow" tone="support">
            {entry.university}
          </Text>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <Text role="sectionTitle">{entry.program}</Text>
        </MotionItem>
      </Stack>
      <Stack spacing={0.5}>
        <MotionItem variants={storyMetaReveal}>
          <Text role="meta">{entry.dateRange ?? entry.expectedCompletion ?? ''}</Text>
        </MotionItem>
        {entry.gpa && entry.gpa.length > 0 && (
          <MotionItem variants={storyMetaReveal}>
            <Text role="meta">{entry.gpa.map((g) => `${g.label}: ${g.value}`).join('  ·  ')}</Text>
          </MotionItem>
        )}
      </Stack>
      <MotionItem variants={storyBodyReveal}>
        <Text role="body">{entry.summary}</Text>
      </MotionItem>
      {entry.highlights && entry.highlights.length > 0 && (
        <MotionItem variants={storyBodyReveal}>{renderBulletList(entry.highlights)}</MotionItem>
      )}
      {entry.skills && entry.skills.length > 0 && (
        <StorySkillsChipList skills={entry.skills} scrollContainerRef={scrollContainerRef} />
      )}
    </Stack>
  );
};

const CertificateSection = ({ item }: { item: Extract<CVStoryItem, { kind: 'certificate' }> }) => {
  const { data: cert } = item;
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <MotionItem variants={storyLabelReveal}>
        <Text role="sectionEyebrow" tone="support">
          {cert.issuer}
        </Text>
      </MotionItem>
      <MotionItem variants={storyTitleReveal}>
        <Text role="sectionTitle">{cert.title}</Text>
      </MotionItem>
      <MotionItem variants={storyMetaReveal}>
        <Text role="meta">{cert.date}</Text>
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

const VolunteeringSection = ({
  item,
}: {
  item: Extract<CVStoryItem, { kind: 'volunteering' }>;
}) => {
  const { data: entry } = item;
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <MotionItem variants={storyLabelReveal}>
          <Text role="sectionEyebrow" tone="support">
            {entry.organizationUrl ? (
              <CommonLink href={entry.organizationUrl} target="_blank" rel="noopener noreferrer">
                {entry.organization}
              </CommonLink>
            ) : (
              entry.organization
            )}
          </Text>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <Text role="sectionTitle">{entry.role}</Text>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyMetaReveal}>
        <Text role="meta">
          {entry.dateRange}
          {entry.location ? ` · ${entry.location}` : ''}
        </Text>
      </MotionItem>
      <MotionItem variants={storyBodyReveal}>
        <Text role="body">{entry.summary}</Text>
      </MotionItem>
      {entry.highlights && entry.highlights.length > 0 && (
        <MotionItem variants={storyBodyReveal}>{renderBulletList(entry.highlights)}</MotionItem>
      )}
    </Stack>
  );
};

const CodingSection = ({
  item,
  scrollContainerRef,
}: {
  item: Extract<CVStoryItem, { kind: 'coding' }>;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
}) => {
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
          <Text role="sectionEyebrow" tone="support">
            Project
          </Text>
        </MotionItem>
        <MotionItem variants={storyTitleReveal}>
          <Text role="sectionTitle">{example.title}</Text>
        </MotionItem>
      </Stack>
      <MotionItem variants={storyBodyReveal}>
        <Text role="body">{example.description}</Text>
      </MotionItem>
      {primaryLink && (
        <MotionItem variants={storyLinkReveal}>
          <CommonLink href={primaryLink} target="_blank" rel="noopener noreferrer">
            {isGitHub ? 'View on GitHub' : 'View project'}
          </CommonLink>
        </MotionItem>
      )}
      {allTabs.length === 1 && skillsTabs.length === 1 && (
        <StorySkillsChipList
          skills={skillsTabs[0].skills}
          scrollContainerRef={scrollContainerRef}
        />
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
                renderBulletList(
                  tab.items.map((item) =>
                    Array.isArray(item) ? renderExperienceSegments(item) : item
                  ),
                  3
                )
              )}
            </Box>
          ))}
        </MotionItem>
      )}
    </Stack>
  );
};

const EndSection = ({ item }: { item: Extract<CVStoryItem, { kind: 'end' }> }) => {
  const { data: endData } = item;
  return (
    <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <MotionItem variants={storyTitleReveal}>
        <Text role="sectionTitle">{endData.headline}</Text>
      </MotionItem>
      <MotionItem variants={storyBodyReveal}>
        <Text role="body" sx={{ maxWidth: 520, mx: 'auto', lineHeight: 1.75 }}>
          {endData.body}
        </Text>
      </MotionItem>
      <MotionItem variants={storyChipsReveal}>
        <Stack spacing={1.5} sx={{ alignItems: 'center', mt: 1 }}>
          {endData.channels.map((channel) => (
            <CommonLink
              key={channel.url}
              href={channel.url}
              target={channel.icon === 'email' ? undefined : '_blank'}
              rel={channel.icon === 'email' ? undefined : 'noopener noreferrer'}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {channelIcon[channel.icon]}
              {channel.label}
            </CommonLink>
          ))}
        </Stack>
      </MotionItem>
    </Stack>
  );
};

/* ── Main renderer — scroll-triggered section wrapper ── */

export const CVStorySectionRenderer = ({
  item,
  index,
  scrollContainerRef,
}: CVStorySectionRendererProps) => {
  const isFirstItem = index === 0;

  return (
    <>
      {!isFirstItem && <StorySectionDivider />}
      <MotionSection
        variants={storyContentContainer}
        rootMargin="0px 0px -8% 0px"
        once
        style={{
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 }, width: '100%' }}>
          {item.kind === 'about' && (
            <AboutSection item={item} scrollContainerRef={scrollContainerRef} />
          )}
          {item.kind === 'experience' && (
            <ExperienceSection item={item} scrollContainerRef={scrollContainerRef} />
          )}
          {item.kind === 'education' && (
            <EducationSection item={item} scrollContainerRef={scrollContainerRef} />
          )}
          {item.kind === 'certificate' && <CertificateSection item={item} />}
          {item.kind === 'volunteering' && <VolunteeringSection item={item} />}
          {item.kind === 'coding' && (
            <CodingSection item={item} scrollContainerRef={scrollContainerRef} />
          )}
          {item.kind === 'end' && <EndSection item={item} />}
        </Box>
      </MotionSection>
    </>
  );
};
