import * as Yup from 'yup';

// Validation schema for user authentication
export const AuthenticationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Please provide your email address"),
    password: Yup.string().required("Please provide your password"),
});

export const RegistrationSchema = Yup.object({
    name: Yup.string().required('Your name is required'),
    email: Yup.string().email('Invalid email address').required('Please provide your email address'),
    password: Yup.string().required('Please provide your password'),
    confirmPassword: Yup.string()
      .required('Please confirm your password') 
      .oneOf([Yup.ref('password'), null], 'Passwords must match'), 
  });

export const ForgotPasswordSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required")
});

export const TokenSchema = Yup.object({
    token: Yup.string().required("Token is required").default(""),
    refreshToken: Yup.string().required("Refresh token is required").default("")
});

export const CodeSchema = Yup.object({
    code: Yup.string().required("code is required").default(""),
    
});
