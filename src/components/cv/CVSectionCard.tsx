import type { ComponentProps } from 'react';
import { useComponentStyles } from '../../styles/componentStyles';
import { normalizeSxProp } from '../../utils/sx';
import { SectionCard } from '../layout/SectionCard';

type CVSectionCardProps = ComponentProps<typeof SectionCard>;

export const CVSectionCard = ({ sx, ...props }: CVSectionCardProps) => {
  const { cvSectionCardSx } = useComponentStyles();

  return <SectionCard sx={[cvSectionCardSx, ...normalizeSxProp(sx)]} {...props} />;
};
