import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RightSidebar = () => {
  const navigate = useNavigate();
  const { isAuthed, user } = useAuth();

  // ✅ safely pick first name from different possible shapes
  const firstName = useMemo(() => {
    const u = user || {};
    const name =
      u.firstName ||
      u.firstname ||
      u?.profile?.firstName ||
      u?.profile?.firstname ||
      (typeof u.name === "string" ? u.name.split(" ")[0] : "");

    return typeof name === "string" ? name.trim() : "";
  }, [user]);

  const displayName = isAuthed && firstName ? firstName : "User";

  const styles = {
    box: {
      width: "260px",
      height: "400px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
      marginRight: "0px",
    },

    card: {
      background: "#e0f5f6ff",
      borderRadius: "8px",
      padding: "12px",
      border: "1px solid #e5e7eb",
      boxSizing: "border-box",
    },

    userRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "4px",
    },

    profileIcon: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "16px",
      flexShrink: 0,
    },

    title: {
      fontSize: "15px",
      fontWeight: "600",
      margin: 0,
      lineHeight: "1.3",
    },

    subText: {
      fontSize: "13px",
      margin: "4px 0",
      color: "#555",
      lineHeight: "1.3",
    },

    buttonPrimary: {
      background: "#0d6efd",
      color: "#fff",
      border: "none",
      padding: "7px",
      width: "100%",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "13px",
      marginTop: "6px",
    },

    buttonSecondary: {
      background: "#fff",
      color: "#0d6efd",
      border: "1px solid #0d6efd",
      padding: "7px",
      width: "100%",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "13px",
      marginTop: "8px",
    },

    offerCard: {
      background: "#fd993bff",
      borderRadius: "8px",
      padding: "12px",
      color: "white",
      boxSizing: "border-box",
    },

    supplierCard: {
      background: "#b5bcfeff",
      borderRadius: "8px",
      padding: "12px",
      color: "white",
      boxSizing: "border-box",
    },
  };

  return (
    <div style={styles.box}>
      {/* USER CARD */}
      <div style={styles.card}>
        <div style={styles.userRow}>
          <div style={styles.profileIcon}>👤</div>
          <h3 style={styles.title}>Hi, {displayName}</h3>
        </div>

        <p style={styles.subText}>Let’s get started</p>

        {!isAuthed ? (
          <>
            {/* ✅ Signup */}
            <button
              style={styles.buttonPrimary}
              onClick={() => navigate("/auth?mode=signup")}
            >
              Join Now
            </button>

            {/* ✅ Login */}
            <button
              style={styles.buttonSecondary}
              onClick={() => navigate("/auth?mode=login")}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            {/* ✅ If logged in, send to profile/orders etc (optional) */}
            <button
              style={styles.buttonPrimary}
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </button>

            <button
              style={styles.buttonSecondary}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </>
        )}
      </div>

      {/* OFFER CARD */}
      <div style={styles.offerCard}>
        <h3 style={styles.title}>Get US $10 off</h3>
        <p style={styles.subText}>With a new</p>
        <p style={styles.subText}>supplier</p>
      </div>

      {/* SUPPLIER CARD */}
      <div style={styles.supplierCard}>
        <h3 style={styles.title}>Send quotes with</h3>
        <p style={styles.subText}>supplier</p>
        <p style={styles.subText}>Preferences</p>
      </div>
    </div>
  );
};

export default RightSidebar;
