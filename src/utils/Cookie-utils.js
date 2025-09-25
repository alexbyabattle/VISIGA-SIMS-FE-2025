import Cookies from 'js-cookie';

export const setUserCookies = (userData) => {
  Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Expires in 7 days
};

export const getUserFromCookies = () => {
  const user = Cookies.get('user');
  return user ? JSON.parse(user) : null;
};

export const removeUserCookies = () => {
  Cookies.remove('user');
};
