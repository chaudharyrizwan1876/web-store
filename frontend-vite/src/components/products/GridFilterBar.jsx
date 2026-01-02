import React from "react";

const chipStyle = {
  height: "24px",
  border: "1px solid #E5E7EB",
  borderRadius: "6px",
  padding: "0 8px",
  fontSize: "11px",
  color: "#111827",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "#fff",
  cursor: "pointer",
};

const GridFilterBar = () => {
  const chips = ["Samsung", "Apple", "Poco", "Metallic", "4 star", "3 star"];

  return (
    <div style={{ width: "920px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
      {chips.map((c) => (
        <div key={c} style={chipStyle}>
          <span>{c}</span>
          <span style={{ color: "#6B7280" }}>×</span>
        </div>
      ))}

      <div style={{ fontSize: "11px", color: "#2563EB", cursor: "pointer", marginLeft: "4px" }}>
        Clear all filter
      </div>
    </div>
  );
};

export default GridFilterBar;
