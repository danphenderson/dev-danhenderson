import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppStyles } from '../../styles/appStyles';
import { NavigationLabel } from '../text';

export type HeaderPage = {
  name: string;
  path: string;
};

type HeaderNavProps = {
  pages: HeaderPage[];
  currentPath: string;
  isMobile: boolean;
  iconButtonSize: 'small' | 'medium' | 'large';
  headerIconSx: SxProps<Theme>;
  avatarSrc: string;
  mobileMenuOpen: boolean;
  mobileMenuAnchor: HTMLElement | null;
  onMobileMenuOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  onMobileMenuClose: () => void;
};

const isActivePage = (currentPath: string, pagePath: string): boolean =>
  pagePath === '/'
    ? currentPath === '/'
    : currentPath.startsWith(pagePath);

export const HeaderNav = ({
  pages,
  currentPath,
  isMobile,
  iconButtonSize,
  headerIconSx,
  avatarSrc,
  mobileMenuOpen,
  mobileMenuAnchor,
  onMobileMenuOpen,
  onMobileMenuClose,
}: HeaderNavProps) => {
  const appStyles = useAppStyles();

  return (
    <>
      <Box sx={appStyles.headerNavLeadSx}>
        <Box component={Link} to="/" sx={appStyles.headerAvatarLinkSx} aria-label="Go to Home">
          <Avatar src={avatarSrc} alt="Daniel Henderson" sx={appStyles.headerAvatarSx} />
        </Box>
        {isMobile && (
          <IconButton
            id="mobile-nav-button"
            color="inherit"
            size={iconButtonSize}
            onClick={onMobileMenuOpen}
            aria-label="Open navigation menu"
            aria-controls={mobileMenuOpen ? 'mobile-nav-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={mobileMenuOpen ? 'true' : undefined}
            sx={appStyles.headerIconButtonSx}
          >
            <MenuIcon sx={headerIconSx} />
          </IconButton>
        )}
      </Box>
      {!isMobile && (
        <Box sx={appStyles.headerNavDesktopSx}>
          <Stack direction="row" spacing={{ md: 5 }}>
            {pages.map(({ name, path }) => (
              <Button
                key={name}
                size="large"
                sx={
                  isActivePage(currentPath, path)
                    ? appStyles.headerNavButtonActiveSx
                    : appStyles.headerNavButtonSx
                }
                component={Link}
                to={path}
                aria-label={`Go to ${name}`}
                aria-current={isActivePage(currentPath, path) ? 'page' : undefined}
              >
                <NavigationLabel>{name}</NavigationLabel>
              </Button>
            ))}
          </Stack>
        </Box>
      )}
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
          <MenuItem
            key={name}
            component={Link}
            to={path}
            onClick={onMobileMenuClose}
            selected={isActivePage(currentPath, path)}
          >
            <NavigationLabel>{name}</NavigationLabel>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
