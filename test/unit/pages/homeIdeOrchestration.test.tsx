import { act, renderHook, waitFor } from '@testing-library/react';
import { useHomeIdeOrchestration } from '../../../src/pages/homeIdeOrchestration';

const AUTO_EXPAND_WAIT_MS = 1000;

const mountedElements: HTMLElement[] = [];

const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

const setPointerDevice = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
};

const setElementRect = (
  element: Element,
  rect: { left: number; top: number; width: number; height: number }
) => {
  const domRect = {
    x: rect.left,
    y: rect.top,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON: () => ({}),
  } as DOMRect;

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => domRect,
  });
};

const mountLayoutAnchors = () => {
  const header = document.createElement('div');
  header.id = 'site-navigation';

  const mainContent = document.createElement('div');
  mainContent.id = 'main-content';

  document.body.append(header, mainContent);
  mountedElements.push(header, mainContent);

  return { header, mainContent };
};

const dispatchPointerMove = (clientX: number, clientY: number) => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX,
        clientY,
      })
    );
  });
};

const dispatchPointerUp = () => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
      })
    );
  });
};

const createHookHarness = ({
  prefersReducedMotion = false,
}: { prefersReducedMotion?: boolean } = {}) => {
  const heroHost = document.createElement('div');
  const terminalHero = document.createElement('div');
  terminalHero.dataset.testid = 'terminal-hero';
  heroHost.appendChild(terminalHero);

  const heroBounds = document.createElement('div');
  mountedElements.push(heroHost, heroBounds);

  const dragControls = {
    start: jest.fn(),
  };

  const heroRef = { current: heroHost };
  const heroBoundsRef = { current: heroBounds };

  const hook = renderHook(() =>
    useHomeIdeOrchestration({
      prefersReducedMotion,
      dragControls,
      heroRef,
      heroBoundsRef,
    })
  );

  return { ...hook, dragControls, heroHost, terminalHero, heroBounds };
};

describe('useHomeIdeOrchestration', () => {
  beforeEach(() => {
    setPointerDevice(true);
    setViewportSize(1280, 800);
  });

  afterEach(() => {
    mountedElements.forEach((element) => element.remove());
    mountedElements.length = 0;
    jest.clearAllMocks();
  });

  it('enables title-bar dragging only after hero motion completes on pointer-fine devices', async () => {
    const { result, dragControls } = createHookHarness();

    await waitFor(() => expect(result.current.resizeEnabled).toBe(true));
    expect(result.current.windowDragEnabled).toBe(false);

    act(() => {
      result.current.handleTitleBarPointerDown({ button: 0 } as never);
    });

    expect(dragControls.start).not.toHaveBeenCalled();

    act(() => {
      result.current.handleHeroMotionComplete();
    });

    expect(result.current.isTypewriterPlaying).toBe(true);
    expect(result.current.windowDragEnabled).toBe(true);

    act(() => {
      result.current.handleTitleBarPointerDown({ button: 0 } as never);
    });

    expect(dragControls.start).toHaveBeenCalledTimes(1);
  });

  it('auto-expands after hero motion completes and highlights the expand affordance while waiting', async () => {
    jest.useFakeTimers();

    const { result } = createHookHarness();

    act(() => {
      result.current.handleHeroMotionComplete();
    });

    expect(result.current.isTypewriterPlaying).toBe(true);
    expect(result.current.expandDotHighlighted).toBe(true);
    expect(result.current.ideWindowState).toBe('normal');

    act(() => {
      jest.advanceTimersByTime(AUTO_EXPAND_WAIT_MS);
    });

    await waitFor(() => expect(result.current.ideWindowState).toBe('expanded'));
    expect(result.current.expandDotHighlighted).toBe(false);

    jest.useRealTimers();
  });

  it('expands immediately after hero motion when reduced motion is preferred', () => {
    const { result } = createHookHarness({ prefersReducedMotion: true });

    act(() => {
      result.current.handleHeroMotionComplete();
    });

    expect(result.current.isTypewriterPlaying).toBe(true);
    expect(result.current.ideWindowState).toBe('expanded');
    expect(result.current.expandDotHighlighted).toBe(false);
  });

  it('resolves the expanded viewport from the visible page area when expanded', async () => {
    const { header, mainContent } = mountLayoutAnchors();
    setElementRect(header, { left: 0, top: 0, width: 1280, height: 64 });
    setElementRect(mainContent, { left: 24, top: 40, width: 1000, height: 680 });

    const { result } = createHookHarness();

    act(() => {
      result.current.handleIdeExpand();
    });

    await waitFor(() =>
      expect(result.current.expandedIdeViewport).toEqual({
        top: 64,
        left: 24,
        width: 1000,
        height: 656,
      })
    );
  });

  it('updates and clamps resize dimensions, then clears them on restore after close', async () => {
    const { result, terminalHero, heroBounds } = createHookHarness();

    setElementRect(heroBounds, { left: 0, top: 0, width: 1000, height: 700 });
    setElementRect(terminalHero, { left: 650, top: 100, width: 300, height: 300 });

    await waitFor(() => expect(result.current.resizeEnabled).toBe(true));

    act(() => {
      result.current.handleResizeStart('right', { clientX: 950, clientY: 160 } as never);
    });

    await waitFor(() => expect(result.current.isResizing).toBe(true));
    expect(result.current.resizeWidth).toBe(300);
    expect(result.current.resizeHeight).toBe(300);

    dispatchPointerMove(1150, 160);

    await waitFor(() => expect(result.current.resizeWidth).toBe(350));

    dispatchPointerUp();

    await waitFor(() => expect(result.current.isResizing).toBe(false));

    const sessionKeyBeforeClose = result.current.ideSessionKey;

    act(() => {
      result.current.handleIdeClose();
    });

    expect(result.current.ideWindowState).toBe('closed');
    expect(result.current.ideSessionKey).toBe(sessionKeyBeforeClose + 1);
    expect(result.current.resizeWidth).toBeUndefined();
    expect(result.current.resizeHeight).toBeUndefined();

    act(() => {
      result.current.handleIdeRestore();
    });

    expect(result.current.ideWindowState).toBe('normal');
    expect(result.current.resizeWidth).toBeUndefined();
    expect(result.current.resizeHeight).toBeUndefined();
  });

  it('queues a fresh session when minimized and restored', () => {
    const { result } = createHookHarness();
    const initialSessionKey = result.current.ideSessionKey;

    act(() => {
      result.current.handleIdeMinimize();
    });

    expect(result.current.ideWindowState).toBe('minimized');
    expect(result.current.ideSessionKey).toBe(initialSessionKey + 1);

    act(() => {
      result.current.handleIdeRestore();
    });

    expect(result.current.ideWindowState).toBe('normal');
    expect(result.current.ideSessionKey).toBe(initialSessionKey + 1);
  });
});
