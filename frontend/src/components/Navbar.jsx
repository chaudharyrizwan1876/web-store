import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const [openProfile, setOpenProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const queryState = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return {
      category: (sp.get("category") || "").trim(),
      search: (sp.get("search") || "").trim(),
    };
  }, [location.search]);

  const [searchText, setSearchText] = useState(queryState.search);

  useEffect(() => {
    setSearchText(queryState.search);
  }, [queryState.search]);

  const safeUser = useMemo(() => {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }, [user]);

  const go = (path) => {
    setOpenProfile(false);
    navigate(path);
  };

  const goAuthed = (path) => {
    if (!isAuthed) return navigate("/auth");
    go(path);
  };

  const onProfileClick = () => {
    if (!isAuthed) return navigate("/auth");
    setOpenProfile((v) => !v);
  };

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/auth");
  };

  const openEditModal = () => {
    setOpenProfile(false);
    setShowProfileModal(true);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const term = (searchText || "").trim();
    const sp = new URLSearchParams();
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
    <>
      <div style={styles.outer}>
        <div style={styles.wrapper}>
          {/* LEFT GROUP */}
          <div style={styles.leftGroup}>
            <div style={styles.brand} onClick={() => go("/")} role="button" tabIndex={0}>
              <div style={styles.logoBox}>
                <span style={styles.logoIcon}>🛍️</span>
              </div>
              <h2 style={styles.brandText}>Brand</h2>
            </div>

            <form style={styles.searchSection} onSubmit={onSubmitSearch}>
              <input
                type="text"
                placeholder="Search"
                style={styles.searchInput}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText.trim() ? (
                <button type="button" onClick={clearSearch} style={styles.clearBtn}>Clear</button>
              ) : null}
              <button type="submit" style={styles.searchBtn}>Search</button>
            </form>
          </div>

          {/* RIGHT GROUP */}
          <div style={styles.rightMenu}>
            {/* ✅ ADMIN — single link, straight to dashboard (no dropdown) */}
            {isAuthed && isAdmin && (
              <div style={styles.menuItem}>
                <div onClick={() => go("/admin/dashboard")} style={styles.clickableMenu} role="button" tabIndex={0}>
                  <span style={styles.icon}>🛠️</span>
                  <p style={styles.menuText}>Admin</p>
                </div>
              </div>
            )}

            {/* PROFILE */}
            <div style={{ ...styles.menuItem, position: "relative" }}>
              <div onClick={onProfileClick} style={styles.clickableMenu} role="button" tabIndex={0}>
                {/* Avatar circle with initials when logged in */}
                {isAuthed ? (
                  <div style={styles.avatarSmall}>
                    {`${safeUser?.firstName?.[0] || ""}${safeUser?.lastName?.[0] || ""}`.toUpperCase()}
                  </div>
                ) : (
                  <span style={styles.icon}>👤</span>
                )}
                <p style={styles.menuText}>Profile</p>
              </div>

              {openProfile && isAuthed && (
                <div style={styles.profileDropdown}>
                  {/* Profile header in dropdown */}
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropdownAvatar}>
                      {`${safeUser?.firstName?.[0] || ""}${safeUser?.lastName?.[0] || ""}`.toUpperCase()}
                    </div>
                    <div>
                      <p style={styles.dropdownName}>
                        {(safeUser?.firstName || "") + " " + (safeUser?.lastName || "")}
                      </p>
                      <p style={styles.dropdownEmail}>{safeUser?.email || ""}</p>
                    </div>
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.profileRow}>
                    <span style={styles.profileLabel}>Phone</span>
                    <span style={styles.profileValue}>{safeUser?.phone || "-"}</span>
                  </div>
                  <div style={styles.profileRow}>
                    <span style={styles.profileLabel}>Address</span>
                    <span style={styles.profileValue}>{safeUser?.address || "-"}</span>
                  </div>

                  <div style={styles.divider} />

                  {/* ✅ Edit Profile button */}
                  <button type="button" onClick={openEditModal} style={styles.editProfileBtn}>
                    ✏️ Edit Profile
                  </button>

                  <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
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

            {/* WISHLIST */}
            <div style={styles.menuItem}>
              <div onClick={() => goAuthed("/wishlist")} style={{ ...styles.clickableMenu, position: "relative" }}>
                <span style={styles.icon}>♡</span>
                {wishlistCount > 0 && (
                  <span style={styles.badge}>{wishlistCount > 9 ? "9+" : wishlistCount}</span>
                )}
                <p style={styles.menuText}>Wishlist</p>
              </div>
            </div>

            {/* ORDERS */}
            <div style={styles.menuItem}>
              <div onClick={() => goAuthed("/my-orders")} style={styles.clickableMenu}>
                <span style={styles.icon}>📦</span>
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

        {openProfile && (
          <div
            onClick={() => setOpenProfile(false)}
            style={styles.backdrop}
          />
        )}
      </div>

      {/* ✅ Profile Modal */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

const styles = {
  outer: { width: "100%", borderBottom: "1px solid #e5e5e5", background: "#fff", position: "relative", zIndex: 20 },
  wrapper: { maxWidth: "1440px", height: "86px", margin: "0 auto", padding: "0 80px", display: "flex", alignItems: "center", boxSizing: "border-box" },
  leftGroup: { display: "flex", alignItems: "center", gap: "46px" },
  brand: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" },
  logoBox: { backgroundColor: "#e8f0ff", padding: "8px", borderRadius: "8px" },
  logoIcon: { fontSize: "20px" },
  brandText: { color: "#4a7bff", margin: 0, fontWeight: "600" },
  searchSection: { width: "480px", height: "40px", display: "flex", border: "2px solid #4a7bff", borderRadius: "6px", overflow: "hidden" },
  searchInput: { flex: 1, padding: "0 10px", border: "none", outline: "none", fontSize: "14px" },
  clearBtn: { border: "none", borderLeft: "1px solid #e5e5e5", background: "#fff", padding: "0 12px", cursor: "pointer", fontWeight: "700", color: "#111" },
  searchBtn: { backgroundColor: "#0066ff", color: "#ffffff", border: "none", padding: "0 16px", cursor: "pointer", fontWeight: "600" },
  rightMenu: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "18px" },
  menuItem: { textAlign: "center" },
  clickableMenu: { cursor: "pointer", userSelect: "none" },
  icon: { fontSize: "18px", color: "#777", display: "block" },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "6px",
    background: "#EF4444",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "800",
    borderRadius: "999px",
    minWidth: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
  },
  menuText: { fontSize: "10px", color: "#777", margin: 0, marginTop: "2px" },

  // ✅ Avatar initials circle in navbar
  avatarSmall: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0066ff, #4a7bff)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    letterSpacing: "0.5px",
  },

  profileDropdown: { position: "absolute", top: "52px", right: "-24px", width: "270px", background: "#fff", border: "1px solid #eaeaea", borderRadius: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.13)", padding: "14px", zIndex: 60 },

  // Dropdown header with avatar
  dropdownHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  dropdownAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #0066ff, #4a7bff)",
    color: "#fff", fontSize: "14px", fontWeight: "800",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  dropdownName: { margin: 0, fontWeight: "700", fontSize: "14px", color: "#111" },
  dropdownEmail: { margin: "2px 0 0", fontSize: "11.5px", color: "#888" },

  profileRow: { display: "flex", justifyContent: "space-between", gap: "10px", padding: "5px 0" },
  profileLabel: { fontSize: "12px", color: "#888" },
  profileValue: { fontSize: "12px", color: "#222", fontWeight: "600", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
  divider: { height: "1px", background: "#f0f0f0", margin: "10px 0" },

  // ✅ Edit Profile button — blue outlined
  editProfileBtn: {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1.5px solid #0066ff", background: "#f0f5ff",
    color: "#0066ff", cursor: "pointer", fontWeight: "700",
    textAlign: "center", marginBottom: "8px", fontSize: "13.5px",
  },
  logoutBtn: { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: "700" },
  backdrop: { position: "fixed", inset: 0, background: "transparent", zIndex: 10 },
};

export default Navbar;
