import React from "react";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/pd_thumb_1.jpg";

const YouMayLike = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "280px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
        padding: "12px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
        You may like
      </div>

      {items.length === 0 ? (
        <div style={{ fontSize: "12px", color: "#6B7280" }}>No suggestions yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((p) => {
            const img = (p.images && p.images[0]) ? p.images[0] : fallbackImg;

            return (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  cursor: "pointer",
                  border: "1px solid #F3F4F6",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <img
                  src={img}
                  alt={p.name}
                  style={{ width: "54px", height: "54px", objectFit: "contain", flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: "16px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </div>

                  <div style={{ marginTop: "4px", fontSize: "12px", color: "#2563EB", fontWeight: 800 }}>
                    ${Number(p.price).toFixed(2)}
                  </div>

                  <div style={{ marginTop: "3px", fontSize: "11px", color: "#6B7280" }}>
                    {p.category || "Product"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YouMayLike;
