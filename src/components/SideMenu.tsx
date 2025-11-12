import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import logo from '../../public/spend_tracker_logo.png'
import logoDark from '../../public/spend_tracker_logo_dark.png'

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSpendingsClick = () => {
    navigate('/dashboard/expenses');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <a href='/dashboard' style={{ margin: '0 auto' }}>
        <Box
          sx={{
            position: 'relative',
            '& img': {
              width: 100,
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
          <img src={logoDark} data-logo="light" alt="Spend Tracker" />
          <img src={logo} data-logo="dark" alt="Spend Tracker" />
        </Box>
      </a>
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={<AccountBalanceWalletRoundedIcon />}
          onClick={handleSpendingsClick}
        >
          Spendings
        </Button>
      </Stack>
    </Drawer>
  );
}