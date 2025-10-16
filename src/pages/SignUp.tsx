import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import {SitemarkIcon} from '../components/CustomIcons';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '650px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
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

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordValidator: string;
  first_name: string;
  last_name: string;
  currency: string;
  income_period: string;
  income_amount: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  passwordValidator?: string;
  first_name?: string;
  last_name?: string;
  currency?: string;
  income_period?: string;
  income_amount?: string;
}

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [formData, setFormData] = React.useState<FormData>({
    username: '',
    email: '',
    password: '',
    passwordValidator: '',
    first_name: '',
    last_name: '',
    currency: 'USD',
    income_period: 'monthly',
    income_amount: '',
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [loading, setLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.first_name || formData.first_name.length < 1) {
      newErrors.first_name = 'First name is required.';
    }

    if (!formData.last_name || formData.last_name.length < 1) {
      newErrors.last_name = 'Last name is required.';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.passwordValidator) {
      newErrors.passwordValidator = 'Please confirm your password.';
    } else if (formData.password !== formData.passwordValidator) {
      newErrors.passwordValidator = 'Passwords do not match.';
    }

    if (!formData.income_amount || parseFloat(formData.income_amount) < 0) {
      newErrors.income_amount = 'Please enter a valid amount.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        if (data.username) {
          setErrors(prev => ({ ...prev, username: data.username[0] }));
        }
        if (data.email) {
          setErrors(prev => ({ ...prev, email: data.email[0] }));
        }
        setErrorMessage(data.detail || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                name="username"
                required
                fullWidth
                id="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={loading}
              />
            </FormControl>

            {/* Fila 2: First name y Last name */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel htmlFor="first_name">First name</FormLabel>
                <TextField
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  disabled={loading}
                />
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <FormLabel htmlFor="last_name">Last name</FormLabel>
                <TextField
                  name="last_name"
                  required
                  fullWidth
                  id="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                  disabled={loading}
                />
              </FormControl>
            </Box>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="passwordValidator">Confirm Password</FormLabel>
              <TextField
                required
                fullWidth
                name="passwordValidator"
                placeholder="••••••"
                type="password"
                id="passwordValidator"
                autoComplete="new-password"
                variant="outlined"
                value={formData.passwordValidator}
                onChange={handleChange}
                error={!!errors.passwordValidator}
                helperText={errors.passwordValidator}
                disabled={loading}
              />
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel htmlFor="currency">Currency</FormLabel>
                <TextField
                  name="currency"
                  required
                  fullWidth
                  id="currency"
                  placeholder="USD"
                  value={formData.currency}
                  onChange={handleChange}
                  error={!!errors.currency}
                  helperText={errors.currency}
                  disabled={loading}
                />
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <FormLabel htmlFor="income_period">Income Period</FormLabel>
                <TextField
                  name="income_period"
                  required
                  fullWidth
                  id="income_period"
                  select
                  value={formData.income_period}
                  onChange={handleChange}
                  error={!!errors.income_period}
                  helperText={errors.income_period}
                  disabled={loading}
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
              </FormControl>
            </Box>
            <FormControl>
              <FormLabel htmlFor="amount">Income amount</FormLabel>
              <TextField
                autoComplete="amount"
                name="income_amount"
                id="income_amount"
                placeholder='3000'
                type="number"
                value={formData.income_amount}
                onChange={handleChange}
                error={!!errors.income_amount}
                helperText={errors.income_amount}
                disabled={loading}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
