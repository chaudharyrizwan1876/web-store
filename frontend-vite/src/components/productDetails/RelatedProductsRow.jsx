import React from "react";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/pd_thumb_2.jpg";

const RelatedProductsRow = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
        padding: "14px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
        Related products
      </div>

      {items.length === 0 ? (
        <div style={{ fontSize: "12px", color: "#6B7280" }}>No related products yet</div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "6px",
          }}
        >
          {items.map((p) => {
            const img = (p.images && p.images[0]) ? p.images[0] : fallbackImg;

            return (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                style={{
                  width: "200px",
                  flexShrink: 0,
                  border: "1px solid #F3F4F6",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={img}
                    alt={p.name}
                    style={{ width: "120px", height: "120px", objectFit: "contain" }}
                  />
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: "16px",
                    minHeight: "32px",
                    overflow: "hidden",
                  }}
                >
                  {p.name}
                </div>

                <div style={{ marginTop: "8px", fontSize: "12px", color: "#2563EB", fontWeight: 900 }}>
                  ${Number(p.price).toFixed(2)}
                </div>

                <div style={{ marginTop: "4px", fontSize: "11px", color: "#6B7280" }}>
                  {p.category || "Product"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelatedProductsRow;
