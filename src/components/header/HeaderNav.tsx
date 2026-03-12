import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAppStyles } from '../../styles/appStyles';
import { NavigationLabel } from '../text';

export type HeaderPage = {
  name: string;
  path: string;
};

type HeaderNavProps = {
  pages: HeaderPage[];
  showNavigationLinks: boolean;
  isMobile: boolean;
  iconButtonSize: 'small' | 'medium' | 'large';
  headerIconSx: SxProps<Theme>;
  mobileMenuOpen: boolean;
  mobileMenuAnchor: HTMLElement | null;
  onMobileMenuOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  onMobileMenuClose: () => void;
  leftContent?: ReactNode;
};

export const HeaderNav = ({
  pages,
  showNavigationLinks,
  isMobile,
  iconButtonSize,
  headerIconSx,
  mobileMenuOpen,
  mobileMenuAnchor,
  onMobileMenuOpen,
  onMobileMenuClose,
  leftContent,
}: HeaderNavProps) => {
  const appStyles = useAppStyles();

  return (
    <>
      <Box sx={appStyles.headerNavLeadSx}>
        {showNavigationLinks && isMobile && (
          <IconButton
            id="mobile-nav-button"
            color="inherit"
            size={iconButtonSize}
            onClick={onMobileMenuOpen}
            aria-label="Open navigation menu"
            aria-controls={mobileMenuOpen ? 'mobile-nav-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={mobileMenuOpen ? 'true' : undefined}
          >
            <MenuIcon sx={headerIconSx} />
          </IconButton>
        )}
        {leftContent}
      </Box>
      {showNavigationLinks && (
        <Box sx={appStyles.headerNavDesktopSx}>
          <Stack direction="row" spacing={{ md: 5 }}>
            {pages.map(({ name, path }) => (
              <Button
                key={name}
                size="large"
                sx={appStyles.headerNavButtonSx}
                component={Link}
                to={path}
                aria-label={`Go to ${name}`}
              >
                <NavigationLabel>{name}</NavigationLabel>
              </Button>
            ))}
          </Stack>
        </Box>
      )}
      {showNavigationLinks && (
        <Menu
          id="mobile-nav-menu"
          anchorEl={mobileMenuAnchor}
          open={mobileMenuOpen}
          onClose={onMobileMenuClose}
          MenuListProps={{ 'aria-labelledby': 'mobile-nav-button' }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {pages.map(({ name, path }) => (
            <MenuItem key={name} component={Link} to={path} onClick={onMobileMenuClose}>
              <NavigationLabel>{name}</NavigationLabel>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};
