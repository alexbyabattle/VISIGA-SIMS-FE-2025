import React, { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useAuthenticationService from '../api/services/authenticationService';
import toast from 'react-hot-toast';
import { getUserFromCookies, removeUserCookies } from '../utils/Cookie-utils';


// Create AuthContext
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  requestPasswordReset: () => Promise.resolve(),
  verifyResetCode: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { signIn: signInService, signUp: signUpService, logout: signOutService, requestPasswordResetService, verifyResetCodeService, resetPasswordService } = useAuthenticationService();

  const signIn = useCallback(async (email, password) => {
    try {
      const response = await signInService(email, password);
      if (response.code === '0') {
        const storedUser = getUserFromCookies();
        setIsAuthenticated(true);
        setUser(storedUser);
        toast.success(response.message);
        navigate('/dashboard');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [navigate, signInService]);

  const signUp = useCallback(async (userData) => {
    try {
      const response = await signUpService(userData);
      if (response.code === '0') {
        
        navigate('/login');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('AuthProvider SignUp Error:', error.message);
      toast.error(error.message );
    }
  }, [navigate, signUpService]);



  const signOut = useCallback(async () => {
    try {
      await signOutService();
      setIsAuthenticated(false);
      setUser(null);
      removeUserCookies();
      navigate('/');
    } catch (error) {
      throw new Error(error.message);
    }
  }, [navigate, signOutService]);
  


  const requestPasswordReset = useCallback(async (email) => {
    try {
      await requestPasswordResetService(email);
      toast.success("Code is sent to your email account");
    } catch (error) {
      toast.error("Error in sending code to your email account");
      console.error(error.message);
    }
  }, [requestPasswordResetService]);

  const verifyResetCode = useCallback(async (email, code) => {
    try {
      await verifyResetCodeService(email, code);
      toast.success("Code is successfully verified");
    } catch (error) {
      toast.error("Error in verifying code");
      console.error(error.message);
    }
  }, [verifyResetCodeService]);

  const resetPassword = useCallback(async (email, newPassword, confirmPassword) => {
    try {
      await resetPasswordService(email, newPassword, confirmPassword); 
      toast.success("New password is saved successfully");
      navigate('/');
    } catch (error) {
      toast.error("Error in saving new password");
      console.error(error.message);
    }
  }, [resetPasswordService, navigate]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, signOut, requestPasswordReset, verifyResetCode, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
