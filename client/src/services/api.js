import axios from "axios";

// Your deployed backend (no trailing /api needed)
const PRODUCTION_API = "https://minte1-e7uf.vercel.app";

// Use VITE_API_URL if set; otherwise localhost while developing, Vercel in production
const root = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : PRODUCTION_API)
)
  .replace(/\/+$/, "") // remove trailing slashes
  .replace(/\/api$/, ""); // never double the /api

const api = axios.create({
  baseURL: `${root}/api`,
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
