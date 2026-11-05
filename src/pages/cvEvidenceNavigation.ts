import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { codingExamples, currentWorkflowEvidence, experiences } from '../data/cv';
import { siteRouteMap } from '../constants/siteRoutes';
import type { CVEntryRequest } from '../types/cv';
import type { SkillChipLink } from '../types/ui';
import { getCVEntryAnchor, resolveCVEntryTarget } from '../utils/cvEvidence';

const isVisible = (node: HTMLElement) => {
  for (let element: HTMLElement | null = node; element; element = element.parentElement) {
    const style = getComputedStyle(element);
    if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0')
      return false;
  }
  return true;
};

export const useCVEvidenceNavigation = (storyMode: boolean) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const origins = useRef(new Map<string, { id: string; scrollY: number }>());
  const [repeat, setRepeat] = useState(0);
  const origin = navigationType === 'POP' ? origins.current.get(location.key) : undefined;
  const request = useMemo<CVEntryRequest | undefined>(() => {
    if (storyMode || origin) return undefined;
    const target = resolveCVEntryTarget(location.hash, codingExamples, experiences);
    return target ? { ...target, requestKey: `${location.key}:${repeat}` } : undefined;
  }, [location.hash, location.key, repeat, storyMode, origin]);

  const rememberOrigin = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const destination = new URL(event.currentTarget.href);
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash === location.hash
      ) {
        event.preventDefault();
        origins.current.delete(location.key);
        setRepeat((value) => value + 1);
        return;
      }
      origins.current.set(location.key, { id: event.currentTarget.id, scrollY: window.scrollY });
    },
    [location.hash, location.key]
  );

  const skillLinks = useMemo<Partial<Record<string, SkillChipLink>>>(
    () =>
      Object.fromEntries(
        Object.entries(currentWorkflowEvidence).flatMap(([skill, evidence]) => {
          if (!evidence) return [];
          const hash = getCVEntryAnchor(evidence.target.kind, evidence.target.entryId);
          return [
            [
              skill,
              {
                id: `cv-stack-${skill.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                to: `${siteRouteMap.cv.path}#${hash}`,
                accessibleLabel: evidence.accessibleLabel,
                onClick: rememberOrigin,
              },
            ],
          ];
        })
      ),
    [rememberOrigin]
  );

  useEffect(() => {
    if (storyMode || (!request && !origin)) return;
    const root = document.getElementById('main-content');
    if (!root) return;
    let frame = 0;
    let scrolled = false;
    let done = false;
    const anchor = request ? getCVEntryAnchor(request.kind, request.entryId) : undefined;
    const settle = () => {
      frame = 0;
      if (done) return;
      if (origin) {
        const chip = document.getElementById(origin.id);
        if (!chip || !isVisible(chip)) return;
        window.scrollTo({ top: origin.scrollY, behavior: 'instant' });
        chip.focus({ preventScroll: true });
      } else {
        const entry = document.getElementById(anchor!);
        if (!entry) return;
        if (!scrolled) {
          entry.scrollIntoView({ block: 'start', behavior: 'instant' });
          scrolled = true;
        }
        const heading = document.getElementById(`${anchor}-heading`);
        if (!heading || entry.dataset.cvEntryVisible !== 'true' || !isVisible(heading)) return;
        heading.focus({ preventScroll: true });
      }
      done = true;
      observer.disconnect();
    };
    // Mount and visibility notifications are bounded by this navigation's lifetime.
    // There is no timer guessing how long the existing entrance animation takes.
    const observer = new MutationObserver(() => {
      if (!frame && !done) frame = requestAnimationFrame(settle);
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'data-cv-entry-visible'],
    });
    // Let the browser finish native fragment navigation before assigning focus.
    frame = requestAnimationFrame(settle);
    return () => {
      done = true;
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [request, origin, storyMode]);

  return { request, skillLinks };
};
