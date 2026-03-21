import ArticleIcon from '@mui/icons-material/Article';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import TerrainIcon from '@mui/icons-material/Terrain';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { MouseEvent, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { siteRouteMap, type SiteRouteDefinition } from '../../constants/siteRoutes';
import { useMotionScale } from '../../motion';
import { useAppStyles } from '../../styles/appStyles';
import { NavigationLabel } from '../text';

type HeaderNavProps = {
  pages: SiteRouteDefinition[];
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
  const { duration: dFactor } = useMotionScale();
  const MENU_BASE_DURATION_MS = 200;
  const menuTransitionDuration = dFactor === 0 ? 0 : Math.round(MENU_BASE_DURATION_MS * dFactor);
  const showHomeAvatar = !isMobile && !isActivePage(currentPath, '/');
  const mobilePages = [...pages, siteRouteMap.home].filter(
    ({ path }) => !isActivePage(currentPath, path)
  );

  const getPageChipIcon = (path: string): ReactElement | undefined => {
    switch (path) {
      case '/cv':
        return <DescriptionIcon fontSize="small" />;
      case '/climbing':
        return <TerrainIcon fontSize="small" />;
      case '/photography':
        return <CameraAltIcon fontSize="small" />;
      case '/blog':
        return <ArticleIcon fontSize="small" />;
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
          <Stack direction="row" spacing={1}>
            {pages.map(({ id, label, path }) => (
              <Button
                key={id}
                size="small"
                sx={
                  isActivePage(currentPath, path)
                    ? appStyles.headerNavButtonActiveSx
                    : appStyles.headerNavButtonSx
                }
                component={Link}
                to={path}
                aria-label={`Go to ${label}`}
                aria-current={isActivePage(currentPath, path) ? 'page' : undefined}
              >
                <NavigationLabel>{label}</NavigationLabel>
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
        transitionDuration={menuTransitionDuration}
        MenuListProps={{ 'aria-labelledby': 'mobile-nav-button' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {mobilePages.map(({ id, label, path }) => (
          <MenuItem key={id} component={Link} to={path} onClick={onMobileMenuClose}>
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
              <NavigationLabel sx={{ flex: 1, textAlign: 'left' }}>{label}</NavigationLabel>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
