import axios from 'axios';

const api = axios.create({
  baseURL: 'https://auctionx-guan.onrender.com/api', // backend URL
});
// token ko header m attach krne k liye 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;