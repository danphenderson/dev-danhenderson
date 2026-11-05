import { Link as RouterLink } from 'react-router-dom';
import type { SkillChipLink } from '../types/ui';
import { Box, Chip, Zoom } from '@mui/material';
import { AnimatedSlideList } from './AnimatedSlideList';
import { useControlledAnimatedList } from './animatedListShared';
import { useComponentStyles } from '../styles/componentStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { Text } from './text';

const ZOOM_BASE_TIMEOUT_MS = 220;

const SkillChip = ({
  skill,
  index,
  dense,
  link,
  visible,
}: {
  skill: string;
  index: number;
  dense: boolean;
  link?: SkillChipLink;
  visible: boolean;
}) => {
  const { chipWaveSx, getChipWaveDelaySx, skillsChipSx, skillsLinkChipSx } = useComponentStyles();
  const sharedProps = {
    label: (
      <Text role="inlineLabel" component="span">
        {skill}
      </Text>
    ),
    size: dense ? ('small' as const) : ('medium' as const),
    variant: 'outlined' as const,
    sx: [skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)],
  };
  return link ? (
    <Chip
      {...sharedProps}
      component={RouterLink}
      to={link.to}
      id={link.id}
      aria-label={link.accessibleLabel}
      onClick={link.onClick}
      tabIndex={visible ? 0 : -1}
      sx={[...sharedProps.sx, skillsLinkChipSx]}
    />
  ) : (
    <Chip {...sharedProps} />
  );
};

type SkillsChipListProps = {
  skills?: string[];
  links?: Partial<Record<string, SkillChipLink>>;
  dense?: boolean;
  in?: boolean;
  animation?: 'zoom' | 'slide';
  startDelayMs?: number;
  itemStaggerMs?: number;
  drawerContainer?: () => Element | null;
  keepMountedWhenExited?: boolean;
  reverseExitStagger?: boolean;
};

const ZoomSkillsChipList = ({
  skills,
  links,
  dense,
  in: inProp,
  startDelayMs,
  itemStaggerMs,
}: Required<Pick<SkillsChipListProps, 'dense' | 'in' | 'startDelayMs'>> & {
  skills: string[];
  links?: Partial<Record<string, SkillChipLink>>;
  itemStaggerMs?: number;
}) => {
  const { skillsWrapSx } = useComponentStyles();
  const { durationFactor, isMotionDisabled, itemEntries, resolvedContainerSx } =
    useControlledAnimatedList({
      items: skills,
      getItemKey: (skill, index) => `${skill}-${index}`,
      in: inProp,
      startDelayMs,
      itemStaggerMs,
      containerSx: skillsWrapSx,
    });
  const zoomTimeout = isMotionDisabled ? 0 : Math.round(ZOOM_BASE_TIMEOUT_MS * durationFactor);

  if (isMotionDisabled) {
    return (
      <Box
        sx={resolvedContainerSx}
        aria-hidden={!inProp ? true : undefined}
        style={!inProp ? { visibility: 'hidden' } : undefined}
      >
        {itemEntries.map(({ item: skill, index, key, nodeRef }) => (
          <Box key={key} ref={nodeRef}>
            <SkillChip
              skill={skill}
              index={index}
              dense={dense}
              link={links?.[skill]}
              visible={inProp}
            />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={resolvedContainerSx}>
      {itemEntries.map(({ item: skill, index, key, isEntered }) => (
        <Zoom
          key={key}
          in={isEntered}
          appear={false}
          timeout={zoomTimeout}
          easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
        >
          <Box>
            <SkillChip
              skill={skill}
              index={index}
              dense={dense}
              link={links?.[skill]}
              visible={inProp && isEntered}
            />
          </Box>
        </Zoom>
      ))}
    </Box>
  );
};

export const SkillsChipList = ({
  skills = [],
  links,
  dense = false,
  in: inProp = true,
  animation = 'zoom',
  startDelayMs = 0,
  itemStaggerMs,
  drawerContainer,
  keepMountedWhenExited = false,
  reverseExitStagger = false,
}: SkillsChipListProps) => {
  const { skillsWrapSx } = useComponentStyles();
  const filteredSkills = skills.filter(
    (skill): skill is string => typeof skill === 'string' && skill.trim().length > 0
  );

  if (filteredSkills.length === 0) {
    return null;
  }

  if (animation === 'slide') {
    return (
      <AnimatedSlideList
        items={filteredSkills}
        getItemKey={(skill, index) => `${skill}-${index}`}
        in={inProp}
        startDelayMs={startDelayMs}
        itemStaggerMs={itemStaggerMs}
        layout="wrap"
        container={drawerContainer}
        keepMountedWhenExited={keepMountedWhenExited}
        reverseExitStagger={reverseExitStagger}
        containerSx={skillsWrapSx}
        renderItem={(skill, index) => (
          <SkillChip
            skill={skill}
            index={index}
            dense={dense}
            link={links?.[skill]}
            visible={inProp}
          />
        )}
      />
    );
  }

  return (
    <ZoomSkillsChipList
      skills={filteredSkills}
      links={links}
      dense={dense}
      in={inProp}
      startDelayMs={startDelayMs}
      itemStaggerMs={itemStaggerMs}
    />
  );
};
