import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthed = !!token;
  const isAdmin = !!user?.isAdmin; // ✅ admin flag derived from stored user

  // ✅ central persist (professional: state is source of truth)
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  // ✅ flexible login:
  // login({ token, user }) OR login(user, token)
  const login = (arg1, arg2) => {
    // Case 1: login({ token, user })
    if (arg1 && typeof arg1 === "object" && arg1.token) {
      setToken(arg1.token);
      setUser(arg1.user || null);
      return;
    }

    // Case 2: login(user, token)
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

  // ✅ Optional helper (useful in admin pages/components)
  const requireAdmin = () => isAuthed && isAdmin;

  // ✅ Sync across tabs (storage event fires on other tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY) setToken(localStorage.getItem(TOKEN_KEY) || "");
      if (e.key === USER_KEY) {
        const raw = localStorage.getItem(USER_KEY);
        setUser(raw ? JSON.parse(raw) : null);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      isAdmin,      // ✅ exposed
      login,
      logout,
      requireAdmin, // ✅ exposed
    }),
    [token, user, isAuthed, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
