import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { Text } from '../../../../src/components/text/Text';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Text component', () => {
  /* ── Role rendering ─────────────────────────────────── */

  it('renders sectionTitle with the correct default element', () => {
    render(<Text role="sectionTitle">Projects</Text>, { wrapper });

    const el = screen.getByText('Projects');

    expect(el.tagName).toBe('H2');
  });

  it('renders body text as a paragraph', () => {
    render(<Text role="body">Some text</Text>, { wrapper });

    const el = screen.getByText('Some text');

    expect(el.tagName).toBe('P');
  });

  it('renders proseTitle as h1 by default', () => {
    render(<Text role="proseTitle">Article Title</Text>, { wrapper });

    const el = screen.getByText('Article Title');

    expect(el.tagName).toBe('H1');
  });

  it('renders caption as a span', () => {
    render(<Text role="caption">Tiny text</Text>, { wrapper });

    const el = screen.getByText('Tiny text');

    expect(el.tagName).toBe('SPAN');
  });

  it('renders sectionEyebrow as a span', () => {
    render(<Text role="sectionEyebrow">LABEL</Text>, { wrapper });

    const el = screen.getByText('LABEL');

    expect(el.tagName).toBe('SPAN');
  });

  it('renders proseListItem as an li', () => {
    render(
      <ul>
        <Text role="proseListItem">Item one</Text>
      </ul>,
      { wrapper }
    );

    const el = screen.getByText('Item one');

    expect(el.tagName).toBe('LI');
  });

  /* ── Component override ─────────────────────────────── */

  it('allows overriding the default element via component prop', () => {
    render(
      <Text role="sectionTitle" component="h3">
        Custom heading
      </Text>,
      { wrapper }
    );

    const el = screen.getByText('Custom heading');

    expect(el.tagName).toBe('H3');
  });

  it('renders proseTitle as h2 when component is overridden', () => {
    render(
      <Text role="proseTitle" component="h2">
        Blog Title
      </Text>,
      { wrapper }
    );

    const el = screen.getByText('Blog Title');

    expect(el.tagName).toBe('H2');
  });

  /* ── Tone ───────────────────────────────────────────── */

  it('renders with muted tone', () => {
    render(
      <Text role="body" tone="muted">
        Muted text
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Muted text')).toBeInTheDocument();
  });

  it('renders with inverse tone', () => {
    render(
      <Text role="cardTitle" tone="inverse" context="overlay">
        Album Name
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Album Name')).toBeInTheDocument();
  });

  it('renders with accent tone', () => {
    render(
      <Text role="sectionEyebrow" tone="accent">
        Featured
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  /* ── Extra props ────────────────────────────────────── */

  it('passes id to the rendered element', () => {
    render(
      <Text role="proseHeading" id="section-1">
        Section One
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Section One')).toHaveAttribute('id', 'section-1');
  });

  it('passes className to the rendered element', () => {
    render(
      <Text role="body" className="custom-class">
        Classed
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Classed')).toHaveClass('custom-class');
  });

  it('merges caller sx with typeset defaults', () => {
    render(
      <Text role="body" sx={{ mt: 5 }}>
        Styled
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Styled').tagName).toBe('P');
  });

  /* ── Context ────────────────────────────────────────── */

  it('accepts prose context', () => {
    render(
      <Text role="proseParagraph" context="prose">
        Reading text
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Reading text')).toBeInTheDocument();
  });

  it('accepts overlay context', () => {
    render(
      <Text role="cardTitle" context="overlay" tone="inverse">
        Overlay Title
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Overlay Title')).toBeInTheDocument();
  });

  /* ── All UI roles render without error ──────────────── */

  const uiRoles = [
    'pageTitle',
    'pageSubtitle',
    'sectionEyebrow',
    'sectionTitle',
    'sectionSubtitle',
    'subsectionTitle',
    'cardTitle',
    'cardSubtitle',
    'body',
    'bodyMuted',
    'meta',
    'metaStrong',
    'caption',
    'label',
    'metricValue',
    'metricLabel',
  ] as const;

  it.each(uiRoles)('renders UI role "%s" without error', (role) => {
    render(<Text role={role}>test-{role}</Text>, { wrapper });

    expect(screen.getByText(`test-${role}`)).toBeInTheDocument();
  });

  /* ── All prose roles render without error ────────────── */

  const proseRoles = [
    'proseTitle',
    'proseLead',
    'proseHeading',
    'proseSubheading',
    'proseParagraph',
    'proseCaption',
    'proseQuote',
    'proseListItem',
  ] as const;

  it.each(proseRoles)('renders prose role "%s" without error', (role) => {
    const container = role === 'proseListItem' ? document.createElement('ul') : undefined;
    render(<Text role={role}>test-{role}</Text>, {
      wrapper,
      ...(container ? { container: document.body.appendChild(container) } : {}),
    });

    expect(screen.getByText(`test-${role}`)).toBeInTheDocument();
  });
});
