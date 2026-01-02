import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";
import AdminDealsPanel from "../../components/admin/AdminDealsPanel";

const AdminDashboardPage = () => {
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

  const cards = useMemo(() => {
    const s = stats || {};
    return [
      { label: "Total Orders", value: s.totalOrders ?? 0 },
      { label: "Paid Orders", value: s.paidOrders ?? 0 },
      { label: "Unpaid Orders", value: s.unpaidOrders ?? 0 },
      { label: "COD Orders", value: s.codOrders ?? 0 },
      { label: "Stripe Orders", value: s.stripeOrders ?? 0 },
      { label: "Total Revenue", value: `Rs ${s.totalRevenue ?? 0}`, dark: true },
    ];
  }, [stats]);

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>Admin — Dashboard</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.75 }}>
            Store overview (orders + payments)
          </div>
        </div>

        <button type="button" onClick={loadStats} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {/* ✅ Deals Timer Panel */}
      <div style={{ marginTop: "14px" }}>
        <AdminDealsPanel />
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {!loading && !error && (
        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}
        >
          {cards.map((c) => (
            <div
              key={c.label}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "18px",
                background: c.dark ? "#111827" : "#fff",
                color: c.dark ? "#fff" : "#111827",
              }}
            >
              <div style={{ fontSize: "13px", opacity: c.dark ? 0.85 : 0.7 }}>
                {c.label}
              </div>
              <div style={{ fontSize: "30px", fontWeight: 900, marginTop: "6px" }}>
                {c.value}
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

export default AdminDashboardPage;
