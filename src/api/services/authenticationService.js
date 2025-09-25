import axiosInstance from '../axiosInstance';
import { endpoints } from '../endPoints';
import { Response, ErrorResponse, RequestConfig } from '../api-Utils';
import { setUserCookies, removeUserCookies } from '../../utils/Cookie-utils';
import useToggle from '../../hooks/use-toggle';

const useAuthenticationService = () => {
  const [isLoading, toggleLoading] = useToggle();

  const signIn = async (email, password) => {
    try {
      toggleLoading();
      const requestConfig = RequestConfig(
        endpoints.authentication.signIn,
        {},
        { email, password },
        'POST'
      );
      
      const response = await axiosInstance(requestConfig);
      
      if (response.status === 200) {
        const { token, refreshToken } = response.data.data;
        localStorage.clear();
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        await fetchUserDetails(token);
        return Response('0', response.data.message, {});
      }
    } catch (error) {
      return ErrorResponse(error.response?.data?.message, error.response?.status);
    } finally {
      toggleLoading();
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      toggleLoading();
      const requestConfig = RequestConfig(
        endpoints.authentication.getUser,
        {},
        { token },
        'POST'
      );

      const response = await axiosInstance(requestConfig);

      if (response?.status === 200 && response.data) {
        setUserCookies(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error?.response?.data?.message || error.message);
    } finally {
      toggleLoading();
    }
  };

  const signUp = async (userData) => {
    try {
      toggleLoading();
      const requestConfig = RequestConfig(
        endpoints.users.signUp,
        {},
        userData,
        'POST'
      );

      const response = await axiosInstance(requestConfig);

      if (response.status === 200) {
        return Response('0', 'User registered successfully', response.data);
      } else {
        return ErrorResponse(response.data?.message, response.status);
      }
    } catch (error) {
      return ErrorResponse(error.response?.data?.message || error.message, error.response?.status);
    } finally {
      toggleLoading();
    }
  };

  const logout = async () => {
    try {
      toggleLoading();
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No access token found');
      }

      const requestConfig = RequestConfig(
        endpoints.authentication.signOut,
        {},
        { token },
        'POST'
      );

      await axiosInstance(requestConfig);
      localStorage.clear();
      removeUserCookies();
      return Response('0', 'User logged out successfully', {});
    } catch (error) {
      return ErrorResponse(error.response?.data?.message, error.response?.status);
    } finally {
      toggleLoading();
    }
  };

  const requestPasswordResetService = async (email) => {
    try {
      toggleLoading();
      const requestConfig = RequestConfig(
        endpoints.users.resetPassword,
        {},
        { email },
        'POST'
      );

      const response = await axiosInstance(requestConfig);
      return Response('0', response.data.message, {});
    } catch (error) {
      return ErrorResponse(error.response?.data?.message, error.response?.status);
    } finally {
      toggleLoading();
    }
  };

  const verifyResetCodeService = async (email, code) => {
    try {
      toggleLoading();
      const requestConfig = RequestConfig(
        endpoints.authentication.verifyResetCode,
        {},
        { email, code },
        'POST'
      );

      const response = await axiosInstance(requestConfig);
      return Response('0', response.data.message, {});
    } catch (error) {
      return ErrorResponse(error.response?.data?.message, error.response?.status);
    } finally {
      toggleLoading();
    }
  };

  const resetPasswordService = async (email, newPassword, confirmPassword) => {
    try {
      toggleLoading();
      const requestConfig = RequestConfig(
        endpoints.users.newPassword,
        {},
        { email, password: newPassword, confirmPassword },
        'POST'
      );

      const response = await axiosInstance(requestConfig);
      return Response('0', response.data.message, {});
    } catch (error) {
      return ErrorResponse(error.response?.data?.message, error.response?.status);
    } finally {
      toggleLoading();
    }
  };

  return {
    signIn,
    signUp,
    logout,
    requestPasswordResetService,
    verifyResetCodeService,
    resetPasswordService,
    isLoading,
  };
};

export default useAuthenticationService;
