import React from "react";

const CheckoutHeader = () => {
  return (
    <div
      style={{
        width: "100%",
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          boxSizing: "border-box",
        }}
      >
        {/* Left: Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#3B82F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            👜
          </div>

          <div style={{ fontSize: "16px", fontWeight: 700, color: "#3B82F6" }}>
            Brand
          </div>
        </div>

        {/* Right: icons + labels */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          {[
            { label: "Profile", icon: "👤" },
            { label: "Message", icon: "💬" },
            { label: "Orders", icon: "❤️" },
            { label: "My cart", icon: "🛒" },
          ].map((x) => (
            <div
              key={x.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: "16px", color: "#6B7280" }}>{x.icon}</div>
              <div style={{ fontSize: "10px", color: "#6B7280" }}>{x.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
