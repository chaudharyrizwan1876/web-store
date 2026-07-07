import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

const ProductListItem = ({ item }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(item.id);

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
        width: "920px",
        height: "218px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px",
        boxSizing: "border-box",
        marginBottom: "14px",
        cursor: "pointer",
      }}
    >
      {/* Left image */}
      <div
        style={{
          width: "150px",
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: "150px",
            height: "150px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Middle content */}
      <div style={{ flex: 1, paddingLeft: "18px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {item.title}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>
            ${Number(item.price).toFixed(2)}
          </span>

          {!!item.oldPrice && (
            <span style={{ fontSize: "13px", color: "#9CA3AF", textDecoration: "line-through" }}>
              ${Number(item.oldPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating + meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <span style={{ color: "#F59E0B", letterSpacing: "1px" }}>★★★★★</span>
          <span style={{ fontSize: "13px", color: "#F59E0B", fontWeight: 600 }}>{item.rating}</span>

          <span style={{ width: "4px", height: "4px", background: "#D1D5DB", borderRadius: "999px" }} />

          <span style={{ fontSize: "13px", color: "#6B7280" }}>{item.orders} orders</span>

          <span style={{ width: "4px", height: "4px", background: "#D1D5DB", borderRadius: "999px" }} />

          <span style={{ fontSize: "13px", color: "#16A34A", fontWeight: 600 }}>Free Shipping</span>
        </div>

        {/* Description */}
        <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: "18px", marginBottom: "10px" }}>
          {item.desc}
        </div>

        {/* Link (stop bubbling so only this behaves like link, optional) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            goDetails();
          }}
          style={{ fontSize: "13px", color: "#2563EB", fontWeight: 600, cursor: "pointer", width: "fit-content" }}
        >
          View details
        </div>
      </div>

      {/* Right wishlist button */}
      <div style={{ alignSelf: "flex-start" }}>
        <button
          onClick={handleWishlistClick}
          style={{
            width: "36px",
            height: "36px",
            border: inWishlist ? "1px solid #FCA5A5" : "1px solid #E5E7EB",
            borderRadius: "8px",
            background: inWishlist ? "#FEF2F2" : "#FFFFFF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span style={{ fontSize: "18px", color: inWishlist ? "#EF4444" : "#2563EB" }}>
            {inWishlist ? "♥" : "♡"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;
