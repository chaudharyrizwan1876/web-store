// ====================== ExtraServices.jsx (UPDATED clickable) ======================
import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ IMPORT IMAGES
import imgIndustry from "../assets/images/service-industry.png";
import imgCustomize from "../assets/images/service-customize.png";
import imgShipping from "../assets/images/service-shipping.png";
import imgMonitoring from "../assets/images/service-monitoring.png";

const ExtraServices = () => {
  const navigate = useNavigate();

  // ✅ These links are safe + useful without needing new pages
  // You can change later to /services or /contact when you create pages.
  const services = [
    { title: "Source from\nIndustry Hubs", img: imgIndustry, icon: "🔍", to: "/products" },
    { title: "Customize Your\nProducts", img: imgCustomize, icon: "🧾", to: "/products" },
    { title: "Fast, reliable shipping\nby ocean or air", img: imgShipping, icon: "✈️", to: "/checkout" },
    { title: "Product monitoring\nand inspection", img: imgMonitoring, icon: "🛡️", to: "/products" },
  ];

  const styles = {
    wrapper: {
      maxWidth: "1180px",
      margin: "20px auto 0",
      boxSizing: "border-box",
    },

    heading: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111",
      margin: "0 0 14px 0",
    },

    row: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 280px)",
      gap: "20px",
    },

    card: {
      width: "280px",
      height: "200px",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      overflow: "hidden",
      position: "relative",
      boxSizing: "border-box",
      cursor: "pointer",
    },

    imgBox: {
      width: "100%",
      height: "90px",
      overflow: "hidden",
    },

    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },

    content: {
      padding: "12px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#111",
      lineHeight: "1.25",
      whiteSpace: "pre-line",
      paddingRight: "60px",
      boxSizing: "border-box",
    },

    iconCircle: {
      position: "absolute",
      right: "14px",
      top: "60px",
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "#e8f0fe",
      border: "1px solid #dbeafe",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "#111",
      pointerEvents: "none",
    },
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Our extra services</h2>

      <div style={styles.row}>
        {services.map((s, i) => (
          <div key={i} style={styles.card} onClick={() => navigate(s.to)} role="button" tabIndex={0}>
            <div style={styles.imgBox}>
              <img src={s.img} alt="service" style={styles.img} />
            </div>

            <div style={styles.iconCircle}>{s.icon}</div>

            <div style={styles.content}>{s.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraServices;
