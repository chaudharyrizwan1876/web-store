import React, { useState } from "react";

const ProductDetailsTabsSection = () => {
  const [tab, setTab] = useState("Description");

  const tabs = ["Description", "Reviews", "Shipping", "About seller"];

  const tableRows = [
    { k: "Model", v: "#8786867" },
    { k: "Style", v: "Classic style" },
    { k: "Certificate", v: "ISO-898921212" },
    { k: "Size", v: "34mm x 450mm x 19mm" },
    { k: "Memory", v: "36GB RAM" },
  ];

  const bullets = [
    "Some great feature name here",
    "Lorem ipsum dolor sit amet, consectetur",
    "Duis aute irure dolor in reprehenderit",
    "Some great feature name here",
  ];

  const TabButton = ({ label }) => {
    const active = tab === label;
    return (
      <button
        onClick={() => setTab(label)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "12px",
          color: active ? "#2563EB" : "#6B7280",
          fontWeight: active ? 700 : 500,
          padding: "10px 12px",
          borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        width: "880px",       // ✅ Figma
        height: "618px",      // ✅ Figma
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
      <div style={{ padding: "14px 16px", height: "calc(618px - 44px)", boxSizing: "border-box", overflowY: "auto" }}>
        {/* For now: show same content like screenshot for all tabs */}
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "18px" }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          eu fugiat nulla pariatur.
        </div>

        {/* Specs table */}
        <div
          style={{
            marginTop: "14px",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          {tableRows.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                borderBottom: idx === tableRows.length - 1 ? "none" : "1px solid #E5E7EB",
                background: idx % 2 === 0 ? "#F9FAFB" : "#FFFFFF",
                fontSize: "12px",
              }}
            >
              <div style={{ padding: "10px 12px", color: "#6B7280" }}>{row.k}</div>
              <div style={{ padding: "10px 12px", color: "#111827", fontWeight: 600 }}>{row.v}</div>
            </div>
          ))}
        </div>

        {/* Bullet list */}
        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#6B7280", fontSize: "14px" }}>✓</span>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsTabsSection;
