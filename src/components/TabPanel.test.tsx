import { Chip } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import { useComponentStyles } from '../styles/componentStyles';
import { TabPanel } from './TabPanel';

const IndustryChip = () => {
  const { cvEntryChipSx } = useComponentStyles();

  return <Chip size="small" label="Industry" variant="outlined" sx={cvEntryChipSx} />;
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

  it('supports defaultValue for uncontrolled tabs and keeps tab/panel ids wired together', () => {
    render(
      <ThemeProvider>
        <TabPanel
          id="experience-details"
          ariaLabel="Experience sections"
          defaultValue="skills"
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    const skillsTab = screen.getByRole('tab', { name: 'Skills' });
    const skillsPanel = screen.getByRole('tabpanel');

    expect(skillsTab).toHaveAttribute('aria-selected', 'true');
    expect(skillsTab).toHaveAttribute('id', 'experience-details-tab-skills');
    expect(skillsTab).toHaveAttribute('aria-controls', 'experience-details-panel-skills');
    expect(skillsPanel).toHaveAttribute('id', 'experience-details-panel-skills');
    expect(skillsPanel).toHaveAttribute('aria-labelledby', 'experience-details-tab-skills');
    expect(screen.getByText('Skills body')).toBeVisible();
  });

  it('passes drawer render context to renderContent callbacks', () => {
    const renderContent = jest.fn((selected: boolean, context: { panelId: string; getDrawerContainer: () => HTMLDivElement | null }) => (
      <div data-selected={String(selected)} data-panel-id={context.panelId}>
        Details body
      </div>
    ));

    render(
      <ThemeProvider>
        <TabPanel
          id="context-test"
          ariaLabel="Context sections"
          defaultValue="details"
          items={[
            { value: 'details', label: 'Details', renderContent },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    const renderContext = renderContent.mock.calls[0][1];

    expect(renderContent).toHaveBeenCalledWith(true, expect.objectContaining({ panelId: 'context-test-panel-details' }));
    expect(renderContext.getDrawerContainer()).toHaveAttribute('id', 'context-test-panel-details');
    expect(screen.getByText('Details body')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByText('Details body')).toHaveAttribute('data-panel-id', 'context-test-panel-details');
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

  it('falls back to the remaining enabled item when disabled items leave a single visible panel', () => {
    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Supplemental section"
          hideTabsWhenSingle
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div>, disabled: true },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: 'Skills' })).toBeVisible();
    expect(screen.getByText('Skills body')).toBeVisible();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();
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

  it('keeps inactive panels mounted when keepMounted is enabled', () => {
    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Mounted panels"
          keepMounted
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(screen.getByText('Details body')).toBeInTheDocument();
    expect(screen.getByText('Details body').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
    expect(screen.getByText('Skills body').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
  });

  it('treats value as controlled and reports false when the selected tab is clicked again', () => {
    const handleChange = jest.fn();

    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Controlled sections"
          value="skills"
          onChange={handleChange}
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    expect(handleChange).toHaveBeenNthCalledWith(1, 'details');
    expect(screen.getByText('Skills body')).toBeVisible();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    expect(handleChange).toHaveBeenNthCalledWith(2, false);
    expect(screen.getByText('Skills body')).toBeVisible();
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
