import { jwtDecode } from "jwt-decode";

 const isTokenValid = () => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  const decoded = jwtDecode(token);

  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    return false;
  }

  return true;
};
export default isTokenValid;