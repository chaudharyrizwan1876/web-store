// ====================== frontend-vite/src/pages/GiftProjectsPage.jsx (NEW) ======================
import React from "react";

const GiftProjectsPage = () => {
  const styles = {
    wrap: { maxWidth: 1180, margin: "0 auto", padding: "24px 0" },
    title: { fontSize: 22, fontWeight: 900, margin: 0 },
    sub: { marginTop: 6, fontSize: 13, opacity: 0.75 },
    box: {
      marginTop: 16,
      border: "1px solid #E5E7EB",
      borderRadius: 14,
      background: "#fff",
      padding: 18,
    },
    h: { fontSize: 16, fontWeight: 900, margin: 0 },
    p: { marginTop: 10, fontSize: 14, opacity: 0.8 },
    spacer: { height: 14 },
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Gift Boxes & Projects</h2>
      <div style={styles.sub}>These sections will be available soon.</div>

      <div style={styles.box}>
        <h3 style={styles.h}>Gift boxes will be shown here</h3>
        <div style={styles.p}>
          We will add curated gift bundles here (seasonal offers, bundles, and special packaging options).
        </div>
      </div>

      <div style={styles.spacer} />

      <div style={styles.box}>
        <h3 style={styles.h}>Projects will be displayed here</h3>
        <div style={styles.p}>
          This area will include custom sourcing projects, bulk requests, and enterprise orders with tracking.
        </div>
      </div>
    </div>
  );
};

export default GiftProjectsPage;
