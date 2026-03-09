import { ComponentProps } from 'react';
import { AnimatedContentCard } from '../AnimatedContentCard';

type SectionCardProps = ComponentProps<typeof AnimatedContentCard>;

export const SectionCard = (props: SectionCardProps) => <AnimatedContentCard {...props} />;
