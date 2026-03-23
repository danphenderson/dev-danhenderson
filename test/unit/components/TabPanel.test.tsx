import { Chip } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { useComponentStyles } from '../../../src/styles/componentStyles';
import { TabPanel } from '../../../src/components/TabPanel';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Collapse: ({
      children,
      in: _in,
      appear: _appear,
      timeout: _timeout,
      onEntered: _onEntered,
    }: any) => (
      <div data-collapse-in={String(_in)} data-collapse-appear={String(_appear ?? true)}>
        {children}
      </div>
    ),
  };
});

const IndustryChip = () => {
  const { cvEntryChipSx } = useComponentStyles();

  return <Chip size="small" label="Industry" variant="outlined" sx={cvEntryChipSx} />;
};

describe('TabPanel', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

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
    const renderContent = jest.fn(
      (
        selected: boolean,
        context: { panelId: string; getDrawerContainer: () => HTMLDivElement | null }
      ) => (
        <div data-selected={String(selected)} data-panel-id={context.panelId}>
          Details body
        </div>
      )
    );

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

    expect(renderContent).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ panelId: 'context-test-panel-details' })
    );
    expect(renderContext.getDrawerContainer()).toHaveAttribute('id', 'context-test-panel-details');
    expect(screen.getByText('Details body')).toHaveAttribute('data-selected', 'false');
    expect(screen.getByText('Details body')).toHaveAttribute(
      'data-panel-id',
      'context-test-panel-details'
    );
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
            {
              value: 'details',
              label: 'Details',
              content: <div>Details body</div>,
              disabled: true,
            },
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

  it.each(['fullWidth', 'scrollable'] as const)(
    'left-aligns tab labels for %s tabs',
    (tabsVariant) => {
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
    }
  );

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
    const tabsRoot = screen
      .getByRole('tablist', { name: 'Dense experience sections' })
      .closest('.MuiTabs-root');

    expect(industryChipLabel).not.toBeNull();
    expect(tabsRoot).not.toBeNull();
    expect(window.getComputedStyle(detailsTab).fontSize).toBe(
      window.getComputedStyle(industryChipLabel as HTMLElement).fontSize
    );
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
    expect(screen.getByText('Skills body').closest('[role="tabpanel"]')).not.toHaveAttribute(
      'hidden'
    );
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

  it('keeps renderContent panels mounted while inactive even when keepMounted is false', () => {
    const renderDetails = jest.fn((selected: boolean) => (
      <div data-testid="details-body" data-selected={String(selected)}>
        Details body
      </div>
    ));
    const renderSkills = jest.fn((selected: boolean) => (
      <div data-testid="skills-body" data-selected={String(selected)}>
        Skills body
      </div>
    ));

    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Render content panels"
          defaultValue="details"
          items={[
            { value: 'details', label: 'Details', renderContent: renderDetails },
            { value: 'skills', label: 'Skills', renderContent: renderSkills },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    expect(renderDetails).toHaveBeenCalled();
    expect(renderSkills).toHaveBeenCalled();

    expect(renderDetails).toHaveBeenCalledWith(false, expect.anything());
    expect(renderSkills).toHaveBeenCalledWith(false, expect.anything());

    expect(screen.getByTestId('details-body')).toHaveAttribute('data-selected', 'false');
    expect(screen.getByTestId('skills-body')).toHaveAttribute('data-selected', 'false');

    const inactivePanel = screen.getByTestId('skills-body').closest('[role="tabpanel"]');

    expect(inactivePanel).toHaveAttribute('hidden');
  });

  it('unmounts plain content panels when inactive and keepMounted is false', () => {
    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Plain content panels"
          defaultValue="details"
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Details body')).toBeVisible();
    expect(screen.queryByText('Skills body')).not.toBeInTheDocument();
  });

  it('renders nothing when items array is empty', () => {
    const { container } = render(
      <ThemeProvider>
        <TabPanel ariaLabel="Empty section" items={[]} tabsVariant="fullWidth" />
      </ThemeProvider>
    );

    expect(container.querySelector('[role="tabpanel"]')).not.toBeInTheDocument();
    expect(container.querySelector('[role="tablist"]')).not.toBeInTheDocument();
  });

  it('renders nothing when all items are disabled', () => {
    const { container } = render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Disabled section"
          items={[
            {
              value: 'details',
              label: 'Details',
              content: <div>Details body</div>,
              disabled: true,
            },
            {
              value: 'skills',
              label: 'Skills',
              content: <div>Skills body</div>,
              disabled: true,
            },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    expect(container.querySelector('[role="tabpanel"]')).not.toBeInTheDocument();
    expect(screen.queryByText('Details body')).not.toBeInTheDocument();
    expect(screen.queryByText('Skills body')).not.toBeInTheDocument();
  });

  it('connects tab ids to their panels via aria-controls and aria-labelledby', () => {
    render(
      <ThemeProvider>
        <TabPanel
          id="aria-test"
          ariaLabel="Aria sections"
          defaultValue="details"
          items={[
            { value: 'details', label: 'Details', content: <div>Details body</div> },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const visiblePanel = screen.getByRole('tabpanel');

    expect(detailsTab).toHaveAttribute('aria-controls', 'aria-test-panel-details');
    expect(visiblePanel).toHaveAttribute('aria-labelledby', 'aria-test-tab-details');
    expect(visiblePanel).toHaveAttribute('id', 'aria-test-panel-details');
  });

  it('uses aria-label instead of aria-labelledby when tabs are hidden for a single item', () => {
    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Single section"
          items={[{ value: 'only', label: 'Only Panel', content: <div>Only content</div> }]}
          hideTabsWhenSingle
        />
      </ThemeProvider>
    );

    const panel = screen.getByRole('tabpanel', { name: 'Only Panel' });

    expect(panel).not.toHaveAttribute('aria-labelledby');
    expect(panel).toHaveAttribute('aria-label', 'Only Panel');
  });

  it('keeps renderContent visible while closing and only clears selection after the configured delay', () => {
    jest.useFakeTimers();

    const handleChange = jest.fn();

    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Animated sections"
          onChange={handleChange}
          items={[
            {
              value: 'details',
              label: 'Details',
              closeDelayMs: 500,
              renderContent: (selected) => (
                <div data-testid="details-body" data-selected={String(selected)}>
                  Details body
                </div>
              ),
            },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });

    expect(screen.getByTestId('details-body').closest('[role="tabpanel"]')).toHaveAttribute(
      'hidden'
    );

    fireEvent.click(detailsTab);

    handleChange.mockClear();

    const detailsPanel = screen.getByTestId('details-body').closest('[role="tabpanel"]');

    expect(detailsPanel).not.toHaveAttribute('hidden');

    fireEvent.click(detailsTab);

    expect(screen.getByTestId('details-body')).toBeInTheDocument();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(screen.getByTestId('details-body')).toBeInTheDocument();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('details-body').closest('[role="tabpanel"]')).toHaveAttribute(
      'hidden'
    );
  });

  it('cancels a pending renderContent close when another tab is selected before the delay elapses', () => {
    jest.useFakeTimers();

    const handleChange = jest.fn();

    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Animated sections"
          defaultValue="details"
          onChange={handleChange}
          items={[
            {
              value: 'details',
              label: 'Details',
              closeDelayMs: 500,
              renderContent: (selected) => (
                <div data-testid="details-body" data-selected={String(selected)}>
                  Details body
                </div>
              ),
            },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Skills' }));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('skills');
    expect(screen.getByRole('tab', { name: 'Skills' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Skills body')).toBeVisible();
  });

  it('enforces the minimum close delay for renderContent panels when a shorter delay is provided', () => {
    jest.useFakeTimers();

    const handleChange = jest.fn();

    render(
      <ThemeProvider>
        <TabPanel
          ariaLabel="Animated sections"
          value="details"
          onChange={handleChange}
          items={[
            {
              value: 'details',
              label: 'Details',
              closeDelayMs: 50,
              renderContent: (selected) => (
                <div data-testid="details-body" data-selected={String(selected)}>
                  Details body
                </div>
              ),
            },
            { value: 'skills', label: 'Skills', content: <div>Skills body</div> },
          ]}
          tabsVariant="fullWidth"
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    act(() => {
      jest.advanceTimersByTime(219);
    });

    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
