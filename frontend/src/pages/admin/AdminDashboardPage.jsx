import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import AdminDealsPanel from "../../components/admin/AdminDealsPanel";

const statusBadge = (status) => {
  const map = {
    DELIVERED: { bg: "#ECFDF5", color: "#065F46" },
    SHIPPED: { bg: "#EFF6FF", color: "#1D4ED8" },
    CANCELLED: { bg: "#FEF2F2", color: "#991B1B" },
    PAID: { bg: "#F0FDF4", color: "#166534" },
    PLACED: { bg: "#F9FAFB", color: "#374151" },
  };
  const c = map[status] || map.PLACED;
  return {
    display: "inline-flex",
    padding: "4px 10px",
    borderRadius: "999px",
    background: c.bg,
    color: c.color,
    fontSize: "11px",
    fontWeight: 800,
  };
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/admin/dashboard");
      setStats(data);
    } catch (e) {
      setError(e?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const s = stats || {};

  // ── Primary KPI cards ──
  const kpiCards = useMemo(
    () => [
      { label: "Total Revenue", value: `Rs ${s.totalRevenue ?? 0}`, icon: "💰", accent: "#111827", text: "#fff" },
      { label: "Total Orders", value: s.totalOrders ?? 0, icon: "🧾", accent: "#EFF6FF", text: "#1D4ED8" },
      { label: "Total Products", value: s.totalProducts ?? 0, icon: "📦", accent: "#F0FDF4", text: "#166534" },
      { label: "Total Users", value: s.totalUsers ?? 0, icon: "👥", accent: "#FEF3C7", text: "#92400E" },
    ],
    [s]
  );

  // ── Orders breakdown ──
  const orderCards = useMemo(
    () => [
      { label: "Placed", value: s.placedOrders ?? 0 },
      { label: "Shipped", value: s.shippedOrders ?? 0 },
      { label: "Delivered", value: s.deliveredOrders ?? 0 },
      { label: "Cancelled", value: s.cancelledOrders ?? 0 },
      { label: "Paid", value: s.paidOrders ?? 0 },
      { label: "Unpaid", value: s.unpaidOrders ?? 0 },
      { label: "COD", value: s.codOrders ?? 0 },
      { label: "Stripe", value: s.stripeOrders ?? 0 },
    ],
    [s]
  );

  // ── Products health ──
  const productCards = useMemo(
    () => [
      { label: "Active", value: s.activeProducts ?? 0, color: "#166534" },
      { label: "Inactive", value: s.inactiveProducts ?? 0, color: "#6B7280" },
      { label: "Low Stock", value: s.lowStockProducts ?? 0, color: "#B45309" },
      { label: "Out of Stock", value: s.outOfStockProducts ?? 0, color: "#B91C1C" },
    ],
    [s]
  );

  // ── Simple 7-day trend bar chart (no external lib) ──
  const trend = s.ordersTrend || [];
  const maxCount = Math.max(1, ...trend.map((t) => t.count));

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 900, margin: 0 }}>Dashboard</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.7 }}>
            Complete overview of your store's performance
          </div>
        </div>

        <button type="button" onClick={loadStats} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {!loading && !error && (
        <>
          {/* ── KPI Cards ── */}
          <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {kpiCards.map((c) => (
              <div
                key={c.label}
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  padding: "18px",
                  background: c.accent,
                  color: c.text,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", opacity: 0.85 }}>{c.label}</span>
                  <span style={{ fontSize: "20px" }}>{c.icon}</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, marginTop: "8px" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* ── Orders breakdown + Products health (side by side) ── */}
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px" }}>
            {/* Orders breakdown */}
            <div style={panelStyle}>
              <div style={panelTitle}>Orders Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "12px" }}>
                {orderCards.map((c) => (
                  <div key={c.label} style={{ border: "1px solid #F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 900, color: "#111827" }}>{c.value}</div>
                    <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products health */}
            <div style={panelStyle}>
              <div style={panelTitle}>Products Health</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                {productCards.map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#374151" }}>{c.label}</span>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: c.color }}>{c.value}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                style={{ ...smallBtn, marginTop: "14px", width: "100%" }}
              >
                Manage Products →
              </button>
            </div>
          </div>

          {/* ── 7-day trend + Low stock alert ── */}
          <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px" }}>
            {/* Orders trend chart */}
            <div style={panelStyle}>
              <div style={panelTitle}>Orders — Last 7 Days</div>
              {trend.length === 0 ? (
                <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "12px" }}>No orders in the last 7 days.</div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "140px", marginTop: "16px" }}>
                  {trend.map((t) => (
                    <div key={t._id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div style={{ fontSize: "10px", color: "#6B7280", fontWeight: 700 }}>{t.count}</div>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "36px",
                          height: `${Math.max(6, (t.count / maxCount) * 100)}px`,
                          background: "linear-gradient(180deg, #2563EB, #3B82F6)",
                          borderRadius: "6px 6px 0 0",
                        }}
                        title={`${t.count} orders, Rs ${t.revenue}`}
                      />
                      <div style={{ fontSize: "9.5px", color: "#9CA3AF", marginTop: "2px" }}>
                        {t._id.slice(5)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low stock alert list */}
            <div style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={panelTitle}>⚠️ Low Stock Alert</div>
              </div>

              {(s.lowStockList || []).length === 0 ? (
                <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "12px" }}>
                  All products are well stocked ✅
                </div>
              ) : (
                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {s.lowStockList.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 10px",
                        background: "#FFFBEB",
                        border: "1px solid #FDE68A",
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#92400E" }}>{p.name}</div>
                        <div style={{ fontSize: "11px", color: "#B45309" }}>{p.category}</div>
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 900, color: "#B45309" }}>{p.stock} left</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Recent orders table ── */}
          <div style={{ marginTop: "16px", ...panelStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={panelTitle}>Recent Orders</div>
              <button type="button" onClick={() => navigate("/admin/orders")} style={smallBtn}>
                View All →
              </button>
            </div>

            {(s.recentOrders || []).length === 0 ? (
              <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "12px" }}>No orders yet.</div>
            ) : (
              <div style={{ marginTop: "12px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      <th style={th}>Customer</th>
                      <th style={th}>Total</th>
                      <th style={th}>Payment</th>
                      <th style={th}>Status</th>
                      <th style={th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.recentOrders.map((o) => (
                      <tr key={o._id} style={{ borderTop: "1px solid #F3F4F6" }}>
                        <td style={td}>
                          {o.user ? `${o.user.firstName || ""} ${o.user.lastName || ""}` : "Guest"}
                          <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{o.user?.email}</div>
                        </td>
                        <td style={td}><b>Rs {o.total}</b></td>
                        <td style={td}>{o.paymentMethod}</td>
                        <td style={td}><span style={statusBadge(o.status)}>{o.status}</span></td>
                        <td style={{ ...td, fontSize: "12px", color: "#6B7280" }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Deals Timer Panel ── */}
          <div style={{ marginTop: "16px" }}>
            <AdminDealsPanel />
          </div>
        </>
      )}
    </div>
  );
};

const panelStyle = {
  border: "1px solid #E5E7EB",
  borderRadius: "14px",
  padding: "18px",
  background: "#fff",
};

const panelTitle = { fontSize: "15px", fontWeight: 800, color: "#111827" };

const th = { textAlign: "left", padding: "10px", fontSize: "12px", color: "#6B7280", fontWeight: 700 };
const td = { padding: "10px", fontSize: "13px", color: "#111827" };

const refreshBtn = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  height: "40px",
};

const smallBtn = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 700,
  color: "#2563EB",
};

export default AdminDashboardPage;
