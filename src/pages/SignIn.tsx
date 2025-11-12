import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';
import { Alert, Icon } from '@mui/material';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import { SitemarkIcon } from '../components/CustomIcons';
import logo from '../../public/spend_tracker_logo.png'
import logoDark from '../../public/spend_tracker_logo_dark.png'

import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function SignInContent() {
  const { login } = useAuth();
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isValid = true;
    if (!username.trim()) {
      setUsernameError(true);
      setUsernameErrorMessage('Please enter your username.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    if (!isValid) return;

    setLoading(true);
    setSuccessMessage('');

    try {
      await login(username, password);
      setSuccessMessage('Login successful!');
      toast.success('¡Sesión iniciada!');
      navigate('/dashboard', { replace: true });

    } catch {
      setPasswordError(true);
      setPasswordErrorMessage('Invalid username or password');
      setSuccessMessage('');
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
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
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign in
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMessage}
                id="username"
                name="username"
                placeholder="your_username"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={usernameError ? 'error' : 'primary'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
              Sign up
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
    </>
  );
}

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <SignInContent />
    </AppTheme>
  );
}
