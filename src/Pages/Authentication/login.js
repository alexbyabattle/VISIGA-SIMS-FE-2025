import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography, useTheme, IconButton, Grid, Link, InputAdornment } from '@mui/material';
import { ColorModeContext } from '../../theme';
import { Link as RouterLink } from 'react-router-dom';
import { Brightness7, Brightness4, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthenticationSchema } from '../../schemas/authentication-schema';
import AuthContainerForm from '../../components/AuthContainerForm';
import { useAuth } from '../../hooks/useAuth';
import useAuthenticationService from '../../api/services/authenticationService';

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const { signIn } = useAuth();
  const { isLoading } = useAuthenticationService();
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {

    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: AuthenticationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" alignItems="center" width="100%">
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? (
            <>
              <Typography variant="body2" mr={1}>DARK</Typography>
              <Brightness7 />
            </>
          ) : (
            <>
              <Typography variant="body2" mr={1}>LIGHT</Typography>
              <Brightness4 />
            </>
          )}
        </IconButton>
      </Box>


      <AuthContainerForm title="Login">
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="filled"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        color="inherit"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              disabled={formik.isSubmitting || isLoading}
              style={{ padding: '10px 20px', fontSize: '16px' }}
            >
              {formik.isSubmitting || isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </Box>
        </form>

        <Box mt={2} display="flex" justifyContent="center">
          <Typography variant="body2">
            Have you forgotten your password?{' '}
            <Link to="/resetPassword" component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
              Forget password
            </Link>
          </Typography>
        </Box>
      </AuthContainerForm>
    </Box>
  );
};

export default Login;
