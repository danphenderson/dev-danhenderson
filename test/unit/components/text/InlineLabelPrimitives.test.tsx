import { render, screen } from '@testing-library/react';
import { Button, Chip, Tab, Tabs } from '@mui/material';
import ThemeProvider from '../../../../src/ThemeProvider';
import {
  InteractiveLabel,
  NavigationLabel,
  ChipLabel,
  ChipMetaLabel,
  StatusInlineText,
} from '../../../../src/components/text/InlineLabelPrimitives';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Inline label primitives', () => {
  it('renders InteractiveLabel as an inline span', () => {
    render(<InteractiveLabel>Details</InteractiveLabel>, { wrapper });

    const el = screen.getByText('Details');

    expect(el.tagName).toBe('SPAN');
  });

  it('renders NavigationLabel as an inline span', () => {
    render(<NavigationLabel>CV</NavigationLabel>, { wrapper });

    const el = screen.getByText('CV');

    expect(el.tagName).toBe('SPAN');
  });

  it('renders ChipLabel as an inline span', () => {
    render(<ChipLabel>React</ChipLabel>, { wrapper });

    const el = screen.getByText('React');

    expect(el.tagName).toBe('SPAN');
  });

  it('renders ChipMetaLabel as an inline span with compound layout', () => {
    render(
      <ChipMetaLabel>
        <span>repo-name</span>
        <span>★ 42</span>
      </ChipMetaLabel>,
      { wrapper }
    );

    expect(screen.getByText('repo-name')).toBeInTheDocument();
    expect(screen.getByText('★ 42')).toBeInTheDocument();

    const container = screen.getByText('repo-name').parentElement;

    expect(container?.tagName).toBe('SPAN');
  });

  it('renders StatusInlineText as an inline span with breathing animation', () => {
    render(<StatusInlineText>Open to opportunities</StatusInlineText>, { wrapper });

    const el = screen.getByText('Open to opportunities');

    expect(el.tagName).toBe('SPAN');
  });

  it('can be nested inside a Button without block-level issues', () => {
    render(
      <Button>
        <NavigationLabel>Click me</NavigationLabel>
      </Button>,
      { wrapper }
    );

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
    expect(screen.getByText('Click me').tagName).toBe('SPAN');
  });

  it('can be nested inside a Chip as a label', () => {
    render(<Chip label={<ChipLabel>TypeScript</ChipLabel>} />, { wrapper });

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript').tagName).toBe('SPAN');
  });

  it('can be nested inside a Tab as a label', () => {
    render(
      <Tabs value="one">
        <Tab value="one" label={<InteractiveLabel>Tab One</InteractiveLabel>} />
      </Tabs>,
      { wrapper }
    );

    expect(screen.getByRole('tab', { name: 'Tab One' })).toBeInTheDocument();
    expect(screen.getByText('Tab One').tagName).toBe('SPAN');
  });
});
