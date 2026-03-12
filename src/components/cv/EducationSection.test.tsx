import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { educationInfo } from '../../data/cv';
import { EducationSection } from './EducationSection';

const mockAnimatedContentList = jest.fn();

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    mountItemsOnView?: boolean;
  }) => {
    mockAnimatedContentList(props);

    return <div>{props.items.map((item, index) => <div key={index}>{props.renderItem(item, index)}</div>)}</div>;
  },
}));

describe('EducationSection', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
  });

  it('groups highlights and skills into the shared tab panel', () => {
    render(
      <ThemeProvider>
        <EducationSection education={{ entries: [educationInfo.entries[0]] }} />
      </ThemeProvider>
    );

    expect(mockAnimatedContentList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ mountItemsOnView: true })
    );
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Highlights',
      'Coursework',
      'Skills',
    ]);
    expect(
      screen.getByText(
        'Graduate work centered on applied mathematics, numerical methods, and computational modeling for hemodynamics research.'
      )
    ).toBeVisible();
    expect(
      screen.queryByText('Pedagogical training in curriculum design, assessment, and evidence-based instruction.')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Linear Algebra')).not.toBeInTheDocument();
    expect(screen.queryByText('LaTeX')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Highlights' }));

    expect(
      screen.getByText('Pedagogical training in curriculum design, assessment, and evidence-based instruction.')
    ).toBeVisible();
    expect(screen.queryByText('Linear Algebra')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Coursework' }));

    expect(screen.getByText('Linear Algebra')).toBeVisible();
    expect(screen.getByText('Numerical Optimization')).toBeVisible();
    expect(
      screen.queryByText('Pedagogical training in curriculum design, assessment, and evidence-based instruction.')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('LaTeX')).toBeVisible();
    expect(screen.queryByText('Linear Algebra')).not.toBeInTheDocument();
  });
});
