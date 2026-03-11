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
    expect(screen.getByRole('tab', { name: 'Highlights' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeInTheDocument();
    expect(
      screen.queryByText('Pedagogical training in curriculum design, assessment, and evidence-based instruction.')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('LaTeX')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('LaTeX')).toBeVisible();
    expect(
      screen.queryByText('Pedagogical training in curriculum design, assessment, and evidence-based instruction.')
    ).not.toBeInTheDocument();
  });
});
