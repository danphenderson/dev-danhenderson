import { Button, Chip } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import { useComponentStyles } from '../styles/componentStyles';
import { TabPanel } from './TabPanel';

const IndustryChip = () => {
  const { experienceIndustryChipSx } = useComponentStyles();

  return <Chip size="small" label="Industry" variant="outlined" sx={experienceIndustryChipSx} />;
};

describe('TabPanel', () => {
  it('starts with no selected tab and preserves full labels for accessibility when short labels are displayed', () => {
    render(
      <ThemeProvider>
        <TabPanel
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

    fireEvent.click(screen.getByRole('tab', { name: 'Development Stack and Tools' }));

    expect(screen.getByText('Stack body')).toBeVisible();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Development Stack and Tools' }));

    expect(screen.queryByText('Stack body')).not.toBeInTheDocument();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();
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

  it('matches the resume button typography and outline treatment', () => {
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
    expect(window.getComputedStyle(tabPanelRoot as HTMLElement).backgroundColor)
      .toBe(window.getComputedStyle(resumeButton).backgroundColor);
    expect(window.getComputedStyle(tabPanelRoot as HTMLElement).borderTopColor)
      .toBe(window.getComputedStyle(resumeButton).borderTopColor);
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
    'renders selected outer tabs as flush half-pills for %s tabs',
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

      const detailsStyle = window.getComputedStyle(detailsTab);

      expect(detailsStyle.backgroundColor).not.toBe('transparent');
      expect(detailsStyle.boxShadow).not.toContain('inset');
      expect(parseFloat(detailsStyle.borderTopLeftRadius)).toBeGreaterThan(0);
      expect(parseFloat(detailsStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
      expect(parseFloat(detailsStyle.borderTopRightRadius)).toBe(0);
      expect(parseFloat(detailsStyle.borderBottomRightRadius)).toBe(0);

      fireEvent.click(skillsTab);

      const skillsStyle = window.getComputedStyle(skillsTab);

      expect(skillsStyle.backgroundColor).not.toBe('transparent');
      expect(skillsStyle.boxShadow).not.toContain('inset');
      expect(parseFloat(skillsStyle.borderTopLeftRadius)).toBe(0);
      expect(parseFloat(skillsStyle.borderBottomLeftRadius)).toBe(0);
      expect(parseFloat(skillsStyle.borderTopRightRadius)).toBeGreaterThan(0);
      expect(parseFloat(skillsStyle.borderBottomRightRadius)).toBeGreaterThan(0);
    }
  );
});
