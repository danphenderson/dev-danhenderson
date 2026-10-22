import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppSpeedDial } from '../../../src/components/AppSpeedDial';
import { createAppTheme } from '../../../src/theme/createAppTheme';

const theme = createAppTheme('light', 'evergreen', 'off');

const CurrentPath = () => <output aria-label="Current path">{useLocation().pathname}</output>;

describe('AppSpeedDial with real MUI components', () => {
  it('keeps static labels and keyboard navigation working through the FAB slot', () => {
    render(
      <ThemeProvider theme={theme}>
        <AppSpeedDial
          ariaLabel="Open navigation"
          icon={<span>Open</span>}
          actionLabelsAlwaysOpen
          actions={[
            { id: 'first', label: 'First section', icon: <span>1</span>, onClick: jest.fn() },
            {
              id: 'download',
              label: 'Save file',
              icon: <span>2</span>,
              href: '/file.pdf',
              download: true,
            },
          ]}
        />
      </ThemeProvider>
    );
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    act(() => trigger.focus());
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    const first = screen.getByRole('menuitem', { name: 'First section' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowUp' });
    const download = screen.getByRole('menuitem', { name: 'Save file' });
    expect(download).toHaveFocus();
    expect(download).toHaveAttribute('download');
    fireEvent.keyDown(download, { key: 'Escape' });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  it('preserves external, email, and download links and their accessible names', () => {
    render(
      <ThemeProvider theme={theme}>
        <AppSpeedDial
          ariaLabel="Open about actions"
          icon={<span>Open</span>}
          actions={[
            {
              id: 'github',
              label: 'GitHub',
              icon: <span aria-hidden>GH</span>,
              href: 'https://github.com/danphenderson',
              external: true,
            },
            {
              id: 'email',
              label: 'Email',
              icon: <span aria-hidden>Mail</span>,
              href: 'mailto:me@danhenderson.dev',
            },
            {
              id: 'resume',
              label: 'Download Resume',
              icon: <span aria-hidden>Resume</span>,
              href: '/assets/daniel-henderson-resume.pdf',
              download: 'Daniel-Henderson-Resume.pdf',
            },
          ]}
        />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Open about actions' });
    fireEvent.click(trigger);

    const github = screen.getByRole('menuitem', { name: 'GitHub' });
    const email = screen.getByRole('menuitem', { name: 'Email' });
    const resume = screen.getByRole('menuitem', { name: 'Download Resume' });

    expect(github.tagName).toBe('A');
    expect(github).toHaveAttribute('href', 'https://github.com/danphenderson');
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
    expect(email).toHaveAttribute('href', 'mailto:me@danhenderson.dev');
    expect(resume).toHaveAttribute('href', '/assets/daniel-henderson-resume.pdf');
    expect(resume).toHaveAttribute('download', 'Daniel-Henderson-Resume.pdf');

    fireEvent.click(github);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('runs callback and hover actions and closes after selection', () => {
    const onClick = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <AppSpeedDial
          ariaLabel="Open settings"
          icon={<span>Open</span>}
          actions={[
            {
              id: 'theme',
              label: 'Switch theme',
              icon: <span aria-hidden>Theme</span>,
              onClick,
              onMouseEnter,
              onMouseLeave,
            },
          ]}
        />
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Open settings' });
    fireEvent.click(trigger);

    const action = screen.getByRole('menuitem', { name: 'Switch theme' });
    fireEvent.mouseEnter(action);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(action);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
    fireEvent.click(action);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('navigates through React Router and closes after selecting an internal link', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/cv']}>
          <AppSpeedDial
            ariaLabel="Open page navigation"
            icon={<span>Open</span>}
            actions={[
              {
                id: 'home',
                label: 'Home',
                icon: <span aria-hidden>Home</span>,
                to: '/',
              },
            ]}
          />
          <CurrentPath />
        </MemoryRouter>
      </ThemeProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Open page navigation' });
    fireEvent.click(trigger);
    const home = screen.getByRole('menuitem', { name: 'Home' });
    expect(home).toHaveAttribute('href', '/');
    fireEvent.click(home);

    expect(screen.getByLabelText('Current path')).toHaveTextContent(/^\/$/);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
