import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVSectionCard } from '../../../../src/components/cv/CVSectionCard';

jest.mock('../../../../src/components/layout/SectionCard', () => ({
  SectionCard: ({
    children,
    id,
    delayMs,
    entranceDirection,
    triggerOnView,
  }: {
    children: ReactNode;
    id?: string;
    delayMs?: number;
    entranceDirection?: string;
    triggerOnView?: boolean;
  }) => (
    <div
      id={id}
      data-testid={id ? `section-card-${id}` : 'section-card'}
      data-delay-ms={delayMs ?? 0}
      data-entrance-direction={entranceDirection ?? 'zoom'}
      data-trigger-on-view={String(triggerOnView ?? true)}
    >
      {children}
    </div>
  ),
}));

describe('CVSectionCard', () => {
  it('forwards children and motion props to SectionCard', () => {
    render(
      <ThemeProvider>
        <CVSectionCard id="cv-about" delayMs={180} entranceDirection="right" triggerOnView={false}>
          CV content
        </CVSectionCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('section-card-cv-about')).toHaveAttribute('data-delay-ms', '180');
    expect(screen.getByTestId('section-card-cv-about')).toHaveAttribute(
      'data-entrance-direction',
      'right'
    );
    expect(screen.getByTestId('section-card-cv-about')).toHaveAttribute(
      'data-trigger-on-view',
      'false'
    );
    expect(screen.getByText('CV content')).toBeInTheDocument();
  });
});
