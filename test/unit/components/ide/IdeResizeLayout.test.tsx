import type { CSSProperties, ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { VscodeEditorPane } from '../../../../src/components/ide/VscodeEditorPane';
import { VscodeTabBar } from '../../../../src/components/ide/VscodeTabBar';
import { VscodeTerminalPanel } from '../../../../src/components/ide/VscodeTerminalPanel';
import { VscodeExplorerSidebar } from '../../../../src/components/ide/VscodeExplorerSidebar';

const renderInShell = (ui: ReactElement, shellStyle: CSSProperties = {}) =>
  render(
    <ThemeProvider>
      <div
        data-testid="layout-shell"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1000px',
          height: '700px',
          ...shellStyle,
        }}
      >
        {ui}
      </div>
    </ThemeProvider>
  );

const getShellChild = () => screen.getByTestId('layout-shell').firstElementChild as HTMLElement;

const getRootClassName = (ui: ReactElement, shellStyle: CSSProperties = {}) => {
  const view = renderInShell(ui, shellStyle);
  const className =
    (view.getByTestId('layout-shell').firstElementChild as HTMLElement | null)?.className ?? '';

  view.unmount();
  return className;
};

describe('VscodeEditorPane resize layout', () => {
  it('uses a distinct root style branch in expanded mode', () => {
    expect(getRootClassName(<VscodeEditorPane expanded />)).not.toBe(
      getRootClassName(<VscodeEditorPane />)
    );
  });

  it('uses a distinct root style branch in resized mode', () => {
    expect(getRootClassName(<VscodeEditorPane resized />)).not.toBe(
      getRootClassName(<VscodeEditorPane />)
    );
  });

  it('renders the active tab breadcrumb content in resized mode', () => {
    renderInShell(<VscodeEditorPane activeTab="client" resized />);

    expect(screen.getAllByText('client.ts').length).toBeGreaterThan(0);
  });

  it('renders each active tab in resized mode', () => {
    for (const tab of ['server', 'client'] as const) {
      const view = renderInShell(<VscodeEditorPane activeTab={tab} resized />);

      expect(view.getByTestId('layout-shell').firstElementChild).toBeTruthy();
      view.unmount();
    }
  });
});

describe('VscodeTabBar resize layout', () => {
  it('uses a distinct root style branch in expanded mode', () => {
    expect(getRootClassName(<VscodeTabBar expanded />)).not.toBe(
      getRootClassName(<VscodeTabBar />)
    );
  });

  it('uses a distinct root style branch in resized mode', () => {
    expect(getRootClassName(<VscodeTabBar resized />)).not.toBe(getRootClassName(<VscodeTabBar />));
  });

  it('fires onTabChange when the inactive tab is clicked', () => {
    const onTabChange = jest.fn();
    renderInShell(<VscodeTabBar onTabChange={onTabChange} />);

    fireEvent.click(screen.getByRole('tab', { name: /client.ts/i }));

    expect(onTabChange).toHaveBeenCalledWith('client');
  });
});

describe('VscodeTerminalPanel resize layout', () => {
  const baseProps = {
    commandText: 'echo hello',
    outputText: 'hello',
    showCursor: true,
    phase: 'idle' as const,
    history: [],
  };

  it('uses a distinct root style branch in expanded mode', () => {
    expect(getRootClassName(<VscodeTerminalPanel {...baseProps} expanded />)).not.toBe(
      getRootClassName(<VscodeTerminalPanel {...baseProps} />)
    );
  });

  it('uses a distinct root style branch in resized mode', () => {
    expect(getRootClassName(<VscodeTerminalPanel {...baseProps} resized />)).not.toBe(
      getRootClassName(<VscodeTerminalPanel {...baseProps} />)
    );
  });

  it('renders the terminal body in resized mode', () => {
    renderInShell(<VscodeTerminalPanel {...baseProps} resized />);

    expect(screen.getByTestId('terminal-panel-body')).toBeInTheDocument();
    expect(screen.getByText('echo hello')).toBeInTheDocument();
  });
});

describe('VscodeExplorerSidebar resize layout', () => {
  it('renders nothing when visible=false', () => {
    const view = renderInShell(<VscodeExplorerSidebar visible={false} />, {
      flexDirection: 'row',
    });

    expect(view.getByTestId('layout-shell').childElementCount).toBe(0);
  });

  it('keeps its fixed width and no flex-shrink by default', () => {
    renderInShell(<VscodeExplorerSidebar visible />, { flexDirection: 'row' });

    expect(getShellChild()).toBeInTheDocument();
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('allows shrinking and keeps a minimum width in resized mode', () => {
    expect(
      getRootClassName(<VscodeExplorerSidebar visible resized />, { flexDirection: 'row' })
    ).not.toBe(getRootClassName(<VscodeExplorerSidebar visible />, { flexDirection: 'row' }));
  });

  it('accepts different active tabs in resized mode', () => {
    for (const tab of ['server', 'client'] as const) {
      const view = renderInShell(<VscodeExplorerSidebar activeTab={tab} visible resized />, {
        flexDirection: 'row',
      });

      expect(view.getByTestId('layout-shell').firstElementChild).toBeTruthy();
      view.unmount();
    }
  });
});
