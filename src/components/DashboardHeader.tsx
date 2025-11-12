import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router';
import ThemeSwitcher from './ThemeSwitcher';
import logosp from '../../public/spend_tracker_logo.png'
import logospDark from '../../public/spend_tracker_logo_dark.png'

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled('div')({
  position: 'relative',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  '& img': {
    maxHeight: 40,
  },
});

export interface DashboardHeaderProps {
  logo?: React.ReactNode;
  title?: string;
  menuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
}

export default function DashboardHeader({
  logo,
  title,
  menuOpen,
  onToggleMenu,
}: DashboardHeaderProps) {
  const theme = useTheme();

  const handleMenuOpen = React.useCallback(() => {
    onToggleMenu(!menuOpen);
  }, [menuOpen, onToggleMenu]);

  const getMenuIcon = React.useCallback(
    (isExpanded: boolean) => {
      const expandMenuActionText = 'Expand';
      const collapseMenuActionText = 'Collapse';

      return (
        <Tooltip
          title={`${isExpanded ? collapseMenuActionText : expandMenuActionText} menu`}
          enterDelay={1000}
        >
          <div>
            <IconButton
              size="small"
              aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
              onClick={handleMenuOpen}
            >
              {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </Tooltip>
      );
    },
    [handleMenuOpen],
  );

  return (
    <AppBar color="inherit" position="absolute" sx={{ displayPrint: 'none' }}>
      <Toolbar sx={{ backgroundColor: 'inherit', mx: { xs: -0.75, sm: -1 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Stack direction="row" alignItems="center">
            <Box sx={{ mr: 1 }}>{getMenuIcon(menuOpen)}</Box>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center">
                <Box
                  sx={{
                    position: 'relative',
                    '& img': {
                      width: 100,
                      height: 90,
                    },
                    ...(theme.getColorSchemeSelector ? {
                      [`& img[data-logo="light"]`]: {
                        display: 'block',
                        [theme.getColorSchemeSelector('dark')]: {
                          display: 'none',
                        },
                      },
                      [`& img[data-logo="dark"]`]: {
                        display: 'none',
                        [theme.getColorSchemeSelector('dark')]: {
                          display: 'block',
                        },
                      },
                    } : {}),
                  }}
                >
                  <img src={logospDark} data-logo="light" alt="Spend Tracker" />
                  <img src={logosp} data-logo="dark" alt="Spend Tracker" />
                </Box>
                {title ? (
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme.vars ?? theme).palette.primary.main,
                      fontWeight: '700',
                      ml: 1,
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    {title}
                  </Typography>
                ) : null}
              </Stack>
            </Link>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ marginLeft: 'auto' }}
          >
            <Stack direction="row" alignItems="center">
              <ThemeSwitcher />
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
