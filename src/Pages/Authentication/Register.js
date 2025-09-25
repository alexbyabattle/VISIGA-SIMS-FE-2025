import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import {
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    Link,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { RegistrationSchema } from '../../schemas/authentication-schema';


const initialValues = {
    name: '',
    email: '',
    role: "ADMIN",
    password: '',
    confirmPassword: '',
};

const Register = () => {
    const { signUp } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleFormSubmit = async (values) => {
        try {
            await signUp(values);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: RegistrationSchema,
        onSubmit: handleFormSubmit,
    });

    return (
        <AuthFormContainer title="Register">
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Name"
                            {...formik.getFieldProps('name')}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Email"
                            type="email"
                            {...formik.getFieldProps('email')}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            {...formik.getFieldProps('password')}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...formik.getFieldProps('confirmPassword')}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                        style={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Register
                    </Button>
                </Box>
            </form>

            <Box mt={2} display="flex" justifyContent="center">
                <Typography variant="body1">
                    Already have an account?{' '}
                    <Link to="/login" component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
                        Click here to login
                    </Link>
                </Typography>
            </Box>
        </AuthFormContainer>
    );
};

export default Register;
