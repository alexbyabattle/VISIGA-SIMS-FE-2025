import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, useTheme, IconButton, CircularProgress, Link, Grid } from '@mui/material';
import { Formik, useFormik } from 'formik';
import { tokens, ColorModeContext } from '../../theme';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Brightness4, Brightness7 } from '@mui/icons-material';
import { resetPasswordSchema, ForgotPasswordSchema, CodeSchema, RegistrationSchema } from '../../schemas/authentication-schema';
import AuthContainerForm from '../../components/AuthContainerForm';
import { useAuth } from '../../hooks/useAuth';

const ResetPassword = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

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

            <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                {step === 1 && <RequestResetPassword setStep={setStep} setEmail={setEmail} />}
                {step === 2 && <VerifyResetCode setStep={setStep} email={email} />}
                {step === 3 && <SetNewPassword setStep={setStep} email={email} />}
            </Box>
        </Box>
    );
};

// ✅ Step 1: Request Password Reset
const RequestResetPassword = ({ setStep, setEmail }) => {
    const { requestPasswordReset } = useAuth();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: ForgotPasswordSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await requestPasswordReset(values.email);
                setEmail(values.email);
                setStep(2);
            } catch (error) {
                console.error("Error sending reset email:", error);
            } finally {
                setLoading(false);
            }
        }

    });

    return (
        <AuthContainerForm>
            <Box
                p={2}
                borderRadius={5}
                mt={1}
                mx="auto"
                maxWidth={500}
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"

            >
                <Typography variant="h5" mb={2}> Enter Email To Reset Password </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        {...formik.getFieldProps("email")}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        variant="outlined"
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} color="secondary" />}
                    >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </Button>

                </form>

                <Box mt={2} display="flex" justifyContent="center">
                    <Typography variant="body1">
                        I remember my password?{' '}
                        <Link to="/" component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
                            back to login page
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </AuthContainerForm>
    );
};

// ✅ Step 2: Verify Reset Code
const VerifyResetCode = ({ setStep, email }) => {
    const { verifyResetCode } = useAuth();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: { code: "" },
        validationSchema: CodeSchema,
       onSubmit: async (values) => {
            setLoading(true);
            try {
                await verifyResetCode(email, values.code);
                setStep(3);
            } catch (error) {
                console.error("Invalid reset code:", error);
            }finally {
                setLoading(false);
            }
        },
    });

    return (
        <AuthContainerForm>
            <Box
                p={2}
                borderRadius={5}
                mt={1}
                mx="auto"
                maxWidth={500}
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h5" mb={2}>Enter Reset Code</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Reset Code"
                        {...formik.getFieldProps("code")}
                        error={formik.touched.code && Boolean(formik.errors.code)}
                        helperText={formik.touched.code && formik.errors.code}
                        variant="outlined"
                        margin="normal"
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} color="secondary" />}
                    >
                        {loading ? 'Veryfying...' : 'Verify Code'}
                    </Button>
                </form>
            </Box>
        </AuthContainerForm>
    );
};


const SetNewPassword = ({ setStep, email }) => {
    const { resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: RegistrationSchema.pick(["password", "confirmPassword"]),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await resetPassword(email, values.password, values.confirmPassword);
                setStep(4);
            } catch (error) {
                console.error("Error resetting password:", error);
            }finally {
                setLoading(false);
            }
        },
    });

    return (
        <AuthContainerForm>
            <Box
                p={2}
                borderRadius={5}
                mt={1}
                mx="auto"
                maxWidth={500}
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h5" mb={1}>Set New Password</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="New Password"
                        type="password"
                        {...formik.getFieldProps("password")}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        {...formik.getFieldProps("confirmPassword")}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        variant="outlined"
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} color="secondary" />}
                    >
                        {loading ? 'Saving...' : 'Save new Password'}
                    </Button>
                </form>
            </Box>
        </AuthContainerForm>
    );
};


export default ResetPassword;
