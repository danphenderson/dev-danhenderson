import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { codingExamples } from '../../data/cv';
import { CodingExamplesSection } from './CodingExamplesSection';

const mockAnimatedContentList = jest.fn(
  ({
    items,
    renderItem,
  }: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
  }) => <div>{items.map((item, index) => <div key={index}>{renderItem(item, index)}</div>)}</div>
);

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    mountItemsOnView?: boolean;
    startDelayMs?: number;
  }) => mockAnimatedContentList(props),
}));

describe('CodingExamplesSection', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
  });

  it('waits for the section list to enter view before mounting animated work items', () => {
    render(
      <ThemeProvider>
        <CodingExamplesSection examples={[codingExamples[0]]} startDelayMs={120} />
      </ThemeProvider>
    );

    expect(mockAnimatedContentList.mock.calls[0][0]).toEqual(expect.objectContaining({
      mountItemsOnView: true,
      startDelayMs: 120,
    }));
  });
});
