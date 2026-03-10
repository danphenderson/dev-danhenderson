import { fireEvent, render, screen } from '@testing-library/react';
import type { MouseEventHandler, ReactNode, SyntheticEvent } from 'react';
import { AppSpeedDial } from './AppSpeedDial';

jest.mock('@mui/material/SpeedDial', () => ({
  __esModule: true,
  default: ({
    ariaLabel,
    children,
    icon,
    onClose,
    onOpen,
    open,
  }: {
    ariaLabel: string;
    children: ReactNode;
    icon: ReactNode;
    onClose?: (event: SyntheticEvent, reason: string) => void;
    onOpen?: (event: SyntheticEvent, reason: string) => void;
    open?: boolean;
  }) => (
    <div data-testid="speed-dial-root" data-open={String(Boolean(open))}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open ? 'true' : 'false'}
        onClick={(event) => (open ? onClose?.(event, 'toggle') : onOpen?.(event, 'toggle'))}
      >
        {icon}
      </button>
      {open ? <div data-testid="speed-dial-actions">{children}</div> : null}
    </div>
  ),
}));

jest.mock('@mui/material/SpeedDialAction', () => ({
  __esModule: true,
  default: ({
    FabProps,
    icon,
    tooltipOpen,
    tooltipTitle,
  }: {
    FabProps?: Record<string, unknown>;
    icon?: ReactNode;
    tooltipOpen?: boolean;
    tooltipTitle?: ReactNode;
  }) => {
    const { component, onClick, ...restFabProps } = FabProps ?? {};

    if (component === 'a') {
      return (
        <a
          data-testid="speed-dial-action"
          data-tooltip-open={String(Boolean(tooltipOpen))}
          onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
          {...restFabProps}
        >
          {tooltipTitle}
          {icon}
        </a>
      );
    }

    return (
      <button
        data-testid="speed-dial-action"
        data-tooltip-open={String(Boolean(tooltipOpen))}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        {...restFabProps}
      >
        {tooltipTitle}
        {icon}
      </button>
    );
  },
}));

jest.mock('@mui/material/SpeedDialIcon', () => ({
  __esModule: true,
  default: ({ icon, openIcon }: { icon?: ReactNode; openIcon?: ReactNode }) => (
    <span data-testid="speed-dial-icon">
      {icon}
      {openIcon}
    </span>
  ),
}));

describe('AppSpeedDial', () => {
  it('maps external, mailto, and download actions onto action links', () => {
    render(
      <AppSpeedDial
        ariaLabel="Open shared actions"
        icon={<span>Open</span>}
        actionLabelsAlwaysOpen
        actions={[
          {
            id: 'github',
            label: 'GitHub',
            icon: <span>GH</span>,
            href: 'https://github.com/danphenderson',
            external: true,
          },
          {
            id: 'email',
            label: 'Email',
            icon: <span>Mail</span>,
            href: 'mailto:me@danhenderson.dev',
          },
          {
            id: 'resume',
            label: 'Download Resume',
            icon: <span>Resume</span>,
            href: '/assets/daniel-henderson-resume.pdf',
            download: 'Daniel-Henderson-Resume.pdf',
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open shared actions' }));

    const githubAction = screen.getByRole('link', { name: 'GitHub' });
    const emailAction = screen.getByRole('link', { name: 'Email' });
    const resumeAction = screen.getByRole('link', { name: 'Download Resume' });

    expect(githubAction).toHaveAttribute('href', 'https://github.com/danphenderson');
    expect(githubAction).toHaveAttribute('target', '_blank');
    expect(githubAction).toHaveAttribute('rel', 'noopener noreferrer');
    expect(emailAction).toHaveAttribute('href', 'mailto:me@danhenderson.dev');
    expect(resumeAction).toHaveAttribute('href', '/assets/daniel-henderson-resume.pdf');
    expect(resumeAction).toHaveAttribute('download', 'Daniel-Henderson-Resume.pdf');
    screen.getAllByTestId('speed-dial-action').forEach((action) => {
      expect(action).toHaveAttribute('data-tooltip-open', 'true');
    });
  });

  it('calls callback actions and closes the menu after selection', () => {
    const onJump = jest.fn();

    render(
      <AppSpeedDial
        ariaLabel="Open navigation actions"
        icon={<span>Open</span>}
        actions={[
          {
            id: 'jump-about',
            label: 'ABOUT',
            icon: <span>About</span>,
            onClick: onJump,
          },
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Open navigation actions' });

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'ABOUT' }));

    expect(onJump).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('speed-dial-actions')).not.toBeInTheDocument();
  });
});
