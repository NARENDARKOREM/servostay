import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  // baseURL: 'https://property-rental-backend-ten.vercel.app',
  // baseURL: 'https://property-rental-backend-5.onrender.com', 
  withCredentials: true, 
});

export default api;