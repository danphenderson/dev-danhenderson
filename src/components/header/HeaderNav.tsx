import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import TerrainIcon from '@mui/icons-material/Terrain';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { MouseEvent, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useAppStyles } from '../../styles/appStyles';
import { NavigationLabel } from '../text';

export type HeaderPage = {
  name: string;
  path: string;
};

const HOME_PAGE: HeaderPage = {
  name: 'Home',
  path: '/',
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
  pagePath === '/' ? currentPath === '/' : currentPath.startsWith(pagePath);

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
  const showHomeAvatar = !isMobile && !isActivePage(currentPath, '/');
  const mobilePages = [...pages, HOME_PAGE].filter(({ path }) => !isActivePage(currentPath, path));

  const getPageChipIcon = (path: string): ReactElement | undefined => {
    switch (path) {
      case '/cv':
        return <DescriptionIcon fontSize="small" />;
      case '/climbing':
        return <TerrainIcon fontSize="small" />;
      case '/photography':
        return <CameraAltIcon fontSize="small" />;
      case '/':
        return (
          <Avatar
            src={avatarSrc}
            alt="Daniel Henderson"
            sx={{
              width: 24,
              height: 24,
              border: (theme) => `1px solid ${theme.palette.common.white}`,
            }}
          />
        );
      default:
        return undefined;
    }
  };

  return (
    <>
      <Box sx={appStyles.headerNavLeadSx}>
        {showHomeAvatar ? (
          <Box component={Link} to="/" sx={appStyles.headerAvatarLinkSx} aria-label="Go to Home">
            <Avatar src={avatarSrc} alt="Daniel Henderson" sx={appStyles.headerAvatarSx} />
          </Box>
        ) : null}
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
        {mobilePages.map(({ name, path }) => (
          <MenuItem key={name} component={Link} to={path} onClick={onMobileMenuClose}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1.5,
                width: '100%',
              }}
            >
              {getPageChipIcon(path)}
              <NavigationLabel sx={{ flex: 1, textAlign: 'left' }}>{name}</NavigationLabel>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
