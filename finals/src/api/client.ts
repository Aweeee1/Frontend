import axios from "axios";

export const TOKEN_KEY = "damayan_token";
export const UNAUTHORIZED_EVENT = "damayan:unauthorized";

// When no API URL is configured the app runs in demo mode with seeded data
export const hasBackend = Boolean(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// MongoDB-backed APIs return `_id`, but the UI keys everything off `id`.
// Donations are addressed by their reference `code`, so prefer that for them.
function normalizeIds(value: unknown, preferCode: boolean): unknown {
  if (Array.isArray(value)) return value.map((item) => normalizeIds(item, preferCode));
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(record)) result[key] = normalizeIds(val, preferCode);
    if (result.id === undefined) {
      const fallback = preferCode && typeof record.code === "string" ? record.code : record._id;
      if (fallback !== undefined) result.id = fallback;
    }
    return result;
  }
  return value;
}

api.interceptors.response.use(
  (response) => {
    const url = String(response.config.url ?? "");
    if (response.data && typeof response.data === "object" && !url.startsWith("/auth/")) {
      response.data = normalizeIds(response.data, url.startsWith("/donations"));
    }
    return response;
  },
  (error) => {
    // An expired or revoked token on a protected call: clear it and tell the auth context
    const isAuthCall = String(error.config?.url ?? "").startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(new Error(error.response?.data?.message ?? "Unable to complete the request"));
  },
);
