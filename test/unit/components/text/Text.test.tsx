import { fireEvent, render, screen } from '@testing-library/react';
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

  it('renders proseMinorHeading as h4 by default', () => {
    render(<Text role="proseMinorHeading">Minor heading</Text>, { wrapper });

    const el = screen.getByText('Minor heading');

    expect(el.tagName).toBe('H4');
    expect(el).toHaveClass('MuiTypography-subtitle1');
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

  it('renders settingsSectionLabel as a span', () => {
    render(<Text role="settingsSectionLabel">Settings</Text>, { wrapper });

    const el = screen.getByText('Settings');

    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('MuiTypography-overline');
  });

  it('renders inlineLabel with inherited typography semantics', () => {
    render(<Text role="inlineLabel">Chip text</Text>, { wrapper });

    const el = screen.getByText('Chip text');

    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('MuiTypography-inherit');
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

  it('renders with support tone', () => {
    render(
      <Text role="sectionEyebrow" tone="support">
        Support
      </Text>,
      { wrapper }
    );

    expect(screen.getByText('Support')).toBeInTheDocument();
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

  it('passes DOM, ARIA, data, and interaction props through to Typography', () => {
    const handleClick = jest.fn();

    render(
      <Text role="body" aria-hidden={true} data-surface="summary" onClick={handleClick}>
        Interactive text
      </Text>,
      { wrapper }
    );

    const el = screen.getByText('Interactive text');

    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveAttribute('data-surface', 'summary');

    fireEvent.click(el);

    expect(handleClick).toHaveBeenCalledTimes(1);
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

  it('changes body styling when prose context is used', () => {
    render(
      <>
        <Text role="body">Interface copy</Text>
        <Text role="body" context="prose">
          Reading copy
        </Text>
      </>,
      { wrapper }
    );

    expect(screen.getByText('Interface copy')).toHaveStyle({ lineHeight: '1.58' });
    expect(screen.getByText('Reading copy')).toHaveStyle({ lineHeight: '1.75' });
  });

  it('changes cardTitle styling when overlay context is used', () => {
    render(
      <>
        <Text role="cardTitle">Card title</Text>
        <Text role="cardTitle" context="overlay" tone="inverse">
          Overlay title
        </Text>
      </>,
      { wrapper }
    );

    expect(screen.getByText('Card title')).toHaveStyle({ lineHeight: '1.3' });
    expect(screen.getByText('Overlay title')).toHaveStyle({ lineHeight: '1.2' });
  });

  it('uses the same default color for meta text roles', () => {
    render(
      <>
        <Text role="meta">Meta</Text>
        <Text role="metaStrong">Strong meta</Text>
      </>,
      { wrapper }
    );

    const metaColor = window.getComputedStyle(screen.getByText('Meta')).color;
    const metaStrongColor = window.getComputedStyle(screen.getByText('Strong meta')).color;

    expect(metaColor).toBe(metaStrongColor);
  });

  /* ── All UI roles render without error ──────────────── */

  const uiRoles = [
    'pageTitle',
    'pageSubtitle',
    'settingsSectionLabel',
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
    'inlineLabel',
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
    'proseMinorHeading',
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
