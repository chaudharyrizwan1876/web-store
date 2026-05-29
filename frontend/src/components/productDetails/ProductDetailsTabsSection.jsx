import React from "react";

const ProductDetailsTabsSection = ({ product }) => {
  const tabs = ["Description"];

  const TabButton = ({ label }) => {
    return (
      <button
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "12px",
          color: "#2563EB",
          fontWeight: 700,
          padding: "10px 12px",
          borderBottom: "2px solid #2563EB",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        width: "880px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#FFFFFF",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Tabs header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          paddingLeft: "8px",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        {tabs.map((t) => (
          <TabButton key={t} label={t} />
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px", boxSizing: "border-box" }}>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.6" }}>
          {product?.description || "No description available for this product."}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsTabsSection;
