import * as React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AboutMe } from '../../types/cv';
import { DEFAULT_INTERSECTION_ROOT_MARGIN } from '../../motion';
import { useComponentStyles } from '../../styles/componentStyles';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import { mergeSx, Text } from '../text';
import { useTypewriterProgress, type TypewriterTimingPreset } from '../text/useTypewriterProgress';

const STATUS_MARKER = 'Open to opportunities';

type BioSegment = {
  kind: 'text' | 'link' | 'status';
  text: string;
};

type RenderSegmentOptions = {
  ariaHidden?: boolean;
  includeTooltipProps?: boolean;
  disableLinkFocus?: boolean;
  renderStatusSpan?: boolean;
};

export type CVAboutBioTypewriterProps = {
  about: AboutMe;
  revealed?: boolean;
  timingPreset?: TypewriterTimingPreset;
  typingBaseMs?: number;
  cursorChar?: React.ReactNode;
  reserveWidth?: boolean;
  startDelayMs?: number;
  cursorSx?: SxProps<Theme>;
  onComplete?: () => void;
};

const layerSx: SxProps<Theme> = {
  gridArea: '1 / 1',
  display: 'block',
  width: '100%',
  minWidth: 0,
  whiteSpace: 'inherit',
  lineHeight: 'inherit',
  font: 'inherit',
  letterSpacing: 'inherit',
  color: 'inherit',
  textTransform: 'inherit',
};

const visuallyHiddenSx: SxProps<Theme> = {
  position: 'absolute',
  width: 1,
  height: 1,
  p: 0,
  m: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const getLineStart = (text: string, markerIndex: number): number => {
  const lastNewline = text.lastIndexOf('\n', markerIndex);
  return lastNewline >= 0 ? lastNewline + 1 : markerIndex;
};

const buildBioSegments = (about: AboutMe): BioSegment[] => {
  const bioText = about.bio;
  const bioLink = about.bioLink;
  const bioLinkIndex = bioLink ? bioText.indexOf(bioLink.text) : -1;
  const statusIndex = bioText.indexOf(STATUS_MARKER);
  const statusLineStart = statusIndex >= 0 ? getLineStart(bioText, statusIndex) : -1;
  const segments: BioSegment[] = [];

  const pushTextSegment = (text: string) => {
    if (text) {
      segments.push({ kind: 'text', text });
    }
  };

  if (bioLink && bioLinkIndex >= 0) {
    const beforeLink = bioText.slice(0, bioLinkIndex);
    const afterLinkStart = bioLinkIndex + bioLink.text.length;

    pushTextSegment(beforeLink);
    segments.push({ kind: 'link', text: bioLink.text });

    if (statusLineStart >= afterLinkStart) {
      pushTextSegment(bioText.slice(afterLinkStart, statusLineStart));
      segments.push({ kind: 'status', text: bioText.slice(statusLineStart) });
      return segments;
    }

    pushTextSegment(bioText.slice(afterLinkStart));
    return segments;
  }

  if (statusLineStart >= 0) {
    pushTextSegment(bioText.slice(0, statusLineStart));
    segments.push({ kind: 'status', text: bioText.slice(statusLineStart) });
    return segments;
  }

  pushTextSegment(bioText);
  return segments;
};

const getVisibleSegmentText = (segment: BioSegment, visibleCharsRemaining: number) =>
  segment.text.slice(0, Math.max(0, Math.min(segment.text.length, visibleCharsRemaining)));

const renderSegment = (
  segment: BioSegment,
  text: string,
  about: AboutMe,
  key: string,
  statusBreatheSx: SxProps<Theme>,
  {
    ariaHidden,
    includeTooltipProps = true,
    disableLinkFocus = false,
    renderStatusSpan = true,
  }: RenderSegmentOptions = {}
) => {
  if (!text) {
    return null;
  }

  if (segment.kind === 'link' && about.bioLink) {
    const bioLinkTooltipProps =
      includeTooltipProps && about.bioLink.tooltip
        ? {
            'data-tooltip-id': COMMON_LINK_TOOLTIP_ID,
            'data-tooltip-content': about.bioLink.tooltip,
            'data-tooltip-place': 'top-start' as const,
          }
        : {};

    return (
      <CommonLink
        key={key}
        href={about.bioLink.url}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        tabIndex={disableLinkFocus ? -1 : undefined}
        {...bioLinkTooltipProps}
      >
        {text}
      </CommonLink>
    );
  }

  if (segment.kind === 'status' && renderStatusSpan) {
    return (
      <Text
        key={key}
        role="inlineLabel"
        tone="support"
        component="span"
        aria-hidden={ariaHidden}
        sx={statusBreatheSx}
      >
        {text}
      </Text>
    );
  }

  return <React.Fragment key={key}>{text}</React.Fragment>;
};

const renderSegments = (
  segments: BioSegment[],
  about: AboutMe,
  visibleChars: number,
  statusBreatheSx: SxProps<Theme>,
  options?: RenderSegmentOptions
) => {
  let remainingChars = visibleChars;

  return segments.map((segment, index) => {
    const text = getVisibleSegmentText(segment, remainingChars);
    remainingChars -= segment.text.length;

    return renderSegment(
      segment,
      text,
      about,
      `${segment.kind}-${index}`,
      statusBreatheSx,
      options
    );
  });
};

export const CVAboutBioTypewriter = ({
  about,
  revealed = false,
  timingPreset = 'cvBio',
  typingBaseMs,
  cursorChar = '|',
  reserveWidth = true,
  startDelayMs = 0,
  cursorSx,
  onComplete,
}: CVAboutBioTypewriterProps) => {
  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const startTimeoutRef = React.useRef<number | undefined>(undefined);
  const hasNotifiedCompletionRef = React.useRef(false);
  const [shouldPlay, setShouldPlay] = React.useState(false);
  const { statusBreatheSx } = useComponentStyles();
  const segments = React.useMemo(() => buildBioSegments(about), [about]);
  const fullText = React.useMemo(
    () => segments.map((segment) => segment.text).join(''),
    [segments]
  );

  React.useEffect(() => {
    if (revealed || shouldPlay) {
      return undefined;
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      setShouldPlay(true);
      return undefined;
    }

    const node = rootRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();

        if (startDelayMs <= 0) {
          setShouldPlay(true);
          return;
        }

        startTimeoutRef.current = window.setTimeout(() => {
          setShouldPlay(true);
          startTimeoutRef.current = undefined;
        }, startDelayMs);
      },
      { threshold: 0, rootMargin: DEFAULT_INTERSECTION_ROOT_MARGIN }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();

      if (startTimeoutRef.current !== undefined) {
        window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = undefined;
      }
    };
  }, [revealed, shouldPlay, startDelayMs]);

  const { charIndex, isComplete, showCursor } = useTypewriterProgress({
    text: fullText,
    playing: shouldPlay,
    timingPreset,
    typingBaseMs,
  });

  React.useEffect(() => {
    if (!onComplete || !fullText || hasNotifiedCompletionRef.current) {
      return;
    }

    if (!isComplete) {
      return;
    }

    hasNotifiedCompletionRef.current = true;
    onComplete();
  }, [fullText, isComplete, onComplete]);

  const visibleChars = isComplete ? fullText.length : charIndex;
  const renderStaticVisibleLayer = isComplete;
  const renderAccessibleLayer = !renderStaticVisibleLayer;

  if (!fullText) {
    return null;
  }

  if (revealed) {
    return (
      <Box
        component="span"
        sx={{
          position: 'relative',
          display: 'grid',
          width: '100%',
          minWidth: 0,
          alignItems: 'start',
        }}
      >
        <Box component="span" data-typewriter-layer="animated" sx={layerSx}>
          {renderSegments(segments, about, fullText.length, statusBreatheSx)}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={rootRef}
      component="span"
      sx={{
        position: 'relative',
        display: 'grid',
        width: '100%',
        minWidth: 0,
        alignItems: 'start',
      }}
    >
      {renderAccessibleLayer && (
        <Box component="span" sx={visuallyHiddenSx} data-typewriter-layer="accessible">
          {renderSegments(segments, about, fullText.length, statusBreatheSx, {
            includeTooltipProps: false,
            disableLinkFocus: true,
            renderStatusSpan: false,
          })}
        </Box>
      )}

      {reserveWidth && !renderStaticVisibleLayer && (
        <Box
          component="span"
          aria-hidden
          data-typewriter-layer="reserve"
          sx={mergeSx(layerSx, {
            visibility: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
          })}
        >
          {renderSegments(segments, about, fullText.length, statusBreatheSx, {
            includeTooltipProps: false,
            disableLinkFocus: true,
          })}
        </Box>
      )}

      <Box
        component="span"
        aria-hidden={renderAccessibleLayer || undefined}
        data-typewriter-layer="animated"
        sx={layerSx}
      >
        {renderSegments(segments, about, visibleChars, statusBreatheSx, {
          disableLinkFocus: renderAccessibleLayer,
        })}

        {!renderStaticVisibleLayer && shouldPlay && showCursor && (
          <Box
            component="span"
            sx={mergeSx(
              {
                display: 'inline-block',
                width: '0.65ch',
                ml: '1px',
                userSelect: 'none',
              },
              cursorSx
            )}
          >
            {cursorChar}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CVAboutBioTypewriter;
