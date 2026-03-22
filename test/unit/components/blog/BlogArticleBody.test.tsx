import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogArticleBody } from '../../../../src/components/blog/BlogArticleBody';
import type { BlogContentBlock } from '../../../../src/types/blog';

jest.mock('../../../../src/motion', () => ({
  MotionSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('BlogArticleBody', () => {
  const renderBody = (content: BlogContentBlock[]) =>
    render(
      <ThemeProvider>
        <BlogArticleBody content={content} />
      </ThemeProvider>
    );

  it('renders a paragraph block', () => {
    renderBody([{ type: 'paragraph', text: 'Hello world paragraph.' }]);

    expect(screen.getByText('Hello world paragraph.')).toBeInTheDocument();
  });

  it('renders a heading block with the correct level', () => {
    renderBody([{ type: 'heading', level: 2, text: 'Section Title' }]);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Section Title');
  });

  it('renders a heading block with level 3', () => {
    renderBody([{ type: 'heading', level: 3, text: 'Subsection' }]);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Subsection');
  });

  it('renders a heading block with level 4', () => {
    renderBody([{ type: 'heading', level: 4, text: 'Minor heading' }]);

    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toHaveTextContent('Minor heading');
  });

  it('renders level 3 and level 4 headings with distinct typesets', () => {
    renderBody([
      { type: 'heading', level: 3, text: 'Subsection' },
      { type: 'heading', level: 4, text: 'Minor heading' },
    ]);

    const level3 = screen.getByRole('heading', { level: 3 });
    const level4 = screen.getByRole('heading', { level: 4 });

    expect(level3).toHaveClass('MuiTypography-h6');
    expect(level4).toHaveClass('MuiTypography-subtitle1');
  });

  it('renders a heading block with a custom id', () => {
    renderBody([{ type: 'heading', level: 2, text: 'Custom ID Heading', id: 'custom-heading' }]);

    expect(document.getElementById('custom-heading')).toBeInTheDocument();
  });

  it('renders a heading block with an auto-generated slug id when no id is provided', () => {
    renderBody([{ type: 'heading', level: 2, text: 'Auto Slug Heading' }]);

    expect(document.getElementById('auto-slug-heading')).toBeInTheDocument();
  });

  it('renders a code block with language and code content', () => {
    renderBody([{ type: 'code', language: 'typescript', code: 'const x = 1;' }]);

    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('renders a blockquote block', () => {
    renderBody([{ type: 'blockquote', text: 'A wise quote.' }]);

    expect(screen.getByText('A wise quote.')).toBeInTheDocument();
  });

  it('renders a callout block', () => {
    renderBody([{ type: 'callout', variant: 'tip', title: 'Pro Tip', text: 'Use hooks.' }]);

    expect(screen.getByText('Pro Tip')).toBeInTheDocument();
    expect(screen.getByText('Use hooks.')).toBeInTheDocument();
  });

  it('renders an image block with alt text', () => {
    renderBody([{ type: 'image', src: '/photo.jpg', alt: 'Photo description' }]);

    const img = screen.getByRole('img', { name: 'Photo description' });
    expect(img).toHaveAttribute('src', '/photo.jpg');
  });

  it('renders an image caption when provided', () => {
    renderBody([
      { type: 'image', src: '/photo.jpg', alt: 'Photo', caption: 'Figure 1: Architecture' },
    ]);

    expect(screen.getByText('Figure 1: Architecture')).toBeInTheDocument();
  });

  it('renders an unordered list block', () => {
    renderBody([{ type: 'list', ordered: false, items: ['Item one', 'Item two'] }]);

    expect(screen.getByText('Item one')).toBeInTheDocument();
    expect(screen.getByText('Item two')).toBeInTheDocument();
  });

  it('renders an ordered list block', () => {
    renderBody([{ type: 'list', ordered: true, items: ['First', 'Second'] }]);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders a divider block', () => {
    renderBody([{ type: 'divider' }]);

    expect(document.querySelector('hr')).toBeInTheDocument();
  });

  it('renders multiple block types in order', () => {
    renderBody([
      { type: 'paragraph', text: 'First paragraph.' },
      { type: 'heading', level: 2, text: 'A Heading' },
      { type: 'paragraph', text: 'Second paragraph.' },
    ]);

    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A Heading');
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
  });
});
