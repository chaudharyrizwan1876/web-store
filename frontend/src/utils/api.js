// frontend/src/utils/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Token memory mein rakho (XSS se protect)
// localStorage se bhi read karta hai backward compatibility ke liye
let _memoryToken = null;

export const tokenStore = {
  set(token) {
    _memoryToken = token;
    // Optional: session ke liye sessionStorage use karo (tab close pe clear)
    // localStorage se behtar hai lekin httpOnly cookie se km secure
    try {
      sessionStorage.setItem("token", token);
    } catch (_) {}
  },

  get() {
    if (_memoryToken) return _memoryToken;
    // Fallback: agar page reload hua to sessionStorage se lo
    try {
      const t = sessionStorage.getItem("token");
      if (t) {
        _memoryToken = t;
        return t;
      }
    } catch (_) {}
    // Last fallback: purana localStorage (migrate karo)
    try {
      const t = localStorage.getItem("token");
      if (t) {
        _memoryToken = t;
        // localStorage se hata do, sessionStorage pe migrate karo
        sessionStorage.setItem("token", t);
        localStorage.removeItem("token");
        return t;
      }
    } catch (_) {}
    return null;
  },

  clear() {
    _memoryToken = null;
    try { sessionStorage.removeItem("token"); } catch (_) {}
    try { localStorage.removeItem("token"); } catch (_) {}
  },
};

export const apiFetch = async (path, options = {}) => {
  const token = tokenStore.get();

  const headers = { ...(options.headers || {}) };

  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      "Something went wrong";

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};