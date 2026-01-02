import React from "react";

const SuperDiscountBanner = () => {
  return (
    <div
      style={{
        width: "1180px",    // ✅ Figma
        height: "120px",    // ✅ Figma
        borderRadius: "8px",
        background: "linear-gradient(90deg, #2F80ED 0%, #0B5ED7 100%)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Decorative shape */}
      <div
        style={{
          position: "absolute",
          right: "150px",
          top: "-40px",
          width: "260px",
          height: "220px",
          background: "rgba(255,255,255,0.18)",
          transform: "skewX(-18deg)",
          borderRadius: "14px",
        }}
      />

      <div style={{ position: "relative" }}>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 800 }}>
          Super discount on more than 100 USD
        </div>
        <div style={{ marginTop: "6px", color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
          Have you ever finally just write dummy info
        </div>
      </div>

      <button
        style={{
          position: "relative",
          height: "36px",
          padding: "0 18px",
          border: "none",
          borderRadius: "8px",
          background: "#F59E0B",
          color: "#fff",
          fontWeight: 800,
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Shop now
      </button>
    </div>
  );
};

export default SuperDiscountBanner;
