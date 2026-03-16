import { Fragment, type ReactNode, useState } from 'react';
import { motion } from 'motion/react';
import { Box, Tabs, Tab } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { HeaderLabel, HeaderTitle, StrongMetaText, MetaText, BodyText } from '../text';
import { SkillsChipList } from '../SkillsChipList';
import { CommonLink } from '../CommonLink';
import { MotionItem } from '../../motion';
import { slideContentContainer, slideContentItem } from '../../motion/variants';
import type { CVStoryItem } from '../../data/cvStoryItems';
import type { ExperienceDescription, ExperienceProjectSegment } from '../../types/cv';
import { githubProfileUrl } from '../../data/cv';

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
    <Box component="ul" sx={{ pl: 2.5, m: 0, listStyleType: '"– "' }}>
      {visible.map((item, i) => (
        <Box component="li" key={i}>
          <BodyText>{item}</BodyText>
        </Box>
      ))}
    </Box>
  );
};

/* ── Per-kind slide layouts ── */

const AboutSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'about' }> }) => {
  const { data: about } = item;
  return (
    <>
      <MotionItem variants={slideContentItem}>
        <HeaderLabel>About</HeaderLabel>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <HeaderTitle>{about.name}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <StrongMetaText sx={{ display: 'inline' }}>{about.title}</StrongMetaText>
        <MetaText sx={{ display: 'inline' }}> • </MetaText>
        <MetaText sx={{ display: 'inline' }}>{about.location}</MetaText>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <BodyText sx={{ whiteSpace: 'pre-line', lineHeight: 1.75 }}>{about.bio}</BodyText>
      </MotionItem>
      {about.opportunities && about.opportunities.length > 0 && (
        <MotionItem variants={slideContentItem}>
          <SkillsChipList skills={about.opportunities} animation="slide" />
        </MotionItem>
      )}
      {about.bioLink && (
        <MotionItem variants={slideContentItem}>
          <CommonLink href={about.bioLink.url} target="_blank" rel="noopener noreferrer">
            {about.bioLink.text}
          </CommonLink>
        </MotionItem>
      )}
    </>
  );
};

const ExperienceSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'experience' }> }) => {
  const { data: exp } = item;
  return (
    <>
      <MotionItem variants={slideContentItem}>
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
      <MotionItem variants={slideContentItem}>
        <HeaderTitle>{exp.title}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <MetaText>
          {exp.startDate} – {exp.endDate}
        </MetaText>
      </MotionItem>
      {exp.description && (
        <MotionItem variants={slideContentItem}>
          {renderExperienceDescription(exp.description)}
        </MotionItem>
      )}
      {exp.skills && exp.skills.length > 0 && (
        <MotionItem variants={slideContentItem}>
          <SkillsChipList skills={exp.skills} animation="slide" />
        </MotionItem>
      )}
    </>
  );
};

const EducationSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'education' }> }) => {
  const { data: entry } = item;
  return (
    <>
      <MotionItem variants={slideContentItem}>
        <HeaderLabel>{entry.university}</HeaderLabel>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <HeaderTitle>{entry.program}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <MetaText>{entry.dateRange ?? entry.expectedCompletion ?? ''}</MetaText>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <BodyText>{entry.summary}</BodyText>
      </MotionItem>
      {entry.gpa && entry.gpa.length > 0 && (
        <MotionItem variants={slideContentItem}>
          <MetaText>
            {entry.gpa.map((g) => `${g.label}: ${g.value}`).join('  ·  ')}
          </MetaText>
        </MotionItem>
      )}
      {entry.highlights && entry.highlights.length > 0 && (
        <MotionItem variants={slideContentItem}>
          {renderBulletList(entry.highlights, 4)}
        </MotionItem>
      )}
      {entry.skills && entry.skills.length > 0 && (
        <MotionItem variants={slideContentItem}>
          <SkillsChipList skills={entry.skills} animation="slide" />
        </MotionItem>
      )}
    </>
  );
};

const CertificateSlide = ({ item }: { item: Extract<CVStoryItem, { kind: 'certificate' }> }) => {
  const { data: cert } = item;
  return (
    <>
      <MotionItem variants={slideContentItem}>
        <HeaderLabel>{cert.issuer}</HeaderLabel>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <HeaderTitle>{cert.title}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <MetaText>{cert.date}</MetaText>
      </MotionItem>
      {cert.link && (
        <MotionItem variants={slideContentItem}>
          <CommonLink href={cert.link} target="_blank" rel="noopener noreferrer">
            View certificate
          </CommonLink>
        </MotionItem>
      )}
    </>
  );
};

const VolunteeringSlide = ({
  item,
}: {
  item: Extract<CVStoryItem, { kind: 'volunteering' }>;
}) => {
  const { data: entry } = item;
  return (
    <>
      <MotionItem variants={slideContentItem}>
        <HeaderLabel>
          {entry.organizationUrl ? (
            <CommonLink
              href={entry.organizationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.organization}
            </CommonLink>
          ) : (
            entry.organization
          )}
        </HeaderLabel>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <HeaderTitle>{entry.role}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <MetaText>
          {entry.dateRange}
          {entry.location ? ` · ${entry.location}` : ''}
        </MetaText>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <BodyText>{entry.summary}</BodyText>
      </MotionItem>
      {entry.highlights && entry.highlights.length > 0 && (
        <MotionItem variants={slideContentItem}>
          {renderBulletList(entry.highlights)}
        </MotionItem>
      )}
    </>
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
    <>
      <MotionItem variants={slideContentItem}>
        <HeaderLabel>Project</HeaderLabel>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <HeaderTitle>{example.title}</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <BodyText>{example.description}</BodyText>
      </MotionItem>
      {primaryLink && (
        <MotionItem variants={slideContentItem}>
          <Box>
            <CommonLink href={primaryLink} target="_blank" rel="noopener noreferrer">
              {isGitHub ? 'View on GitHub' : 'View project'}
            </CommonLink>
          </Box>
        </MotionItem>
      )}
      {allTabs.length === 1 && skillsTabs.length === 1 && (
        <MotionItem variants={slideContentItem}>
          <SkillsChipList skills={skillsTabs[0].skills} animation="slide" />
        </MotionItem>
      )}
      {allTabs.length > 1 && (
        <MotionItem variants={slideContentItem}>
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
    </>
  );
};

const EndSlide = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <MotionItem variants={slideContentItem}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1 }}>
          {imgError ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                borderRadius: '50%',
                bgcolor: 'action.hover',
              }}
            >
              <GitHubIcon sx={{ fontSize: { xs: 72, sm: 96 }, color: 'text.primary' }} />
            </Box>
          ) : (
            <Box
              component="img"
              src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
              alt="GitHub Octocat"
              onError={() => setImgError(true)}
              sx={{ width: { xs: 120, sm: 160 }, height: 'auto' }}
            />
          )}
        </Box>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <HeaderTitle sx={{ textAlign: 'center' }}>You made it to the end!</HeaderTitle>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <BodyText sx={{ textAlign: 'center' }}>
          Thanks for taking a look at my story. Feel free to explore the full interactive CV or
          check out my work on GitHub.
        </BodyText>
      </MotionItem>
      <MotionItem variants={slideContentItem}>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <CommonLink href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
            View my GitHub profile
          </CommonLink>
        </Box>
      </MotionItem>
    </>
  );
};

/* ── Main renderer ── */

export const CVStorySlideRenderer = ({ item }: CVStorySlideRendererProps) => {
  return (
    <motion.div
      variants={slideContentContainer}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: 680, margin: '0 auto' }}
    >
      <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 5 } }}>
        {item.kind === 'about' && <AboutSlide item={item} />}
        {item.kind === 'experience' && <ExperienceSlide item={item} />}
        {item.kind === 'education' && <EducationSlide item={item} />}
        {item.kind === 'certificate' && <CertificateSlide item={item} />}
        {item.kind === 'volunteering' && <VolunteeringSlide item={item} />}
        {item.kind === 'coding' && <CodingSlide item={item} />}
        {item.kind === 'end' && <EndSlide />}
      </Box>
    </motion.div>
  );
};
