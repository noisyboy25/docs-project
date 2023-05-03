const VITE_API_HOST: string = import.meta.env.VITE_API_HOST || '';

export const API_URL: string =
  VITE_API_HOST && `https://${VITE_API_HOST}.onrender.com`;
