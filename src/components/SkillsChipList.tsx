import { Box, Chip, Zoom } from '@mui/material';
import { AnimatedSlideList } from './AnimatedSlideList';
import { useControlledAnimatedList } from './animatedListShared';
import { useComponentStyles } from '../styles/componentStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { Text } from './text';

const ZOOM_BASE_TIMEOUT_MS = 220;

type SkillsChipListProps = {
  skills?: string[];
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
  dense,
  in: inProp,
  startDelayMs,
  itemStaggerMs,
}: Required<Pick<SkillsChipListProps, 'dense' | 'in' | 'startDelayMs'>> & {
  skills: string[];
  itemStaggerMs?: number;
}) => {
  const { chipWaveSx, getChipWaveDelaySx, skillsChipSx, skillsWrapSx } = useComponentStyles();
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
            <Chip
              label={
                <Text role="inlineLabel" component="span">
                  {skill}
                </Text>
              }
              size={dense ? 'small' : 'medium'}
              variant="outlined"
              sx={[skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)]}
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
            <Chip
              label={
                <Text role="inlineLabel" component="span">
                  {skill}
                </Text>
              }
              size={dense ? 'small' : 'medium'}
              variant="outlined"
              sx={[skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)]}
            />
          </Box>
        </Zoom>
      ))}
    </Box>
  );
};

export const SkillsChipList = ({
  skills = [],
  dense = false,
  in: inProp = true,
  animation = 'zoom',
  startDelayMs = 0,
  itemStaggerMs,
  drawerContainer,
  keepMountedWhenExited = false,
  reverseExitStagger = false,
}: SkillsChipListProps) => {
  const { chipWaveSx, getChipWaveDelaySx, skillsChipSx, skillsWrapSx } = useComponentStyles();
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
          <Chip
            key={`${skill}-${index}`}
            label={
              <Text role="inlineLabel" component="span">
                {skill}
              </Text>
            }
            size={dense ? 'small' : 'medium'}
            variant="outlined"
            sx={[skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)]}
          />
        )}
      />
    );
  }

  return (
    <ZoomSkillsChipList
      skills={filteredSkills}
      dense={dense}
      in={inProp}
      startDelayMs={startDelayMs}
      itemStaggerMs={itemStaggerMs}
    />
  );
};
