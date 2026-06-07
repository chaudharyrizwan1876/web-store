// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

// ✅ Token memory mein rakho — XSS se protect
// (localStorage ki jagah sessionStorage + memory use ho raha hai)
let _memoryToken = null;

export const tokenStore = {
  set(token) {
    _memoryToken = token;
    try { sessionStorage.setItem("token", token); } catch (_) {}
  },
  get() {
    if (_memoryToken) return _memoryToken;
    try {
      const t = sessionStorage.getItem("token");
      if (t) { _memoryToken = t; return t; }
    } catch (_) {}
    // Purana localStorage migrate karo (ek baar)
    try {
      const t = localStorage.getItem("token");
      if (t) {
        _memoryToken = t;
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

const USER_KEY = "user";

export const AuthProvider = ({ children }) => {
  // Token memory se lo (page reload pe sessionStorage fallback)
  const [token, setToken] = useState(() => tokenStore.get() || "");

  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  });

  const isAuthed = !!token;
  const isAdmin = !!user?.isAdmin;

  // Token sync — memory + sessionStorage
  useEffect(() => {
    if (token) tokenStore.set(token);
    else tokenStore.clear();
  }, [token]);

  // User sync — sessionStorage mein rakho
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.removeItem(USER_KEY); // purana saaf karo
      } else {
        sessionStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch (_) {}
  }, [user]);

  // Login — do tarike kaam karta hai:
  // login({ token, user })  ya  login(user, token)
  const login = (arg1, arg2) => {
    if (arg1 && typeof arg1 === "object" && arg1.token) {
      setToken(arg1.token);
      setUser(arg1.user || null);
      return;
    }
    if (arg2) {
      setUser(arg1 || null);
      setToken(arg2);
      return;
    }
    console.warn("login() called without valid args");
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const requireAdmin = () => isAuthed && isAdmin;

  // Tabs sync (doosre tab mein logout ho to is tab mein bhi ho)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        const t = sessionStorage.getItem("token") || "";
        setToken(t);
        _memoryToken = t || null;
      }
      if (e.key === USER_KEY) {
        try {
          const raw = sessionStorage.getItem(USER_KEY);
          setUser(raw ? JSON.parse(raw) : null);
        } catch (_) { setUser(null); }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthed, isAdmin, login, logout, requireAdmin }),
    [token, user, isAuthed, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};