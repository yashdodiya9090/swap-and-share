import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://swap-and-share.onrender.com';
const UPLOADS_URL = `${API_URL}/uploads/`;

const api = axios.create({
  baseURL: API_URL,
});

export { API_URL, UPLOADS_URL, api };
export default api;
