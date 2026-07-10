import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/admin/products", label: "Products", icon: "📦" },
  { path: "/admin/orders", label: "Orders", icon: "🧾" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div style={s.wrapper}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.brand} onClick={() => navigate("/")} role="button" tabIndex={0}>
          <span style={{ fontSize: "20px" }}>🛍️</span>
          <span style={s.brandText}>Admin Panel</span>
        </div>

        <nav style={s.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...s.navLink,
                ...(isActive ? s.navLinkActive : {}),
              })}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={s.sidebarFooter}>
          <div style={s.userRow}>
            <div style={s.avatar}>{initials}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={s.userName}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={s.userEmail}>{user?.email}</div>
            </div>
          </div>

          <button type="button" onClick={() => navigate("/")} style={s.backBtn}>
            ← Back to Store
          </button>
          <button type="button" onClick={handleLogout} style={s.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={s.main}>
        <Outlet />
      </main>
    </div>
  );
};

const s = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#F3F4F6" },
  sidebar: {
    width: "240px",
    flexShrink: 0,
    background: "#111827",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 16px",
    position: "sticky",
    top: 0,
    height: "100vh",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "20px",
  },
  brandText: { fontWeight: 800, fontSize: "15px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 12px",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.15s ease",
  },
  navLinkActive: {
    background: "#2563EB",
    color: "#fff",
  },
  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  userRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563EB, #4a7bff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "13px",
    flexShrink: 0,
  },
  userName: { fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userEmail: { fontSize: "11px", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  backBtn: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
  },
  logoutBtn: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#DC2626",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  main: { flex: 1, overflowX: "auto" },
};

export default AdminLayout;
