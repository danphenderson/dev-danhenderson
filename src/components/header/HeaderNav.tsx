import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type HeaderPage = {
  name: string;
  path: string;
};

type HeaderNavProps = {
  pages: HeaderPage[];
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
  isMobile,
  iconButtonSize,
  headerIconSx,
  mobileMenuOpen,
  mobileMenuAnchor,
  onMobileMenuOpen,
  onMobileMenuClose,
  leftContent,
}: HeaderNavProps) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 }, flexShrink: 0 }}>
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
          >
            <MenuIcon sx={headerIconSx} />
          </IconButton>
        )}
        {leftContent}
      </Box>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', minWidth: 0 }}>
        <Stack direction="row" spacing={{ md: 5 }}>
          {pages.map(({ name, path }) => (
            <Button
              key={name}
              size="large"
              sx={{ color: 'white', fontSize: { md: '1.5rem' } }}
              component={Link}
              to={path}
              aria-label={`Go to ${name}`}
            >
              {name}
            </Button>
          ))}
        </Stack>
      </Box>
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
            {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
