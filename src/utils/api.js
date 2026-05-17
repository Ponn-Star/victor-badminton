// Central API base URL — set VITE_API_URL on Vercel to point to the Railway backend.
// In local dev the Vite proxy handles /api/* so the empty string is correct.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
