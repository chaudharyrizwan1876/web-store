import React from "react";
import bannerImage from "../assets/images/banner.png";

const MiddleBanner = () => {
  const styles = {
    bannerBox: {
      flex: 1,
      height: "400px", // ✅ match Hero height (also fixes "295x" bug)
      borderRadius: "8px",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",

      backgroundImage: `url(${bannerImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    title: {
      fontSize: "28px",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#111",
    },

    subtitle: {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#111",
    },

    button: {
      background: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      fontWeight: "600",
      width: "120px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.bannerBox}>
      <h2 style={styles.title}>Latest Trending</h2>
      <h2 style={styles.subtitle}>Electronic Items</h2>
      <button style={styles.button}>Learn More</button>
    </div>
  );
};

export default MiddleBanner;
