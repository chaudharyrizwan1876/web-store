import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { resolveProductImage } from "../utils/productImages";
import { useWishlist } from "../context/WishlistContext";

import fallbackImg from "../assets/images/prod_headphones.png";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { toggleWishlist, reloadWishlist } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/wishlist");
      setProducts(data.wishlist || []);
    } catch (e) {
      setError(e?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    // Optimistic remove from local list
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    await toggleWishlist(productId);
    await reloadWishlist();
  };

  const goDetails = (id) => navigate(`/product/${id}`);

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "24px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>My Wishlist</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.75 }}>
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </div>
        </div>

        <button type="button" onClick={loadWishlist} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading wishlist...</p>}
        {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div style={{ marginTop: "14px", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "40px" }}>♡</div>
          <div style={{ fontWeight: 900, marginTop: "10px" }}>Your wishlist is empty</div>
          <div style={{ marginTop: "6px", opacity: 0.75, fontSize: "13px" }}>
            Tap the heart icon on any product to save it here.
          </div>
          <button type="button" onClick={() => navigate("/products")} style={{ ...darkBtn, marginTop: "16px" }}>
            Browse Products
          </button>
        </div>
      )}

      {/* Grid of wishlist items */}
      {!loading && !error && products.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                background: "#fff",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(p._id);
                }}
                style={removeBtn}
                title="Remove from wishlist"
                aria-label="Remove from wishlist"
              >
                ✕
              </button>

              <div onClick={() => goDetails(p._id)} style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={resolveProductImage(p.images?.[0], fallbackImg)}
                  alt={p.name}
                  style={{ width: "140px", height: "140px", objectFit: "contain" }}
                />
              </div>

              <div onClick={() => goDetails(p._id)} style={{ marginTop: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", lineHeight: "18px" }}>
                  {p.name}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>
                    ${Number(p.price).toFixed(2)}
                  </span>
                  {!!p.oldPrice && (
                    <span style={{ fontSize: "12px", color: "#9CA3AF", textDecoration: "line-through" }}>
                      ${Number(p.oldPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: "6px", fontSize: "11px", color: "#6B7280" }}>
                  {p.category || "Product"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const refreshBtn = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  height: "40px",
};

const darkBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
};

const removeBtn = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  color: "#6B7280",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
};

export default WishlistPage;
