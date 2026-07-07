import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const badgeStyle = (bg, color) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  border: "1px solid #E5E7EB",
  background: bg,
  color,
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
});

const getStatusBadge = (status) => {
  const s = (status || "PLACED").toUpperCase();
  if (s === "DELIVERED") return { text: "DELIVERED", style: badgeStyle("#ECFDF5", "#065F46") };
  if (s === "SHIPPED") return { text: "SHIPPED", style: badgeStyle("#EFF6FF", "#1D4ED8") };
  if (s === "CANCELLED") return { text: "CANCELLED", style: badgeStyle("#FEF2F2", "#991B1B") };
  if (s === "PAID") return { text: "PAID", style: badgeStyle("#F0FDF4", "#166534") };
  return { text: "PLACED", style: badgeStyle("#F9FAFB", "#374151") };
};

const getPaidBadge = (isPaid) => {
  if (isPaid) return { text: "PAID", style: badgeStyle("#F0FDF4", "#166534") };
  return { text: "UNPAID", style: badgeStyle("#FEF2F2", "#991B1B") };
};

const canCancel = (order) =>
  (order.status || "").toUpperCase() === "PLACED" &&
  (order.paymentStatus || "").toUpperCase() === "UNPAID";

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadMyOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/orders/my");
      const arr = Array.isArray(data) ? data : data?.orders || [];
      setOrders(arr);
    } catch (e) {
      setError(e?.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;
    const shipped = orders.filter((o) => (o.status || "").toUpperCase() === "SHIPPED").length;
    const paid = orders.filter((o) => !!o.isPaid).length;
    return { total, delivered, shipped, paid };
  }, [orders]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancellingId(orderId);
      const data = await apiFetch(`/api/orders/my/${orderId}/cancel`, { method: "PATCH" });
      const updatedOrder = data?.order;
      if (updatedOrder) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      } else {
        await loadMyOrders();
      }
    } catch (e) {
      alert(e?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "24px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>My Orders</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.75 }}>
            Total: <b>{stats.total}</b> • Paid: <b>{stats.paid}</b> • Shipped: <b>{stats.shipped}</b> • Delivered:{" "}
            <b>{stats.delivered}</b>
          </div>
        </div>

        <button type="button" onClick={loadMyOrders} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading orders...</p>}
        {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div style={{ marginTop: "14px", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontWeight: 900 }}>No orders yet</div>
          <div style={{ marginTop: "6px", opacity: 0.75, fontSize: "13px" }}>
            Go to Products and place your first order.
          </div>
          <button type="button" onClick={() => navigate("/products")} style={{ ...darkBtn, marginTop: "12px" }}>
            Continue Shopping
          </button>
        </div>
      )}

      {/* Order cards */}
      {!loading && !error && orders.length > 0 && (
        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {orders.map((o) => {
            const status = getStatusBadge(o.status);
            const paid = getPaidBadge(o.isPaid);
            const isExpanded = expandedId === o._id;
            const items = o.items || [];
            const previewItems = items.slice(0, 3);
            const extraCount = items.length - previewItems.length;

            return (
              <div
                key={o._id}
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  onClick={() => toggleExpand(o._id)}
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#6B7280" }}>
                      #{o._id.slice(-8).toUpperCase()}
                    </span>
                    <span style={status.style}>{status.text}</span>
                    <span style={paid.style}>{paid.text}</span>
                    <span style={badgeStyle("#F9FAFB", "#374151")}>{o.paymentMethod || "-"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}
                    </span>
                    <b style={{ fontSize: "15px" }}>Rs {o.total ?? 0}</b>
                    <span style={{ fontSize: "12px", color: "#2563EB" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Items preview row */}
                <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  {previewItems.map((it, idx) => (
                    <div
                      key={idx}
                      title={it.name}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#F9FAFB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {it.image ? (
                        <img src={it.image} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "10px", color: "#9CA3AF" }}>IMG</span>
                      )}
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <div style={{ fontSize: "12px", color: "#6B7280", fontWeight: 700 }}>+{extraCount} more</div>
                  )}
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginLeft: "auto" }}>
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #F3F4F6", padding: "14px 16px" }}>
                    {items.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: idx === items.length - 1 ? "none" : "1px solid #F9FAFB",
                          fontSize: "13px",
                        }}
                      >
                        <span>{it.name} × {it.qty}</span>
                        <span style={{ fontWeight: 700 }}>Rs {(it.price * it.qty).toFixed(2)}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280" }}>
                      <span>Subtotal</span>
                      <span>Rs {o.subtotal ?? 0}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280" }}>
                      <span>Shipping</span>
                      <span>Rs {o.shipping ?? 0}</span>
                    </div>

                    <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/order-success/${o._id}`); }}
                        style={ghostBtn}
                      >
                        View Full Details
                      </button>

                      {canCancel(o) && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCancel(o._id); }}
                          disabled={cancellingId === o._id}
                          style={{ ...cancelBtn, opacity: cancellingId === o._id ? 0.6 : 1 }}
                        >
                          {cancellingId === o._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

const ghostBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "13px",
};

const cancelBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #FCA5A5",
  background: "#FEF2F2",
  color: "#B91C1C",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "13px",
};

const darkBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
};

export default MyOrdersPage;
