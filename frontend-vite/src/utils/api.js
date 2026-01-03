const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  // ✅ If body is plain object => JSON.stringify + content-type
  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  // ✅ Auto attach token if exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  // ✅ response read safely
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  // ✅ normalize errors (and keep data for UI)
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      "Something went wrong";

    const err = new Error(msg);
    err.status = res.status;
    err.data = data; // ✅ IMPORTANT: backend response attach
    throw err;
  }

  return data;
};
