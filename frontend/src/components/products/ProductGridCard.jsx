import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import StockBadge from "./StockBadge";

const ProductGridCard = ({ item }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(item.id);
  const isOutOfStock = item.stock !== null && item.stock !== undefined && item.stock <= 0;

  const goDetails = () => {
    if (item?.id) navigate(`/product/${item.id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    const result = await toggleWishlist(item.id);
    if (result?.needsAuth) {
      navigate("/auth");
    }
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
        position: "relative",
        opacity: isOutOfStock ? 0.7 : 1,
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
          position: "relative",
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{ width: "170px", height: "170px", objectFit: "contain" }}
        />

        {/* ✅ Stock badge top-left of image */}
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <StockBadge stock={item.stock} />
        </div>
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
          onClick={handleWishlistClick}
          style={{
            width: "32px",
            height: "32px",
            border: inWishlist ? "1px solid #FCA5A5" : "1px solid #E5E7EB",
            borderRadius: "8px",
            background: inWishlist ? "#FEF2F2" : "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span style={{ color: inWishlist ? "#EF4444" : "#2563EB", fontSize: "18px" }}>
            {inWishlist ? "♥" : "♡"}
          </span>
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
