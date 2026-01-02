import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

// fallback images
import cart1 from "../../assets/images/co_cart_1.png";
import cart2 from "../../assets/images/co_cart_2.png";
import cart3 from "../../assets/images/co_cart_3.png";

const fallbackImgs = [cart1, cart2, cart3];

const CartSummaryBox = ({ cartItems = [], reloadCart }) => {
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);

  const items = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];
    return cartItems.map((x, idx) => {
      const p = x?.product || {};
      const img =
        (Array.isArray(p?.images) && p.images[0]) ||
        fallbackImgs[idx % fallbackImgs.length];

      return {
        cartItemId: x?._id,
        productId: p?._id,
        title: p?.name || "Product",
        price: typeof p?.price === "number" ? p.price : 0,
        qty: typeof x?.qty === "number" ? x.qty : 1,
        img,
      };
    });
  }, [cartItems]);

  const updateQty = async (productId, qty) => {
    try {
      setBusyId(productId);
      await apiFetch("/api/cart", {
        method: "PATCH",
        body: { productId, qty },
      });
      await reloadCart();
    } catch (err) {
      alert(err.message || "Failed to update quantity");
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setBusyId(productId);
      await apiFetch(`/api/cart/${productId}`, { method: "DELETE" });
      await reloadCart();
    } catch (err) {
      alert(err.message || "Failed to remove item");
    } finally {
      setBusyId(null);
    }
  };

  // ✅ FIXED REMOVE ALL
  const removeAll = async () => {
    try {
      setBusyId("ALL");
      await apiFetch("/api/cart/clear", { method: "DELETE" });
      await reloadCart();
      alert("✅ Cart cleared!");
    } catch (err) {
      alert(err.message || "Failed to clear cart");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ width: "880px" }}>
      <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "12px" }}>
        My cart ({items.length})
      </div>

      <div
        style={{
          width: "880px",
          height: "552px",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "14px",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? (
            <div style={{ padding: "20px", color: "#6B7280" }}>
              Cart is empty.
            </div>
          ) : (
            items.map((p, idx) => (
              <div
                key={p.cartItemId || idx}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom:
                    idx === items.length - 1 ? "none" : "1px solid #F3F4F6",
                }}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  style={{ width: "56px", height: "56px", objectFit: "contain" }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <button
                    onClick={() => removeItem(p.productId)}
                    disabled={busyId === p.productId}
                    style={{
                      marginTop: "6px",
                      fontSize: "11px",
                      border: "1px solid #FCA5A5",
                      borderRadius: "6px",
                      background: "#fff",
                      color: "#DC2626",
                      cursor:
                        busyId === p.productId ? "not-allowed" : "pointer",
                      opacity: busyId === p.productId ? 0.6 : 1,
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800 }}>
                    Rs {p.price.toLocaleString()}
                  </div>

                  <select
                    value={p.qty}
                    disabled={busyId === p.productId}
                    onChange={(e) =>
                      updateQty(p.productId, Number(e.target.value))
                    }
                    style={{
                      marginTop: "6px",
                      width: "86px",
                      height: "30px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option key={n} value={n}>
                        Qty: {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* bottom bar */}
        <div
          style={{
            borderTop: "1px solid #F3F4F6",
            paddingTop: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate("/products")}
            style={{
              height: "34px",
              padding: "0 14px",
              borderRadius: "8px",
              border: "none",
              background: "#2563EB",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Back to shop
          </button>

          <button
            onClick={removeAll}
            disabled={busyId === "ALL"}
            style={{
              height: "30px",
              padding: "0 12px",
              borderRadius: "8px",
              border: "1px solid #BFDBFE",
              background: "#fff",
              color: "#2563EB",
              fontSize: "12px",
              fontWeight: 700,
              cursor: busyId === "ALL" ? "not-allowed" : "pointer",
              opacity: busyId === "ALL" ? 0.6 : 1,
            }}
          >
            Remove all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryBox;
