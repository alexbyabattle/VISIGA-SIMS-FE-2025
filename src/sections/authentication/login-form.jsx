import React from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  Avatar,
  Typography,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


const LoginForm = ({ formik }) => {
  return (
    <Box
      bgcolor="#0D1825"
      p={4}
      borderRadius={5}
      mt={8}
      mx="auto"
      maxWidth={500}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxShadow={3}
    >
      <Typography component="h5" variant="h5" mb={1} color="white">
        GOVERNMENT CHEMISTRY LABORATORY AUTHORITY
      </Typography>

      <Avatar sx={{ m: 2, bgcolor: 'secondary.main', width: 100, height: 100 }}>
        <img alt="gcla admin" width="100%" height="100%" src={image.gcla} style={{ borderRadius: '50%' }} />
      </Avatar>

      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <Box mb={2} display="flex" justifyContent="center">
          <Typography component="h1" variant="h5">Sign In</Typography>
        </Box>
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
              type="password"
              label="Password"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="center">
          <Button type="submit" color="secondary" variant="contained" style={{ padding: '10px 20px', fontSize: '16px' }}>
            Submit
          </Button>
        </Box>
      </form>

      <Box mt={2} display="flex" justifyContent="center">
        <Typography variant="body1">
          Don't have an account?{' '}
          <Link to="/register" component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
            Click here to register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
