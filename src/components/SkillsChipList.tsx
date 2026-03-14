import { Chip } from '@mui/material';
import { AnimatedSlideList } from './AnimatedSlideList';
import { AnimatedZoomList } from './AnimatedZoomList';
import { useComponentStyles } from '../styles/componentStyles';
import { ChipLabel } from './text';

type SkillsChipListProps = {
  skills?: string[];
  dense?: boolean;
  in?: boolean;
  animation?: 'zoom' | 'slide';
  drawerContainer?: () => Element | null;
  keepMountedWhenExited?: boolean;
};

export const SkillsChipList = ({
  skills = [],
  dense = false,
  in: inProp = true,
  animation = 'zoom',
  drawerContainer,
  keepMountedWhenExited = false,
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
        layout="wrap"
        container={drawerContainer}
        keepMountedWhenExited={keepMountedWhenExited}
        containerSx={skillsWrapSx}
        renderItem={(skill, index) => (
          <Chip
            key={`${skill}-${index}`}
            label={<ChipLabel>{skill}</ChipLabel>}
            size={dense ? 'small' : 'medium'}
            variant="outlined"
            sx={[skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)]}
          />
        )}
      />
    );
  }

  return (
    <AnimatedZoomList
      items={filteredSkills}
      getItemKey={(skill, index) => `${skill}-${index}`}
      in={inProp}
      containerSx={skillsWrapSx}
      renderItem={(skill, index) => (
        <Chip
          key={`${skill}-${index}`}
          label={<ChipLabel>{skill}</ChipLabel>}
          size={dense ? 'small' : 'medium'}
          variant="outlined"
          sx={[skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)]}
        />
      )}
    />
  );
};
