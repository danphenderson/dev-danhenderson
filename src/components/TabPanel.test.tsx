import { Button, Chip } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { useComponentStyles } from '../styles/componentStyles';
import { TAB_PANEL_TRANSITION_DURATION_MS, TabPanel } from './TabPanel';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  const React = jest.requireActual('react');

  return {
    ...actual,
    Collapse: ({
      children,
      in: inProp,
      mountOnEnter,
      unmountOnExit,
      timeout,
    }: {
      children: ReactNode;
      in: boolean;
      mountOnEnter?: boolean;
      unmountOnExit?: boolean;
      timeout?: number;
    }) => {
      const child = React.Children.only(children);
      const testId = React.isValidElement(child) && child.props.id ? `collapse-${child.props.id}` : 'collapse';
      const shouldRenderChildren = inProp || !mountOnEnter || !unmountOnExit;

      return (
        <div
          data-testid={testId}
          data-in={String(inProp)}
          data-mount-on-enter={String(Boolean(mountOnEnter))}
          data-unmount-on-exit={String(Boolean(unmountOnExit))}
          data-timeout={String(timeout ?? '')}
        >
          {shouldRenderChildren ? children : null}
        </div>
      );
    },
  };
});

const IndustryChip = () => {
  const { cvEntryChipSx } = useComponentStyles();

  return <Chip size="small" label="Industry" variant="outlined" sx={cvEntryChipSx} />;
};

describe('TabPanel', () => {
  it('starts with no selected tab and preserves full labels for accessibility when short labels are displayed', () => {
    render(
      <ThemeProvider>
        <TabPanel
          id="supplemental-sections"
          ariaLabel="Supplemental sections"
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            {
              value: 'stack',
              label: 'Development Stack and Tools',
              shortLabel: 'Dev Stack',
              content: <div>Stack body</div>,
            },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Dev Stack')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Development Stack and Tools' })).toBeInTheDocument();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();
    expect(screen.queryByText('Stack body')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    expect(screen.getByText('Details body')).toBeVisible();
    expect(screen.queryByText('Stack body')).not.toBeInTheDocument();
    expect(screen.getByTestId('collapse-supplemental-sections-panel-details')).toHaveAttribute('data-in', 'true');
    expect(screen.getByTestId('collapse-supplemental-sections-panel-stack')).toHaveAttribute('data-in', 'false');
    expect(screen.getByTestId('collapse-supplemental-sections-panel-details')).toHaveAttribute(
      'data-timeout',
      String(TAB_PANEL_TRANSITION_DURATION_MS)
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Development Stack and Tools' }));

    expect(screen.getByText('Stack body')).toBeVisible();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();
    expect(screen.getByTestId('collapse-supplemental-sections-panel-details')).toHaveAttribute('data-in', 'false');
    expect(screen.getByTestId('collapse-supplemental-sections-panel-stack')).toHaveAttribute('data-in', 'true');

    fireEvent.click(screen.getByRole('tab', { name: 'Development Stack and Tools' }));

    expect(screen.queryByText('Stack body')).not.toBeInTheDocument();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();
    expect(screen.getByTestId('collapse-supplemental-sections-panel-stack')).toHaveAttribute('data-in', 'false');
  });

  it('can hide the tab strip when only one item is provided', () => {
    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Single supplemental section"
          items={[{ value: 'skills', label: 'Skills', content: <div>Skills body</div> }]}
          hideTabsWhenSingle
        />
      </ThemeProvider>
    );

    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: 'Skills' })).toBeVisible();
  });

  it('matches the resume button typography while using the shared tab panel surface styling', () => {
    render(
      <ThemeProvider>
        <>
          <Button variant="outlined" size="small">
            Download Resume (PDF)
          </Button>
          <TabPanel
            ariaLabel="Experience sections"
            items={[
              { value: 'details', label: 'Details', content: <div>Details body</div> },
              { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
            ]}
            tabsVariant="fullWidth"
          />
        </>
      </ThemeProvider>
    );

    const resumeButton = screen.getByRole('button', { name: 'Download Resume (PDF)' });
    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const tabList = screen.getByRole('tablist', { name: 'Experience sections' });
    const tabsRoot = tabList.closest('.MuiTabs-root');

    expect(tabsRoot).not.toBeNull();

    const tabPanelRoot = tabsRoot?.parentElement;

    expect(tabPanelRoot).not.toBeNull();
    expect(window.getComputedStyle(detailsTab).fontWeight).toBe(window.getComputedStyle(resumeButton).fontWeight);
    expect(window.getComputedStyle(tabPanelRoot as HTMLElement).backgroundColor).toBe('rgba(27, 168, 224, 0.04)');
    expect(window.getComputedStyle(tabPanelRoot as HTMLElement).borderTopColor).toMatch(/#1ba8e0|rgb\(27, 168, 224\)/);
  });

  it.each(['fullWidth', 'scrollable'] as const)('left-aligns tab labels for %s tabs', (tabsVariant) => {
    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel={`${tabsVariant} alignment sections`}
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant={tabsVariant}
        />
      </ThemeProvider>
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const skillsTab = screen.getByRole('tab', { name: 'Skills' });

    expect(window.getComputedStyle(detailsTab).alignItems).toBe('flex-start');
    expect(window.getComputedStyle(detailsTab).justifyContent).toBe('center');
    expect(window.getComputedStyle(detailsTab).textAlign).toBe('left');
    expect(window.getComputedStyle(skillsTab).alignItems).toBe('flex-start');
    expect(window.getComputedStyle(skillsTab).justifyContent).toBe('center');
    expect(window.getComputedStyle(skillsTab).textAlign).toBe('left');
  });

  it('matches the industry chip label size and uses the compact dense tab height', () => {
    render(
      <ThemeProvider>
        <>
          <IndustryChip />
          <TabPanel
            ariaLabel="Dense experience sections"
            items={[
              { value: 'details', label: 'Details', content: <div>Details body</div> },
              { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
            ]}
            dense
            tabsVariant="fullWidth"
          />
        </>
      </ThemeProvider>
    );

    const industryChipLabel = screen.getByText('Industry').closest('.MuiChip-label');
    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const tabsRoot = screen.getByRole('tablist', { name: 'Dense experience sections' }).closest('.MuiTabs-root');

    expect(industryChipLabel).not.toBeNull();
    expect(tabsRoot).not.toBeNull();
    expect(window.getComputedStyle(detailsTab).fontSize).toBe(window.getComputedStyle(industryChipLabel as HTMLElement).fontSize);
    expect(window.getComputedStyle(detailsTab).lineHeight).toBe(
      window.getComputedStyle(industryChipLabel as HTMLElement).lineHeight
    );
    expect(window.getComputedStyle(detailsTab).minHeight).toBe('36px');
    expect(window.getComputedStyle(tabsRoot as HTMLElement).minHeight).toBe('36px');
  });

  it.each(['fullWidth', 'scrollable'] as const)(
    'switches the selected tab and rendered panel for %s tabs',
    (tabsVariant) => {
      render(
        <ThemeProvider>
          <TabPanel
            ariaLabel={`${tabsVariant} experience sections`}
            items={[
              { value: 'details', label: 'Details', content: <div>Details body</div> },
              { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
            ]}
            tabsVariant={tabsVariant}
          />
        </ThemeProvider>
      );

      const detailsTab = screen.getByRole('tab', { name: 'Details' });
      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      const tabList = screen.getByRole('tablist', { name: `${tabsVariant} experience sections` });
      const tabsRoot = tabList.closest('.MuiTabs-root');

      expect(tabsRoot).not.toBeNull();

      const tabPanelRoot = tabsRoot?.parentElement;

      expect(tabPanelRoot).not.toBeNull();
      expect(window.getComputedStyle(tabsRoot as HTMLElement).paddingLeft).toBe('0px');
      expect(window.getComputedStyle(tabsRoot as HTMLElement).paddingRight).toBe('0px');
      expect(window.getComputedStyle(tabList).gap).toBe('0px');

      const indicator = tabsRoot?.querySelector('.MuiTabs-indicator');

      expect(indicator).not.toBeNull();
      expect(window.getComputedStyle(indicator as HTMLElement).display).toBe('none');

      fireEvent.click(detailsTab);

      expect(detailsTab).toHaveAttribute('aria-selected', 'true');
      expect(skillsTab).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByText('Details body')).toBeVisible();
      expect(screen.queryByText('Skills body')).not.toBeInTheDocument();

      fireEvent.click(skillsTab);

      expect(detailsTab).toHaveAttribute('aria-selected', 'false');
      expect(skillsTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Skills body')).toBeVisible();
      expect(screen.queryByText('Details body')).not.toBeInTheDocument();
    }
  );
});
