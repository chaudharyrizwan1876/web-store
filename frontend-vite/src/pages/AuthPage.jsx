import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const isLogin = mode === "login";

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed, login: saveAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // ✅ URL param se mode set
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = (params.get("mode") || "").toLowerCase();
    if (m === "signup") setMode("signup");
    else if (m === "login") setMode("login");
    // agar kuch na ho => default "login" (same as before)
  }, [location.search]);

  const brand = "Web Store";

  const theme = useMemo(() => {
    if (isLogin) {
      return {
        accent: "#3E63FF",
        accent2: "#2B45B7",
        glow: "rgba(62, 99, 255, 0.35)",
      };
    }
    return {
      accent: "#19C37D",
      accent2: "#0B8E58",
      glow: "rgba(25, 195, 125, 0.30)",
    };
  }, [isLogin]);

  const onShopNow = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    setMsg("");
    if (!loginForm.email || !loginForm.password) {
      setMsg("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Login failed");
        return;
      }
      saveAuth({ token: data.token, user: data.user });
      navigate("/");
    } catch (e) {
      setMsg("Network error. Backend running hai?");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setMsg("");
    const f = signupForm;

    if (!f.firstName || !f.lastName || !f.email || !f.password || !f.phone || !f.address) {
      setMsg("All signup fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Signup failed");
        return;
      }

      setMsg("Signup successful ✅ Now please login.");

      setTimeout(() => {
        setMode("login");
        setLoginForm({ email: signupForm.email, password: "" });
      }, 900);
    } catch (e) {
      setMsg("Network error. Backend running hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.patternLayer} />

      <div
        style={{
          ...styles.waveLayer,
          background: `radial-gradient(900px 450px at 15% 85%, ${theme.accent} 0%, ${theme.accent2} 40%, rgba(0,0,0,0) 70%)`,
          opacity: 0.95,
          transform: isLogin ? "translateX(0px)" : "translateX(60px)",
        }}
      />

      <div style={styles.topRight}>
        <div style={styles.toggleWrap}>
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              ...styles.toggleBtn,
              ...(isLogin ? styles.toggleActive : styles.toggleInactive),
              background: isLogin ? theme.accent : "transparent",
              boxShadow: isLogin ? `0 10px 30px ${theme.glow}` : "none",
            }}
          >
            login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              ...styles.toggleBtn,
              ...(!isLogin ? styles.toggleActive : styles.toggleInactive),
              background: !isLogin ? theme.accent : "transparent",
              boxShadow: !isLogin ? `0 10px 30px ${theme.glow}` : "none",
            }}
          >
            signup
          </button>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoCircle}>
            <div style={{ ...styles.logoDot, background: theme.accent }} />
            <div style={{ ...styles.logoDot2, background: theme.accent2 }} />
          </div>

          <h2 style={styles.welcome}>Welcome Back</h2>

          {msg ? <div style={styles.messageBox}>{msg}</div> : null}

          <div style={{ marginTop: 14 }}>
            {isLogin ? (
              <>
                <input
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  style={styles.input}
                  placeholder="you@yourmail.com"
                  type="email"
                />
                <input
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  style={{ ...styles.input, marginTop: 12 }}
                  placeholder="password"
                  type="password"
                />

                <div style={styles.rowBetween}>
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                      ...styles.primaryBtn,
                      background: theme.accent,
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Loading..." : "Login"} <span style={{ marginLeft: 8 }}>›</span>
                  </button>

                  <button type="button" style={styles.linkBtn}>
                    forgot password
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.twoCol}>
                  <input
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm((p) => ({ ...p, firstName: e.target.value }))}
                    style={styles.input}
                    placeholder="First name"
                    type="text"
                  />
                  <input
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm((p) => ({ ...p, lastName: e.target.value }))}
                    style={styles.input}
                    placeholder="Last name"
                    type="text"
                  />
                </div>

                <input
                  value={signupForm.email}
                  onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                  style={{ ...styles.input, marginTop: 12 }}
                  placeholder="Email address"
                  type="email"
                />

                <input
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                  style={{ ...styles.input, marginTop: 12 }}
                  placeholder="Password"
                  type="password"
                />

                <input
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm((p) => ({ ...p, phone: e.target.value }))}
                  style={{ ...styles.input, marginTop: 12 }}
                  placeholder="Phone number"
                  type="text"
                />

                <input
                  value={signupForm.address}
                  onChange={(e) => setSignupForm((p) => ({ ...p, address: e.target.value }))}
                  style={{ ...styles.input, marginTop: 12 }}
                  placeholder="Address"
                  type="text"
                />

                <div style={styles.rowBetween}>
                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={loading}
                    style={{
                      ...styles.primaryBtn,
                      background: theme.accent,
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Loading..." : "Sign Up"} <span style={{ marginLeft: 8 }}>›</span>
                  </button>

                  <button type="button" style={styles.linkBtn} onClick={() => setMode("login")}>
                    already have account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.smallTitle}>{brand}</div>

            <div style={styles.bigTitle}>
              {isLogin ? "Login" : "Sign Up"} <span style={{ opacity: 0.9 }}>Page</span>
            </div>

            <button
              type="button"
              onClick={onShopNow}
              style={{
                ...styles.shopNow,
                borderColor: "rgba(255,255,255,0.18)",
                background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))`,
              }}
            >
              Shop Now
            </button>

            <div style={styles.hint}>{isAuthed ? "You are logged in ✅" : "Login/Signup to continue"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050507",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "28px",
    fontFamily: "Inter, system-ui, Arial",
  },
  patternLayer: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 35%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05), transparent 30%)",
    opacity: 0.9,
  },
  waveLayer: {
    position: "absolute",
    inset: 0,
    transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
    clipPath:
      "polygon(0 70%, 10% 66%, 22% 62%, 34% 64%, 46% 70%, 58% 76%, 70% 80%, 82% 78%, 92% 72%, 100% 68%, 100% 100%, 0 100%)",
    zIndex: 1,
  },
  topRight: { position: "absolute", top: 22, right: 24, zIndex: 3 },
  toggleWrap: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 999,
    padding: 6,
    display: "flex",
    gap: 6,
    backdropFilter: "blur(10px)",
  },
  toggleBtn: {
    border: "none",
    cursor: "pointer",
    borderRadius: 999,
    padding: "12px 22px",
    fontWeight: 800,
    letterSpacing: "0.4px",
    transition: "all 350ms cubic-bezier(0.22, 1, 0.36, 1)",
    textTransform: "lowercase",
  },
  toggleActive: { color: "#fff" },
  toggleInactive: { color: "rgba(255,255,255,0.85)", background: "transparent" },
  container: {
    width: "100%",
    maxWidth: 1240,
    display: "grid",
    gridTemplateColumns: "540px 1fr",
    gap: 100,
    position: "relative",
    zIndex: 2,
    alignItems: "center",
  },
  card: {
    background: "rgba(30,30,34,0.86)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: "34px 30px",
    boxShadow: "0 20px 70px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  },
  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 18,
  },
  logoDot: { width: 20, height: 20, borderRadius: 999, position: "absolute", left: 16, top: 18 },
  logoDot2: { width: 14, height: 14, borderRadius: 999, position: "absolute", right: 14, bottom: 16 },
  welcome: { margin: 0, color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: "0.2px" },
  messageBox: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    lineHeight: 1.4,
  },
  input: {
    width: "95%",
    padding: "14px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    outline: "none",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
    fontSize: 14,
  },
  twoCol: { display: "grid", gridTemplateColumns: "217px 217px", gap: 30 },
  rowBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 18,
  },
  primaryBtn: {
    border: "none",
    borderRadius: 999,
    padding: "12px 18px",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 140,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 13,
    padding: 0,
    whiteSpace: "nowrap",
  },
  hero: { color: "#fff", padding: "16px 8px" },
  heroInner: { maxWidth: 680 },
  smallTitle: { fontSize: 26, fontWeight: 800, opacity: 0.95, marginBottom: 6 },
  bigTitle: { fontSize: 86, fontWeight: 1000, lineHeight: 0.95, letterSpacing: "-1px" },
  shopNow: {
    marginTop: 24,
    padding: "14px 22px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    width: 220,
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  hint: { marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.70)" },
};

export default AuthPage;
