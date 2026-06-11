const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Token lene ka function — sessionStorage + localStorage fallback
const getToken = () => {
  // 1. sessionStorage se lo (naya system)
  try {
    const t = sessionStorage.getItem("token");
    if (t) return t;
  } catch (_) {}

  // 2. localStorage fallback (purana system — migrate karo)
  try {
    const t = localStorage.getItem("token");
    if (t) {
      // localStorage se sessionStorage mein migrate karo
      sessionStorage.setItem("token", t);
      localStorage.removeItem("token");
      return t;
    }
  } catch (_) {}

  return null;
};

export const apiFetch = async (path, options = {}) => {
  const token = getToken();

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
