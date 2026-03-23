import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { duration } from '../motion/tokens';
import type { IdeWindowState } from '../types/ui';

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
  onResetWindowSize?: () => void;
};

type HomeIdeOrchestration = {
  ideWindowState: IdeWindowState;
  ideSessionKey: number;
  ideVisible: boolean;
  expandedIdeViewport: ExpandedIdeViewport | null;
  ideWindowPortalContainer: HTMLDivElement | null;
  expandDotHighlighted: boolean;
  setInlineIdeHost: (node: HTMLDivElement | null) => void;
  setExpandedIdeHost: (node: HTMLDivElement | null) => void;
  handleIdeClose: () => void;
  handleIdeMinimize: () => void;
  handleIdeExpand: () => void;
  handleIdeRestore: () => void;
  scheduleAutoExpand: () => void;
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
  onResetWindowSize,
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
  const inlineIdeHostRef = useRef<HTMLDivElement | null>(null);
  const expandedIdeHostRef = useRef<HTMLDivElement | null>(null);
  const hasAutoExpandedRef = useRef(false);
  const autoExpandTimerRef = useRef<number | null>(null);

  const queueFreshIdeSession = useCallback(() => {
    setIdeSessionKey((prev) => prev + 1);
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
    queueFreshIdeSession();
    setIdeWindowState('closed');
    onResetWindowSize?.();
  }, [cancelAutoExpand, onResetWindowSize, queueFreshIdeSession]);

  const handleIdeMinimize = useCallback(() => {
    cancelAutoExpand();
    queueFreshIdeSession();
    setIdeWindowState('minimized');
    onResetWindowSize?.();
  }, [cancelAutoExpand, onResetWindowSize, queueFreshIdeSession]);

  const handleIdeExpand = useCallback(() => {
    cancelAutoExpand();
    setIdeWindowState((prev) => (prev === 'expanded' ? 'normal' : 'expanded'));
  }, [cancelAutoExpand]);

  const handleIdeRestore = useCallback(() => {
    setIdeWindowState('normal');
    onResetWindowSize?.();
  }, [onResetWindowSize]);

  return {
    ideWindowState,
    ideSessionKey,
    ideVisible: ideWindowState !== 'closed' && ideWindowState !== 'minimized',
    expandedIdeViewport,
    ideWindowPortalContainer,
    expandDotHighlighted,
    setInlineIdeHost,
    setExpandedIdeHost,
    handleIdeClose,
    handleIdeMinimize,
    handleIdeExpand,
    handleIdeRestore,
    scheduleAutoExpand,
  };
};
