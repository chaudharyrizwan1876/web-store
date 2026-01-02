import React from "react";

// ✅ IMPORT APP STORE IMAGES
import appStoreImg from "../assets/images/app-store.png";
import googlePlayImg from "../assets/images/google-play.png";

const Footer = () => {
  const styles = {
    outer: {
      width: "100%",
      background: "#fff",
      borderTop: "1px solid #e5e7eb",
      boxSizing: "border-box",
    },

    wrapper: {
      maxWidth: "1180px",
      margin: "0 auto",
      padding: "40px 0",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      boxSizing: "border-box",
    },

    colTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#111",
      margin: "0 0 10px 0",
    },

    link: {
      fontSize: "13px",
      color: "#6b7280",
      margin: "8px 0",
      cursor: "pointer",
    },

    // BRAND
    brandCol: {
      width: "276px",
      height: "157px",
    },

    brandRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
    },

    brandIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      background: "#e8f0fe",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "#2563eb",
    },

    brandText: {
      fontSize: "22px",
      fontWeight: "700",
      margin: 0,
      color: "#4a7bff",
    },

    brandDesc: {
      fontSize: "13px",
      color: "#6b7280",
      lineHeight: "1.5",
      margin: "0 0 14px 0",
    },

    socialRow: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },

    socialCircle: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      color: "#6b7280",
      cursor: "pointer",
    },

    // OTHER COLS
    aboutCol: { width: "81px", height: "137px" },
    partnerCol: { width: "90px", height: "137px" },
    infoCol: { width: "108px", height: "137px" },
    usersCol: { width: "78px", height: "137px" },

    // GET APP
    appCol: {
      width: "124px",
      height: "129px",
    },

    // ✅ replace old small boxes with images (same size feel)
    storeImg: {
      width: "124px",     // same as column width
      height: "38px",     // same as old button height feel
      objectFit: "contain",
      display: "block",
      cursor: "pointer",
      marginBottom: "10px",
    },
  };

  return (
    <footer style={styles.outer}>
      <div style={styles.wrapper}>
        {/* BRAND */}
        <div style={styles.brandCol}>
          <div style={styles.brandRow}>
            <div style={styles.brandIcon}>👜</div>
            <h2 style={styles.brandText}>Brand</h2>
          </div>

          <p style={styles.brandDesc}>
            Best information about the company goes here but now lorem ipsum is
          </p>

          <div style={styles.socialRow}>
            <div style={styles.socialCircle}>f</div>
            <div style={styles.socialCircle}>🐦</div>
            <div style={styles.socialCircle}>in</div>
            <div style={styles.socialCircle}>📷</div>
            <div style={styles.socialCircle}>▶</div>
          </div>
        </div>

        {/* ABOUT */}
        <div style={styles.aboutCol}>
          <p style={styles.colTitle}>About</p>
          <p style={styles.link}>About Us</p>
          <p style={styles.link}>Find store</p>
          <p style={styles.link}>Categories</p>
          <p style={styles.link}>Blogs</p>
        </div>

        {/* PARTNERSHIP */}
        <div style={styles.partnerCol}>
          <p style={styles.colTitle}>Partnership</p>
          <p style={styles.link}>About Us</p>
          <p style={styles.link}>Find store</p>
          <p style={styles.link}>Categories</p>
          <p style={styles.link}>Blogs</p>
        </div>

        {/* INFORMATION */}
        <div style={styles.infoCol}>
          <p style={styles.colTitle}>Information</p>
          <p style={styles.link}>Help Center</p>
          <p style={styles.link}>Money Refund</p>
          <p style={styles.link}>Shipping</p>
          <p style={styles.link}>Contact us</p>
        </div>

        {/* FOR USERS */}
        <div style={styles.usersCol}>
          <p style={styles.colTitle}>For users</p>
          <p style={styles.link}>Login</p>
          <p style={styles.link}>Register</p>
          <p style={styles.link}>Settings</p>
          <p style={styles.link}>My Orders</p>
        </div>

        {/* ✅ GET APP (images) */}
        <div style={styles.appCol}>
          <p style={styles.colTitle}>Get app</p>

          <img
            src={appStoreImg}
            alt="Download on the App Store"
            style={styles.storeImg}
          />

          <img
            src={googlePlayImg}
            alt="Get it on Google Play"
            style={styles.storeImg}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
