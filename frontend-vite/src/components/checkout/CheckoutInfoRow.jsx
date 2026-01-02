import React from "react";

const CheckoutInfoRow = () => {
  const items = [
    { title: "Secure payment", desc: "Have you ever finally just", icon: "🔒", width: "242px" },
    { title: "Customer support", desc: "Have you ever finally just", icon: "💬", width: "246px" },
    { title: "Free delivery", desc: "Have you ever finally just", icon: "🚚", width: "242px" },
  ];

  return (
    <div
      style={{
        width: "880px",          // ✅ same as CartSummaryBox width area
        display: "flex",
        gap: "54px",             // ✅ matches Figma left positions (130→426→726)
        marginTop: "14px",
      }}
    >
      {items.map((x) => (
        <div
          key={x.title}
          style={{
            width: x.width,
            height: "48px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            padding: "8px 10px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              background: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            {x.icon}
          </div>

          <div style={{ lineHeight: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
              {x.title}
            </div>
            <div style={{ fontSize: "10px", color: "#9CA3AF" }}>
              {x.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckoutInfoRow;
