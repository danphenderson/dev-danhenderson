import { Chip } from '@mui/material';
import { AnimatedZoomList } from './AnimatedZoomList';
import { useComponentStyles } from '../styles/componentStyles';

type SkillsChipListProps = {
  skills?: string[];
  dense?: boolean;
  in?: boolean;
};

export const SkillsChipList = ({
  skills = [],
  dense = false,
  in: inProp = true,
}: SkillsChipListProps) => {
  const { chipWaveSx, getChipWaveDelaySx, skillsChipSx, skillsWrapSx } = useComponentStyles();
  const filteredSkills = skills.filter((skill): skill is string => typeof skill === 'string' && skill.trim().length > 0);

  if (filteredSkills.length === 0) {
    return null;
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
          label={skill}
          size={dense ? 'small' : 'medium'}
          variant="outlined"
          sx={[skillsChipSx, chipWaveSx, getChipWaveDelaySx(index)]}
        />
      )}
    />
  );
};
