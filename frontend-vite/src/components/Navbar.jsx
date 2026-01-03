// ====================== frontend-vite/src/components/Navbar.jsx (UPDATED: WORKING SEARCH) ======================
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed, isAdmin, user, logout } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  // ✅ read current query params (keep category when searching)
  const queryState = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return {
      category: (sp.get("category") || "").trim(),
      search: (sp.get("search") || "").trim(),
    };
  }, [location.search]);

  // ✅ controlled search
  const [searchText, setSearchText] = useState(queryState.search);

  useEffect(() => {
    // sync input when url changes (back/forward navigation)
    setSearchText(queryState.search);
  }, [queryState.search]);

  const safeUser = useMemo(() => {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }, [user]);

  const go = (path) => {
    setOpenProfile(false);
    setOpenAdmin(false);
    navigate(path);
  };

  const goAuthed = (path) => {
    if (!isAuthed) return navigate("/auth");
    go(path);
  };

  const onProfileClick = () => {
    if (!isAuthed) return navigate("/auth");
    setOpenProfile((v) => !v);
    setOpenAdmin(false);
  };

  const onAdminClick = () => {
    setOpenAdmin((v) => !v);
    setOpenProfile(false);
  };

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    setOpenAdmin(false);
    navigate("/auth");
  };

  // ✅ submit search => /products?category=...&search=...
  const onSubmitSearch = (e) => {
    e.preventDefault();

    const term = (searchText || "").trim();
    const sp = new URLSearchParams();

    // keep current category filter if already set in url
    if (queryState.category) sp.set("category", queryState.category);

    if (term) sp.set("search", term);

    const url = sp.toString() ? `/products?${sp.toString()}` : "/products";
    go(url);
  };

  const clearSearch = () => {
    setSearchText("");
    const sp = new URLSearchParams();
    if (queryState.category) sp.set("category", queryState.category);
    const url = sp.toString() ? `/products?${sp.toString()}` : "/products";
    go(url);
  };

  return (
    <div style={styles.outer}>
      <div style={styles.wrapper}>
        {/* LEFT GROUP */}
        <div style={styles.leftGroup}>
          {/* BRAND */}
          <div
            style={styles.brand}
            onClick={() => go("/")}
            role="button"
            tabIndex={0}
          >
            <div style={styles.logoBox}>
              <span style={styles.logoIcon}>🛍️</span>
            </div>
            <h2 style={styles.brandText}>Brand</h2>
          </div>

          {/* ✅ SEARCH (WORKING) */}
          <form style={styles.searchSection} onSubmit={onSubmitSearch}>
            <input
              type="text"
              placeholder="Search"
              style={styles.searchInput}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <select style={styles.categorySelect} disabled>
              <option>All category</option>
            </select>

            {searchText.trim() ? (
              <button
                type="button"
                onClick={clearSearch}
                style={styles.clearBtn}
              >
                Clear
              </button>
            ) : null}

            <button type="submit" style={styles.searchBtn}>
              Search
            </button>
          </form>
        </div>

        {/* RIGHT GROUP */}
        <div style={styles.rightMenu}>
          {/* ADMIN */}
          {isAuthed && isAdmin && (
            <div style={{ ...styles.menuItem, position: "relative" }}>
              <div
                onClick={onAdminClick}
                style={styles.clickableMenu}
                role="button"
                tabIndex={0}
              >
                <span style={styles.icon}>🛠️</span>
                <p style={styles.menuText}>Admin</p>
              </div>

              {openAdmin && (
                <div style={styles.adminDropdown}>
                  <p style={styles.dropdownTitle}>Admin Panel</p>

                  <button
                    type="button"
                    onClick={() => go("/admin/dashboard")}
                    style={styles.dropdownBtn}
                  >
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => go("/admin/orders")}
                    style={styles.dropdownBtn}
                  >
                    Manage Orders
                  </button>

                  <button
                    type="button"
                    onClick={() => go("/admin/products")}
                    style={styles.dropdownBtn}
                  >
                    Manage Products
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          <div style={{ ...styles.menuItem, position: "relative" }}>
            <div
              onClick={onProfileClick}
              style={styles.clickableMenu}
              role="button"
              tabIndex={0}
            >
              <span style={styles.icon}>👤</span>
              <p style={styles.menuText}>Profile</p>
            </div>

            {openProfile && isAuthed && (
              <div style={styles.profileDropdown}>
                <p style={styles.dropdownTitle}>My Profile</p>

                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>Name</span>
                  <span style={styles.profileValue}>
                    {(safeUser?.firstName || "") +
                      " " +
                      (safeUser?.lastName || "")}
                  </span>
                </div>

                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>Email</span>
                  <span style={styles.profileValue}>
                    {safeUser?.email || "-"}
                  </span>
                </div>

                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>Phone</span>
                  <span style={styles.profileValue}>
                    {safeUser?.phone || "-"}
                  </span>
                </div>

                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>Address</span>
                  <span style={styles.profileValue}>
                    {safeUser?.address || "-"}
                  </span>
                </div>

                <div style={styles.divider} />

                <button
                  type="button"
                  onClick={handleLogout}
                  style={styles.logoutBtn}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MESSAGE */}
          <div style={styles.menuItem}>
            <div style={styles.clickableMenu}>
              <span style={styles.icon}>💬</span>
              <p style={styles.menuText}>Message</p>
            </div>
          </div>

          {/* ORDERS */}
          <div style={styles.menuItem}>
            <div
              onClick={() => goAuthed("/my-orders")}
              style={styles.clickableMenu}
            >
              <span style={styles.icon}>❤️</span>
              <p style={styles.menuText}>Orders</p>
            </div>
          </div>

          {/* CART */}
          <div style={styles.menuItem}>
            <div onClick={() => go("/checkout")} style={styles.clickableMenu}>
              <span style={styles.icon}>🛒</span>
              <p style={styles.menuText}>My cart</p>
            </div>
          </div>
        </div>
      </div>

      {(openProfile || openAdmin) && (
        <div
          onClick={() => {
            setOpenProfile(false);
            setOpenAdmin(false);
          }}
          style={styles.backdrop}
        />
      )}
    </div>
  );
};

/* ================== STYLES ================== */

const styles = {
  outer: {
    width: "100%",
    borderBottom: "1px solid #e5e5e5",
    background: "#fff",
    position: "relative",
    zIndex: 20,
  },

  wrapper: {
    maxWidth: "1440px",
    height: "86px",
    margin: "0 auto",
    padding: "0 80px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },

  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "46px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    userSelect: "none",
  },

  logoBox: {
    backgroundColor: "#e8f0ff",
    padding: "8px",
    borderRadius: "8px",
  },

  logoIcon: {
    fontSize: "20px",
  },

  brandText: {
    color: "#4a7bff",
    margin: 0,
    fontWeight: "600",
  },

  searchSection: {
    width: "665px",
    height: "40px",
    display: "flex",
    border: "2px solid #4a7bff",
    borderRadius: "6px",
    overflow: "hidden",
  },

  searchInput: {
    flex: 1,
    padding: "0 10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  categorySelect: {
    padding: "0 10px",
    border: "none",
    borderLeft: "1px solid #e5e5e5",
    outline: "none",
    cursor: "not-allowed",
    background: "#fff",
    opacity: 0.85,
  },

  clearBtn: {
    border: "none",
    borderLeft: "1px solid #e5e5e5",
    background: "#fff",
    padding: "0 12px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#111",
  },

  searchBtn: {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    border: "none",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: "600",
  },

  rightMenu: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  menuItem: {
    textAlign: "center",
  },

  clickableMenu: {
    cursor: "pointer",
    userSelect: "none",
  },

  icon: {
    fontSize: "18px",
    color: "#777",
    display: "block",
  },

  menuText: {
    fontSize: "10px",
    color: "#777",
    margin: 0,
    marginTop: "2px",
  },

  adminDropdown: {
    position: "absolute",
    top: "52px",
    right: "-18px",
    width: "220px",
    background: "#fff",
    border: "1px solid #eaeaea",
    borderRadius: "12px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    padding: "12px",
    zIndex: 60,
  },

  profileDropdown: {
    position: "absolute",
    top: "52px",
    right: "-24px",
    width: "260px",
    background: "#fff",
    border: "1px solid #eaeaea",
    borderRadius: "12px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    padding: "12px",
    zIndex: 60,
  },

  dropdownTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  dropdownBtn: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "800",
    textAlign: "left",
    marginTop: "8px",
  },

  profileRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    padding: "6px 0",
  },

  profileLabel: {
    fontSize: "12px",
    color: "#666",
    minWidth: "70px",
  },

  profileValue: {
    fontSize: "12px",
    color: "#222",
    fontWeight: "600",
    textAlign: "right",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },

  divider: {
    height: "1px",
    background: "#eee",
    margin: "10px 0",
  },

  logoutBtn: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "transparent",
    zIndex: 10,
  },
};

export default Navbar;
