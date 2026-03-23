import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { Fab, Zoom } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useMotionScale } from '../motion';
import { useAppStyles } from '../styles/appStyles';
import { HEADER_HIDE_SCROLL_TRIGGER_OPTIONS } from './header/headerScroll';

const ZOOM_BASE_ENTER_MS = 180;
const ZOOM_BASE_EXIT_MS = 140;

export const BackToTopButton = () => {
  const appStyles = useAppStyles();
  const { duration: dFactor } = useMotionScale();
  const isVisible = useScrollTrigger(HEADER_HIDE_SCROLL_TRIGGER_OPTIONS);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: dFactor === 0 ? 'auto' : 'smooth',
    });
  };

  const zoomTimeout =
    dFactor === 0
      ? 0
      : {
          enter: Math.round(ZOOM_BASE_ENTER_MS * dFactor),
          exit: Math.round(ZOOM_BASE_EXIT_MS * dFactor),
        };

  return (
    <Zoom in={isVisible} timeout={zoomTimeout} unmountOnExit>
      <Fab aria-label="Back to top" onClick={handleBackToTop} sx={appStyles.backToTopFabSx}>
        <KeyboardArrowUpRoundedIcon />
      </Fab>
    </Zoom>
  );
};
