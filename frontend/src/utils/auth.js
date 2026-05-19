import { jwtDecode } from "jwt-decode";

export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  sessionStorage.removeItem("token");
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isStaff = () => {
  const user = getUser();
  return user?.is_staff === true;
};