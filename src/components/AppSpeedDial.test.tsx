import { fireEvent, render, screen } from '@testing-library/react';
import type { MouseEventHandler, ReactNode, SyntheticEvent } from 'react';
import type { Theme } from '@mui/material/styles';
import { AppSpeedDial } from './AppSpeedDial';
import { createAppTheme } from '../theme/createAppTheme';

const mockSpeedDial = jest.fn();

jest.mock('@mui/material/SpeedDial', () => ({
  __esModule: true,
  default: ({
    ariaLabel,
    children,
    icon,
    onClose,
    onOpen,
    open,
    sx,
  }: {
    ariaLabel: string;
    children: ReactNode;
    icon: ReactNode;
    onClose?: (event: SyntheticEvent, reason: string) => void;
    onOpen?: (event: SyntheticEvent, reason: string) => void;
    open?: boolean;
    sx?: unknown;
  }) => (
    mockSpeedDial({ ariaLabel, children, icon, onClose, onOpen, open, sx }),
    (
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
    )
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
    const { component, onClick, to, ...restFabProps } = FabProps ?? {};

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

    if (component && typeof to === 'string') {
      return (
        <a
          data-testid="speed-dial-action"
          data-tooltip-open={String(Boolean(tooltipOpen))}
          href={to}
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
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('maps internal route actions onto action links and closes the menu after selection', () => {
    render(
      <AppSpeedDial
        ariaLabel="Open page navigation"
        icon={<span>Open</span>}
        actions={[
          {
            id: 'home',
            label: 'Home',
            icon: <span>Home</span>,
            to: '/',
          },
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Open page navigation' });

    fireEvent.click(trigger);

    const homeAction = screen.getByRole('link', { name: 'Home' });
    expect(homeAction).toHaveAttribute('href', '/');

    fireEvent.click(homeAction);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('speed-dial-actions')).not.toBeInTheDocument();
  });

  it('defaults content-layer speed dials below the app bar', () => {
    const theme = createAppTheme('light', 'evergreen');

    render(<AppSpeedDial ariaLabel="Open shared actions" icon={<span>Open</span>} actions={[]} />);

    const speedDialProps = mockSpeedDial.mock.calls.at(-1)?.[0] as { sx: unknown };
    const resolvedSx = speedDialProps.sx as (theme: Theme) => Record<string, unknown>;
    const layerSx = resolvedSx(theme);

    expect(layerSx.zIndex).toBe(theme.zIndex.appBar - 1);
    expect(layerSx['& .MuiSpeedDial-fab, & .MuiSpeedDial-actions']).toEqual({
      zIndex: 'inherit',
    });
  });

  it('lets header speed dials opt into the header layer and preserves caller sx', () => {
    const theme = createAppTheme('dark', 'ember');
    const customSx = { mr: 2 };

    render(
      <AppSpeedDial
        ariaLabel="Open header actions"
        icon={<span>Open</span>}
        actions={[]}
        layer="header"
        sx={customSx}
      />
    );

    const speedDialProps = mockSpeedDial.mock.calls.at(-1)?.[0] as { sx: unknown };
    const resolvedSx = speedDialProps.sx as Array<unknown>;
    const layerSx = (resolvedSx[0] as (theme: Theme) => Record<string, unknown>)(theme);

    expect(layerSx.zIndex).toBe(theme.zIndex.appBar + 1);
    expect(resolvedSx[1]).toBe(customSx);
  });
});
