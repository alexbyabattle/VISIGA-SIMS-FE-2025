import React from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { AuthenticationSchema } from '../../schemas/authentication-schema';


const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const { signIn } = useAuth();

  const handleFormSubmit = async (values) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      // Handle error if needed
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: AuthenticationSchema,
    onSubmit: handleFormSubmit,
  });

  return <LoginForm formik={formik} />;
};

export default Login;
