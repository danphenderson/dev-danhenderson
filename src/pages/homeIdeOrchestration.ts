import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, PointerEventHandler, RefObject } from 'react';
import { duration } from '../motion/tokens';
import type { IdeResizeEdge, IdeWindowSize, IdeWindowState } from '../types/ui';
import { VSCODE_RESIZE } from '../components/ide/vscodeTokens';

const AUTO_EXPAND_PULSE_DURATION_MS = Math.round(duration.slow * 150);

type IdeWindowMountMode = 'normal' | 'expanded';

export type ExpandedIdeViewport = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type UseHomeIdeOrchestrationOptions = {
  prefersReducedMotion: boolean | null;
  dragControls: {
    start: (event: ReactPointerEvent<HTMLDivElement>) => void;
  };
  heroRef: RefObject<HTMLDivElement | null>;
  heroBoundsRef: RefObject<HTMLDivElement | null>;
};

type HomeIdeOrchestration = {
  ideWindowState: IdeWindowState;
  ideSessionKey: number;
  ideVisible: boolean;
  expandedIdeViewport: ExpandedIdeViewport | null;
  ideWindowPortalContainer: HTMLDivElement | null;
  expandDotHighlighted: boolean;
  isTypewriterPlaying: boolean;
  windowDragEnabled: boolean;
  isHeroWindowDragging: boolean;
  resizeWidth: number | undefined;
  resizeHeight: number | undefined;
  resizeEnabled: boolean;
  isResizing: boolean;
  setInlineIdeHost: (node: HTMLDivElement | null) => void;
  setExpandedIdeHost: (node: HTMLDivElement | null) => void;
  handleHeroMotionComplete: () => void;
  handleTitleBarPointerDown: PointerEventHandler<HTMLDivElement>;
  handleHeroDragStart: () => void;
  handleHeroDragEnd: () => void;
  handleResizeStart: (edge: IdeResizeEdge, event: ReactPointerEvent<HTMLDivElement>) => void;
  handleIdeClose: () => void;
  handleIdeMinimize: () => void;
  handleIdeExpand: () => void;
  handleIdeRestore: () => void;
};

const attachIdeWindowContainer = (
  ideWindowPortalContainer: HTMLDivElement | null,
  target: HTMLDivElement | null,
  mode: IdeWindowMountMode
) => {
  if (!ideWindowPortalContainer || !target) {
    return;
  }

  ideWindowPortalContainer.style.width = mode === 'expanded' ? '100%' : 'auto';
  ideWindowPortalContainer.style.height = mode === 'expanded' ? '100%' : 'auto';
  ideWindowPortalContainer.style.maxWidth = '100%';

  if (ideWindowPortalContainer.parentElement !== target) {
    target.appendChild(ideWindowPortalContainer);
  }
};

const resolveExpandedIdeViewport = (): ExpandedIdeViewport | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const mainContent = document.getElementById('main-content');

  if (!mainContent) {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const mainRect = mainContent.getBoundingClientRect();
  const headerRect = document.getElementById('site-navigation')?.getBoundingClientRect();
  const footerRect = document.getElementById('site-footer')?.getBoundingClientRect();
  const top = Math.max(0, mainRect.top, headerRect?.bottom ?? 0);
  const left = Math.max(0, mainRect.left);
  const visibleRight = Math.min(window.innerWidth, mainRect.right);
  const visibleBottom = Math.min(
    window.innerHeight,
    mainRect.bottom,
    footerRect ? footerRect.top : window.innerHeight
  );
  const width = Math.max(0, visibleRight - left);
  const height = Math.max(0, visibleBottom - top);

  if (width === 0 || height === 0) {
    return null;
  }

  return { top, left, width, height };
};

export const useHomeIdeOrchestration = ({
  prefersReducedMotion,
  dragControls,
  heroRef,
  heroBoundsRef,
}: UseHomeIdeOrchestrationOptions): HomeIdeOrchestration => {
  const [ideWindowState, setIdeWindowState] = useState<IdeWindowState>('normal');
  const [expandedIdeViewport, setExpandedIdeViewport] = useState<ExpandedIdeViewport | null>(null);
  const [ideSessionKey, setIdeSessionKey] = useState(0);
  const [ideWindowPortalContainer] = useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    return document.createElement('div');
  });
  const [expandDotHighlighted, setExpandDotHighlighted] = useState(false);
  const [isTypewriterPlaying, setIsTypewriterPlaying] = useState(false);
  const [canDragHeroWindow, setCanDragHeroWindow] = useState(false);
  const [isHeroWindowDragging, setIsHeroWindowDragging] = useState(false);
  const [ideWindowSize, setIdeWindowSize] = useState<IdeWindowSize>(null);
  const [isResizing, setIsResizing] = useState(false);
  const inlineIdeHostRef = useRef<HTMLDivElement | null>(null);
  const expandedIdeHostRef = useRef<HTMLDivElement | null>(null);
  const hasAutoExpandedRef = useRef(false);
  const autoExpandTimerRef = useRef<number | null>(null);
  const resizeEdgeRef = useRef<IdeResizeEdge | null>(null);
  const resizeInitialPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeInitialSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const queueFreshIdeSession = useCallback(() => {
    setIdeSessionKey((prev) => prev + 1);
  }, []);

  const resetWindowInteractions = useCallback(() => {
    setIdeWindowSize(null);
    setIsResizing(false);
    setIsHeroWindowDragging(false);
    resizeEdgeRef.current = null;
  }, []);

  const cancelAutoExpand = useCallback(() => {
    if (autoExpandTimerRef.current !== null) {
      window.clearTimeout(autoExpandTimerRef.current);
      autoExpandTimerRef.current = null;
    }

    setExpandDotHighlighted(false);
  }, []);

  const scheduleAutoExpand = useCallback(() => {
    if (hasAutoExpandedRef.current) {
      return;
    }

    hasAutoExpandedRef.current = true;
    cancelAutoExpand();

    if (prefersReducedMotion) {
      setIdeWindowState((prev) => (prev === 'normal' ? 'expanded' : prev));
      return;
    }

    setExpandDotHighlighted(true);
    autoExpandTimerRef.current = window.setTimeout(() => {
      autoExpandTimerRef.current = null;
      setExpandDotHighlighted(false);
      setIdeWindowState((prev) => (prev === 'normal' ? 'expanded' : prev));
    }, AUTO_EXPAND_PULSE_DURATION_MS);
  }, [cancelAutoExpand, prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia('(hover: hover) and (pointer: fine)');

    const updateCanDragHeroWindow = () => {
      setCanDragHeroWindow(mediaQueryList.matches);
    };

    updateCanDragHeroWindow();

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateCanDragHeroWindow);
      return () => mediaQueryList.removeEventListener('change', updateCanDragHeroWindow);
    }

    mediaQueryList.addListener(updateCanDragHeroWindow);
    return () => mediaQueryList.removeListener(updateCanDragHeroWindow);
  }, []);

  const setInlineIdeHost = useCallback(
    (node: HTMLDivElement | null) => {
      inlineIdeHostRef.current = node;

      if (node && ideWindowState !== 'expanded') {
        attachIdeWindowContainer(ideWindowPortalContainer, node, 'normal');
      }
    },
    [ideWindowPortalContainer, ideWindowState]
  );

  const setExpandedIdeHost = useCallback(
    (node: HTMLDivElement | null) => {
      expandedIdeHostRef.current = node;

      if (node && ideWindowState === 'expanded') {
        attachIdeWindowContainer(ideWindowPortalContainer, node, 'expanded');
      }
    },
    [ideWindowPortalContainer, ideWindowState]
  );

  useLayoutEffect(() => {
    if (ideWindowState === 'expanded') {
      attachIdeWindowContainer(ideWindowPortalContainer, expandedIdeHostRef.current, 'expanded');
      return;
    }

    attachIdeWindowContainer(ideWindowPortalContainer, inlineIdeHostRef.current, 'normal');
  }, [ideWindowPortalContainer, ideWindowState]);

  useEffect(
    () => () => {
      ideWindowPortalContainer?.remove();
    },
    [ideWindowPortalContainer]
  );

  useEffect(() => cancelAutoExpand, [cancelAutoExpand]);

  useEffect(() => {
    if (ideWindowState !== 'expanded') {
      setExpandedIdeViewport(null);
      return undefined;
    }

    setExpandedIdeViewport(resolveExpandedIdeViewport());

    let frameId: number | null = null;

    const handleViewportChange = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        setExpandedIdeViewport(resolveExpandedIdeViewport());
      });
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange);
    };
  }, [ideWindowState]);

  const handleIdeClose = useCallback(() => {
    cancelAutoExpand();
    resetWindowInteractions();
    queueFreshIdeSession();
    setIdeWindowState('closed');
  }, [cancelAutoExpand, queueFreshIdeSession, resetWindowInteractions]);

  const handleIdeMinimize = useCallback(() => {
    cancelAutoExpand();
    resetWindowInteractions();
    queueFreshIdeSession();
    setIdeWindowState('minimized');
  }, [cancelAutoExpand, queueFreshIdeSession, resetWindowInteractions]);

  const handleIdeExpand = useCallback(() => {
    cancelAutoExpand();
    setIdeWindowState((prev) => (prev === 'expanded' ? 'normal' : 'expanded'));
  }, [cancelAutoExpand]);

  const handleIdeRestore = useCallback(() => {
    resetWindowInteractions();
    setIdeWindowState('normal');
  }, [resetWindowInteractions]);

  const handleHeroMotionComplete = useCallback(() => {
    setIsTypewriterPlaying(true);
    scheduleAutoExpand();
  }, [scheduleAutoExpand]);

  const windowDragEnabled = canDragHeroWindow && isTypewriterPlaying;
  const resizeEnabled = canDragHeroWindow && ideWindowState === 'normal' && !isHeroWindowDragging;

  const handleTitleBarPointerDown = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (!windowDragEnabled || ideWindowState !== 'normal' || isResizing || event.button !== 0) {
        return;
      }

      dragControls.start(event);
    },
    [dragControls, ideWindowState, isResizing, windowDragEnabled]
  );

  const handleHeroDragStart = useCallback(() => {
    setIsHeroWindowDragging(true);
  }, []);

  const handleHeroDragEnd = useCallback(() => {
    setIsHeroWindowDragging(false);
  }, []);

  const handleResizeStart = useCallback(
    (edge: IdeResizeEdge, event: ReactPointerEvent<HTMLDivElement>) => {
      if (!resizeEnabled) {
        return;
      }

      const heroEl = heroRef.current?.querySelector<HTMLElement>('[data-testid="terminal-hero"]');
      if (!heroEl) {
        return;
      }

      const rect = heroEl.getBoundingClientRect();
      const boundsRect = heroBoundsRef.current?.getBoundingClientRect();
      const startClientX = Number.isFinite(event.clientX) ? event.clientX : rect.right;
      const startClientY = Number.isFinite(event.clientY) ? event.clientY : rect.bottom;
      const maxWidth = Math.max(
        VSCODE_RESIZE.minWidth,
        boundsRect ? boundsRect.right - rect.left : window.innerWidth - rect.left
      );
      const maxHeight = Math.max(
        VSCODE_RESIZE.minHeight,
        boundsRect ? boundsRect.bottom - rect.top : window.innerHeight - rect.top
      );
      const lockedWidth = Math.min(Math.max(rect.width, VSCODE_RESIZE.minWidth), maxWidth);
      const lockedHeight = Math.min(Math.max(rect.height, VSCODE_RESIZE.minHeight), maxHeight);

      resizeEdgeRef.current = edge;
      resizeInitialPointerRef.current = { x: startClientX, y: startClientY };
      resizeInitialSizeRef.current = { width: lockedWidth, height: lockedHeight };
      setIdeWindowSize({ width: lockedWidth, height: lockedHeight });
      setIsResizing(true);

      const handleMove = (pointerEvent: PointerEvent) => {
        const currentClientX = Number.isFinite(pointerEvent.clientX)
          ? pointerEvent.clientX
          : resizeInitialPointerRef.current.x;
        const currentClientY = Number.isFinite(pointerEvent.clientY)
          ? pointerEvent.clientY
          : resizeInitialPointerRef.current.y;
        const dx = currentClientX - resizeInitialPointerRef.current.x;
        const dy = currentClientY - resizeInitialPointerRef.current.y;
        const activeEdge = resizeEdgeRef.current;
        const initial = resizeInitialSizeRef.current;

        let newWidth = initial.width;
        let newHeight = initial.height;

        if (activeEdge === 'right' || activeEdge === 'corner') {
          newWidth = Math.min(Math.max(initial.width + dx, VSCODE_RESIZE.minWidth), maxWidth);
        }

        if (activeEdge === 'bottom' || activeEdge === 'corner') {
          newHeight = Math.min(Math.max(initial.height + dy, VSCODE_RESIZE.minHeight), maxHeight);
        }

        setIdeWindowSize({ width: newWidth, height: newHeight });
      };

      const handleUp = () => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
        setIsResizing(false);
        resizeEdgeRef.current = null;
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [heroBoundsRef, heroRef, resizeEnabled]
  );

  return {
    ideWindowState,
    ideSessionKey,
    ideVisible: ideWindowState !== 'closed' && ideWindowState !== 'minimized',
    expandedIdeViewport,
    ideWindowPortalContainer,
    expandDotHighlighted,
    isTypewriterPlaying,
    windowDragEnabled,
    isHeroWindowDragging,
    resizeWidth: ideWindowSize?.width,
    resizeHeight: ideWindowSize?.height,
    resizeEnabled,
    isResizing,
    setInlineIdeHost,
    setExpandedIdeHost,
    handleHeroMotionComplete,
    handleTitleBarPointerDown,
    handleHeroDragStart,
    handleHeroDragEnd,
    handleResizeStart,
    handleIdeClose,
    handleIdeMinimize,
    handleIdeExpand,
    handleIdeRestore,
  };
};
