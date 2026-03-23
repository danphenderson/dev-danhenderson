import { alpha, useTheme } from '@mui/material/styles';
import { Tooltip } from 'react-tooltip';
import { COMMON_LINK_TOOLTIP_ID } from './CommonLink';

export const CommonLinkTooltip = () => {
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.92)
      : alpha(theme.palette.background.paper, 0.96);
  const borderColor = alpha(
    theme.palette.secondary.main,
    theme.palette.mode === 'light' ? 0.2 : 0.34
  );

  return (
    <Tooltip
      id={COMMON_LINK_TOOLTIP_ID}
      place="top"
      offset={10}
      opacity={1}
      border={`1px solid ${borderColor}`}
      positionStrategy="fixed"
      openEvents={{ mouseenter: true, focus: true }}
      closeEvents={{ mouseleave: true, blur: true }}
      style={{
        backgroundColor,
        color: theme.palette.common.white,
        borderRadius: 12,
        boxShadow: theme.shadows[4],
        fontSize: theme.typography.pxToRem(13),
        lineHeight: 1.35,
        maxWidth: 280,
        padding: '10px 12px',
        zIndex: theme.zIndex.tooltip,
      }}
    />
  );
};
