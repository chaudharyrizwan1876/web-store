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

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

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

      {/* Table */}
      {!loading && !error && orders.length > 0 && (
        <div style={{ marginTop: "14px", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "980px",
              borderCollapse: "collapse",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
            }}
          >
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={th}>Order ID</th>
                <th style={th}>Status</th>
                <th style={th}>Payment</th>
                <th style={th}>Total</th>
                <th style={th}>Created</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const status = getStatusBadge(o.status);
                const paid = getPaidBadge(o.isPaid);

                return (
                  <tr key={o._id} style={{ borderTop: "1px solid #E5E7EB" }}>
                    <td style={tdMono} title={o._id}>
                      {o._id}
                    </td>

                    <td style={td}>
                      <span style={status.style}>{status.text}</span>
                    </td>

                    <td style={td}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={badgeStyle("#F9FAFB", "#374151")}>{o.paymentMethod || "-"}</span>
                        <span style={paid.style}>{paid.text}</span>
                      </div>
                    </td>

                    <td style={td}>
                      <b>Rs {o.total ?? 0}</b>
                    </td>

                    <td style={tdSmall}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>

                    <td style={td}>
                      <button type="button" onClick={() => navigate(`/order-success/${o._id}`)} style={ghostBtn}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const th = {
  textAlign: "left",
  padding: "12px",
  fontSize: "13px",
  borderBottom: "1px solid #E5E7EB",
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px",
  fontSize: "13px",
  verticalAlign: "top",
};

const tdSmall = {
  padding: "12px",
  fontSize: "12px",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const tdMono = {
  padding: "12px",
  fontSize: "12px",
  fontFamily: "monospace",
  maxWidth: "420px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
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
