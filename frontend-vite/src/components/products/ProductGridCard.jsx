import React from "react";
import { useNavigate } from "react-router-dom";

const ProductGridCard = ({ item }) => {
  const navigate = useNavigate();

  const goDetails = () => {
    if (item?.id) navigate(`/product/${item.id}`);
  };

  return (
    <div
      onClick={goDetails}
      style={{
        width: "295px",
        height: "405px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#FFFFFF",
        boxSizing: "border-box",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div
        style={{
          height: "190px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{ width: "170px", height: "170px", objectFit: "contain" }}
        />
      </div>

      {/* Price row + heart */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
              ${Number(item.price).toFixed(2)}
            </span>

            {!!item.oldPrice && (
              <span style={{ fontSize: "12px", color: "#9CA3AF", textDecoration: "line-through" }}>
                ${Number(item.oldPrice).toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
            <span style={{ color: "#F59E0B", fontSize: "12px", letterSpacing: "1px" }}>★★★★★</span>
            <span style={{ color: "#F59E0B", fontSize: "12px", fontWeight: 600 }}>{item.rating}</span>
          </div>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "32px",
            height: "32px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="wishlist"
          title="wishlist"
        >
          <span style={{ color: "#2563EB", fontSize: "18px" }}>♡</span>
        </button>
      </div>

      {/* Title */}
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#6B7280", lineHeight: "16px" }}>
        {item.title}
      </div>

      {/* Description small */}
      <div style={{ marginTop: "6px", fontSize: "11px", color: "#9CA3AF", lineHeight: "14px" }}>
        {item.short}
      </div>
    </div>
  );
};

export default ProductGridCard;
