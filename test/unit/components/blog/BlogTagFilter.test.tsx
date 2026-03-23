import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogTagFilter } from '../../../../src/components/blog/BlogTagFilter';

jest.mock('../../../../src/motion', () => ({
  MotionSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const tags = [
  { tag: 'react', count: 3 },
  { tag: 'typescript', count: 2 },
  { tag: 'design-systems', count: 1 },
];

describe('BlogTagFilter', () => {
  it('renders "All" chip and one chip per tag with count', () => {
    render(
      <ThemeProvider>
        <BlogTagFilter tags={tags} activeTag={null} onTagChange={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('react (3)')).toBeInTheDocument();
    expect(screen.getByText('typescript (2)')).toBeInTheDocument();
    expect(screen.getByText('design-systems (1)')).toBeInTheDocument();
  });

  it('returns null when the tags array is empty', () => {
    const { container } = render(
      <ThemeProvider>
        <BlogTagFilter tags={[]} activeTag={null} onTagChange={jest.fn()} />
      </ThemeProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onTagChange with null when "All" chip is clicked', () => {
    const onTagChange = jest.fn();

    render(
      <ThemeProvider>
        <BlogTagFilter tags={tags} activeTag="react" onTagChange={onTagChange} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('All'));

    expect(onTagChange).toHaveBeenCalledWith(null);
  });

  it('calls onTagChange with the tag name when a tag chip is clicked', () => {
    const onTagChange = jest.fn();

    render(
      <ThemeProvider>
        <BlogTagFilter tags={tags} activeTag={null} onTagChange={onTagChange} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('typescript (2)'));

    expect(onTagChange).toHaveBeenCalledWith('typescript');
  });

  it('calls onTagChange with null when the active tag chip is clicked again (toggle off)', () => {
    const onTagChange = jest.fn();

    render(
      <ThemeProvider>
        <BlogTagFilter tags={tags} activeTag="react" onTagChange={onTagChange} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('react (3)'));

    expect(onTagChange).toHaveBeenCalledWith(null);
  });

  it('renders the "Topics" label', () => {
    render(
      <ThemeProvider>
        <BlogTagFilter tags={tags} activeTag={null} onTagChange={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('Topics')).toBeInTheDocument();
  });
});
