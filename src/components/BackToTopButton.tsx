import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { Fab, Zoom } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useAppStyles } from '../styles/appStyles';
import { HEADER_HIDE_SCROLL_TRIGGER_OPTIONS } from './header/headerScroll';

export const BackToTopButton = () => {
  const appStyles = useAppStyles();
  const isVisible = useScrollTrigger(HEADER_HIDE_SCROLL_TRIGGER_OPTIONS);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible} timeout={{ enter: 180, exit: 140 }} unmountOnExit>
      <Fab aria-label="Back to top" onClick={handleBackToTop} sx={appStyles.backToTopFabSx}>
        <KeyboardArrowUpRoundedIcon />
      </Fab>
    </Zoom>
  );
};
