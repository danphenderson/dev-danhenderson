import { forwardRef } from 'react';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';
import type { PlacesType, PositionStrategy, VariantType, WrapperType } from 'react-tooltip';

export const COMMON_LINK_TOOLTIP_ID = 'common-link-tooltip';

type ReactTooltipDataAttributes = {
  'data-tooltip-id'?: string;
  'data-tooltip-content'?: string;
  'data-tooltip-html'?: string;
  'data-tooltip-place'?: PlacesType;
  'data-tooltip-position-strategy'?: PositionStrategy;
  'data-tooltip-variant'?: VariantType;
  'data-tooltip-offset'?: number;
  'data-tooltip-wrapper'?: WrapperType;
  'data-tooltip-delay-show'?: number;
  'data-tooltip-delay-hide'?: number;
  'data-tooltip-float'?: boolean;
  'data-tooltip-hidden'?: boolean;
  'data-tooltip-class-name'?: string;
};

export type CommonLinkProps = MuiLinkProps<'a', ReactTooltipDataAttributes>;

/**
 * Shared anchor-style link surface for the app's external links.
 * Keeps MUI Link behavior intact while typing the data attributes
 * used by react-tooltip for hover-triggered tooltips.
 */
export const CommonLink = forwardRef<HTMLAnchorElement, CommonLinkProps>(
  function CommonLink(props, ref) {
    return <MuiLink ref={ref} {...props} />;
  }
);
