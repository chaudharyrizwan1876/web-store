import React from "react";

const CouponBox = () => {
  return (
    <div
      style={{
        width: "280px",          // ✅ Figma
        height: "110px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
        boxSizing: "border-box",
        padding: "14px",
      }}
    >
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
        Have a coupon?
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        <input
          placeholder="Add coupon"
          style={{
            flex: 1,
            height: "32px",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            padding: "0 10px",
            fontSize: "12px",
            outline: "none",
          }}
        />

        <button
          style={{
            width: "64px",
            height: "32px",
            borderRadius: "6px",
            border: "1px solid #BFDBFE",
            background: "#fff",
            color: "#2563EB",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CouponBox;
