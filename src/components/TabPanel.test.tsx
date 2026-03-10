import { Button } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import { TabPanel } from './TabPanel';

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
});
