import { render, screen } from '@testing-library/react';
import { Button, Chip, Tab, Tabs } from '@mui/material';
import ThemeProvider from '../../ThemeProvider';
import {
  HeaderLabel,
  HeaderTitle,
  HeaderSubtitle,
  DisplayTitle,
  EntryTitle,
  EntrySubtitle,
  SectionLabel,
  MetaText,
  StrongMetaText,
  CaptionText,
  BodyText,
  ListItemText,
  SectionLeadText,
  SubsectionTitle,
} from './TypographyPrimitives';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Typography primitives', () => {
  it('renders HeaderLabel as an overline span', () => {
    render(<HeaderLabel>EXPERIENCE</HeaderLabel>, { wrapper });

    const el = screen.getByText('EXPERIENCE');

    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('MuiTypography-overline');
  });

  it('renders HeaderTitle as an h4 heading', () => {
    render(<HeaderTitle>Collections</HeaderTitle>, { wrapper });

    const el = screen.getByText('Collections');

    expect(el.tagName).toBe('H4');
    expect(el).toHaveClass('MuiTypography-h4');
  });

  it('renders HeaderSubtitle as a subtitle1 element', () => {
    render(<HeaderSubtitle>A selection of work</HeaderSubtitle>, { wrapper });

    const el = screen.getByText('A selection of work');

    expect(el).toHaveClass('MuiTypography-subtitle1');
  });

  it('renders DisplayTitle as an h1', () => {
    render(<DisplayTitle>Hello World</DisplayTitle>, { wrapper });

    const el = screen.getByText('Hello World');

    expect(el.tagName).toBe('H1');
    expect(el).toHaveClass('MuiTypography-h1');
  });

  it('renders EntryTitle as an h6 heading', () => {
    render(<EntryTitle>Software Engineer</EntryTitle>, { wrapper });

    const el = screen.getByText('Software Engineer');

    expect(el.tagName).toBe('H6');
    expect(el).toHaveClass('MuiTypography-h6');
  });

  it('renders EntrySubtitle as a subtitle1 paragraph', () => {
    render(<EntrySubtitle>Applied/Computational Mathematics</EntrySubtitle>, { wrapper });

    const el = screen.getByText('Applied/Computational Mathematics');

    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('MuiTypography-subtitle1');
  });

  it('renders SectionLabel as an overline span', () => {
    render(<SectionLabel>Jump to</SectionLabel>, { wrapper });

    const el = screen.getByText('Jump to');

    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('MuiTypography-overline');
  });

  it('renders MetaText as a subtitle2 element', () => {
    render(<MetaText>2025</MetaText>, { wrapper });

    const el = screen.getByText('2025');

    expect(el).toHaveClass('MuiTypography-subtitle2');
  });

  it('renders StrongMetaText as a bold subtitle2 element', () => {
    render(<StrongMetaText>Important</StrongMetaText>, { wrapper });

    const el = screen.getByText('Important');

    expect(el).toHaveClass('MuiTypography-subtitle2');
  });

  it('renders CaptionText as a caption element', () => {
    render(<CaptionText>Small text</CaptionText>, { wrapper });

    const el = screen.getByText('Small text');

    expect(el).toHaveClass('MuiTypography-caption');
  });

  it('renders BodyText as a body2 element', () => {
    render(<BodyText>Body copy</BodyText>, { wrapper });

    const el = screen.getByText('Body copy');

    expect(el).toHaveClass('MuiTypography-body2');
  });

  it('renders ListItemText as a body2 li element', () => {
    render(<ul><ListItemText>Item one</ListItemText></ul>, { wrapper });

    const el = screen.getByText('Item one');

    expect(el.tagName).toBe('LI');
    expect(el).toHaveClass('MuiTypography-body2');
  });

  it('renders SectionLeadText as a subtitle2 element', () => {
    render(<SectionLeadText>Intro text</SectionLeadText>, { wrapper });

    const el = screen.getByText('Intro text');

    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('MuiTypography-subtitle2');
  });

  it('renders SubsectionTitle as a subtitle2 heading', () => {
    render(<SubsectionTitle>Recent Activity</SubsectionTitle>, { wrapper });

    const el = screen.getByText('Recent Activity');

    expect(el.tagName).toBe('H6');
    expect(el).toHaveClass('MuiTypography-subtitle2');
  });

  it('merges caller sx with default styles', () => {
    render(<EntryTitle sx={{ mt: 5 }}>Styled</EntryTitle>, { wrapper });

    const el = screen.getByText('Styled');

    expect(el.tagName).toBe('H6');
  });
});
