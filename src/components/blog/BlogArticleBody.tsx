import { Box, Divider, Typography } from '@mui/material';
import { BlogCodeBlock } from './BlogCodeBlock';
import { BlogBlockquote } from './BlogBlockquote';
import { BlogCallout } from './BlogCallout';
import { MotionSection } from '../../motion';
import type { BlogContentBlock } from '../../types/blog';

type BlogArticleBodyProps = {
  content: BlogContentBlock[];
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function HeadingBlock({ level, text, id }: { level: 2 | 3 | 4; text: string; id?: string }) {
  const anchorId = id ?? slugify(text);
  const variant = level === 2 ? 'h4' : level === 3 ? 'h5' : 'h6';
  const component = `h${level}` as 'h2' | 'h3' | 'h4';

  return (
    <Typography
      id={anchorId}
      variant={variant}
      component={component}
      sx={{
        fontWeight: 700,
        mt: level === 2 ? 4 : 3,
        mb: 1.5,
        scrollMarginTop: 80,
        lineHeight: 1.3,
        '& a': {
          color: 'inherit',
          textDecoration: 'none',
        },
      }}
    >
      <a href={`#${anchorId}`}>{text}</a>
    </Typography>
  );
}

function renderBlock(block: BlogContentBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            lineHeight: 1.8,
            mb: 2,
            color: 'text.primary',
            fontSize: '1.02rem',
          }}
        >
          {block.text}
        </Typography>
      );

    case 'heading':
      return <HeadingBlock key={index} level={block.level} text={block.text} id={block.id} />;

    case 'code':
      return (
        <BlogCodeBlock
          key={index}
          language={block.language}
          code={block.code}
          filename={block.filename}
          caption={block.caption}
        />
      );

    case 'blockquote':
      return <BlogBlockquote key={index} text={block.text} attribution={block.attribution} />;

    case 'callout':
      return (
        <BlogCallout key={index} variant={block.variant} title={block.title} text={block.text} />
      );

    case 'image':
      return (
        <Box key={index} sx={{ my: 3, textAlign: 'center' }}>
          <Box
            component="img"
            src={block.src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            sx={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              display: 'block',
              mx: 'auto',
            }}
          />
          {block.caption && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              {block.caption}
            </Typography>
          )}
        </Box>
      );

    case 'list':
      return (
        <Box
          key={index}
          component={block.ordered ? 'ol' : 'ul'}
          sx={{
            my: 2,
            pl: 3,
            '& li': {
              mb: 0.75,
              lineHeight: 1.7,
              color: 'text.primary',
              fontSize: '1.02rem',
            },
          }}
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </Box>
      );

    case 'divider':
      return (
        <Divider
          key={index}
          sx={{
            my: 4,
            borderColor: 'divider',
            opacity: 0.5,
          }}
        />
      );

    default:
      return null;
  }
}

/** Groups consecutive content blocks for batched scroll-triggered reveals. */
function groupBlocks(content: BlogContentBlock[], groupSize = 3): BlogContentBlock[][] {
  const groups: BlogContentBlock[][] = [];
  for (let i = 0; i < content.length; i += groupSize) {
    groups.push(content.slice(i, i + groupSize));
  }
  return groups;
}

export function BlogArticleBody({ content }: BlogArticleBodyProps) {
  const groups = groupBlocks(content);

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: 'auto',
        px: { xs: 0, sm: 1 },
      }}
    >
      {groups.map((group, groupIndex) => (
        <MotionSection key={groupIndex}>
          {group.map((block, blockIndex) => renderBlock(block, groupIndex * 3 + blockIndex))}
        </MotionSection>
      ))}
    </Box>
  );
}
