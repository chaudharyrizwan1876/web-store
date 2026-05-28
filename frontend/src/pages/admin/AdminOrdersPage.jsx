import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";

const ALL_STATUSES = ["PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_METHODS = ["ALL", "COD", "STRIPE"];
const PAID_FILTERS = ["ALL", "PAID", "UNPAID"];
const SORTS = ["NEWEST", "OLDEST", "TOTAL_HIGH", "TOTAL_LOW"];

const AdminOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const [statusDraft, setStatusDraft] = useState({});
  const [saving, setSaving] = useState({});

  // ✅ UI controls
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [paidFilter, setPaidFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // ✅ modal
  const [openOrder, setOpenOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/api/admin/orders");
      const arr = Array.isArray(data) ? data : [];
      setOrders(arr);

      const init = {};
      for (const o of arr) init[o._id] = o.status || "PLACED";
      setStatusDraft(init);
    } catch (e) {
      setError(e?.message || "Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  // ✅ Status flow logic matches backend rules (adminOrderController.js)
  const getEffectiveCurrent = (order) => {
    const cur = order.status || "PLACED";
    // backend treats paid+PLACED as PAID flow
    if (order.isPaid && cur === "PLACED") return "PAID";
    return cur;
  };

  const getAllowedNextStatuses = (order) => {
    const effectiveCurrent = getEffectiveCurrent(order);

    const flow = {
      PLACED: ["SHIPPED", "CANCELLED"],
      PAID: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    let next = flow[effectiveCurrent] || [];

    // 🔒 extra safety: paid order cannot cancel
    if (order.isPaid) next = next.filter((s) => s !== "CANCELLED");

    return next;
  };

  const onChangeDraft = (orderId, nextStatus) => {
    setStatusDraft((prev) => ({ ...prev, [orderId]: nextStatus }));
  };

  const updateStatus = async (orderId) => {
    const nextStatus = statusDraft[orderId];
    if (!nextStatus) return;

    try {
      setSaving((p) => ({ ...p, [orderId]: true }));
      setError("");

      const res = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const updated = res?.order;
      if (updated?._id) {
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
        setStatusDraft((prev) => ({ ...prev, [updated._id]: updated.status || prev[updated._id] }));
      }
    } catch (e) {
      setError(e?.message || "Failed to update status");
    } finally {
      setSaving((p) => ({ ...p, [orderId]: false }));
    }
  };

  const markCodPaid = async (orderId) => {
    try {
      setSaving((p) => ({ ...p, [orderId]: true }));
      setError("");

      const res = await apiFetch(`/api/admin/orders/${orderId}/mark-paid`, {
        method: "PATCH",
      });

      const updated = res?.order;
      if (updated?._id) {
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
        setStatusDraft((prev) => ({ ...prev, [orderId]: updated.status || prev[orderId] }));
      }
    } catch (e) {
      setError(e?.message || "Failed to mark order paid");
    } finally {
      setSaving((p) => ({ ...p, [orderId]: false }));
    }
  };

  const filteredSorted = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = [...orders];

    // Search
    if (term) {
      list = list.filter((o) => {
        const id = (o._id || "").toLowerCase();
        const email = (o?.user?.email || "").toLowerCase();
        const fn = (o?.user?.firstName || "").toLowerCase();
        const ln = (o?.user?.lastName || "").toLowerCase();
        return id.includes(term) || email.includes(term) || fn.includes(term) || ln.includes(term);
      });
    }

    // Status filter (ALL)
    if (statusFilter !== "ALL") {
      list = list.filter((o) => (o.status || "PLACED") === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "ALL") {
      list = list.filter((o) => o.paymentMethod === paymentFilter);
    }

    // Paid filter
    if (paidFilter !== "ALL") {
      list = list.filter((o) => (paidFilter === "PAID" ? !!o.isPaid : !o.isPaid));
    }

    // Sorting
    list.sort((a, b) => {
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      if (sortBy === "NEWEST") return bCreated - aCreated;
      if (sortBy === "OLDEST") return aCreated - bCreated;
      if (sortBy === "TOTAL_HIGH") return (b.total || 0) - (a.total || 0);
      if (sortBy === "TOTAL_LOW") return (a.total || 0) - (b.total || 0);
      return 0;
    });

    return list;
  }, [orders, q, statusFilter, paymentFilter, paidFilter, sortBy]);

  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter((o) => o.isPaid).length;
    const unpaid = total - paid;
    return { total, paid, unpaid };
  }, [orders]);

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>Admin — Orders</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.75 }}>
            Total: <b>{stats.total}</b> • Paid: <b>{stats.paid}</b> • Unpaid: <b>{stats.unpaid}</b>
          </div>
        </div>

        <button type="button" onClick={loadOrders} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div
        style={{
          marginTop: "14px",
          display: "grid",
          gridTemplateColumns: "1.4fr 0.8fr 0.8fr 0.8fr 0.8fr",
          gap: "10px",
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: Order ID / email / name..."
          style={inputStyle}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="ALL">All Status</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} style={selectStyle}>
          {PAYMENT_METHODS.map((p) => (
            <option key={p} value={p}>
              {p === "ALL" ? "All Payments" : p}
            </option>
          ))}
        </select>

        <select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)} style={selectStyle}>
          {PAID_FILTERS.map((p) => (
            <option key={p} value={p}>
              {p === "ALL" ? "All Paid" : p}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="NEWEST">Sort: Newest</option>
          <option value="OLDEST">Sort: Oldest</option>
          <option value="TOTAL_HIGH">Sort: Total High</option>
          <option value="TOTAL_LOW">Sort: Total Low</option>
        </select>
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading orders...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Table */}
      {!loading && !error && (
        <div style={{ marginTop: "10px", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1100px",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
            }}
          >
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={th}>Order</th>
                <th style={th}>User</th>
                <th style={th}>Total</th>
                <th style={th}>Payment</th>
                <th style={th}>Paid?</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
                <th style={th}>Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredSorted.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "14px" }}>
                    No matching orders.
                  </td>
                </tr>
              ) : (
                filteredSorted.map((o) => {
                  const isBusy = !!saving[o._id];

                  const effectiveCurrent = getEffectiveCurrent(o);
                  const allowedNext = getAllowedNextStatuses(o);

                  // ✅ draft defaults:
                  // If current is PAID but stored status is PLACED, draft shown as PLACED (what DB has).
                  // We allow selection only from allowedNext anyway.
                  const draft = statusDraft[o._id] || o.status || "PLACED";

                  const isDraftValid = allowedNext.includes(draft);
                  const canUpdate = !isBusy && isDraftValid;

                  const canMarkPaid =
                    o.paymentMethod === "COD" && (o.paymentStatus !== "PAID" || !o.isPaid);

                  return (
                    <tr key={o._id} style={{ borderTop: "1px solid #E5E7EB" }}>
                      <td style={tdMono}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span title={o._id}>{o._id}</span>
                          <button type="button" onClick={() => copyText(o._id)} style={miniBtn} title="Copy Order ID">
                            Copy
                          </button>
                        </div>
                        <div style={{ marginTop: "4px", fontSize: "11px", opacity: 0.7 }}>
                          Flow: <b>{effectiveCurrent}</b> → {allowedNext.length ? allowedNext.join(" / ") : "—"}
                        </div>
                      </td>

                      <td style={td}>
                        {o?.user?.firstName} {o?.user?.lastName}
                        <div style={{ fontSize: "12px", opacity: 0.75 }}>{o?.user?.email}</div>
                      </td>

                      <td style={td}>{o.total}</td>
                      <td style={td}>{o.paymentMethod}</td>
                      <td style={td}>{o.isPaid ? "YES" : "NO"}</td>

                      <td style={td}>
                        <select
                          value={draft}
                          disabled={isBusy || allowedNext.length === 0}
                          onChange={(e) => onChangeDraft(o._id, e.target.value)}
                          style={{
                            ...selectStyle,
                            height: "36px",
                            cursor: isBusy ? "not-allowed" : allowedNext.length ? "pointer" : "not-allowed",
                            opacity: allowedNext.length ? 1 : 0.6,
                          }}
                        >
                          {/* If no next status, show current */}
                          {allowedNext.length === 0 ? (
                            <option value={o.status || "PLACED"}>{o.status || "PLACED"}</option>
                          ) : (
                            <>
                              <option value="" disabled>
                                Select next...
                              </option>
                              {allowedNext.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      </td>

                      <td style={td}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button type="button" onClick={() => setOpenOrder(o)} style={ghostBtn}>
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(o._id)}
                            disabled={!canUpdate}
                            style={{
                              ...darkBtn,
                              opacity: canUpdate ? 1 : 0.55,
                              cursor: canUpdate ? "pointer" : "not-allowed",
                            }}
                            title={
                              allowedNext.length === 0
                                ? "No next status allowed"
                                : !draft
                                ? "Select next status"
                                : !isDraftValid
                                ? "Invalid next status"
                                : "Update status"
                            }
                          >
                            {isBusy ? "Saving..." : "Update"}
                          </button>

                          {canMarkPaid && (
                            <button
                              type="button"
                              onClick={() => markCodPaid(o._id)}
                              disabled={isBusy}
                              style={{
                                ...ghostBtn,
                                opacity: isBusy ? 0.6 : 1,
                                cursor: isBusy ? "not-allowed" : "pointer",
                              }}
                            >
                              Mark COD Paid
                            </button>
                          )}
                        </div>
                      </td>

                      <td style={tdSmall}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {openOrder && (
        <div
          onClick={() => setOpenOrder(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(820px, 100%)",
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>Order Details</div>
                <div style={{ fontFamily: "monospace", fontSize: "12px", opacity: 0.8 }}>
                  {openOrder._id}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" style={miniBtn} onClick={() => copyText(openOrder._id)}>
                  Copy ID
                </button>
                <button type="button" style={ghostBtn} onClick={() => setOpenOrder(null)}>
                  Close
                </button>
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Info label="User" value={`${openOrder?.user?.firstName || ""} ${openOrder?.user?.lastName || ""}`} />
                <Info label="Email" value={openOrder?.user?.email || "-"} />
                <Info label="Payment" value={`${openOrder.paymentMethod} • ${openOrder.isPaid ? "PAID" : "UNPAID"}`} />
                <Info label="Status" value={openOrder.status || "PLACED"} />
                <Info label="Subtotal" value={openOrder.subtotal} />
                <Info label="Total" value={openOrder.total} />
              </div>

              <div style={{ marginTop: "14px", fontWeight: 800 }}>Items</div>
              <div style={{ marginTop: "8px", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
                {(openOrder.items || []).length === 0 ? (
                  <div style={{ padding: "12px" }}>No items</div>
                ) : (
                  (openOrder.items || []).map((it, idx) => (
                    <div
                      key={`${it.product}-${idx}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.6fr 0.6fr 0.6fr 0.6fr",
                        gap: "10px",
                        padding: "10px 12px",
                        borderTop: idx === 0 ? "none" : "1px solid #E5E7EB",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{it.name}</div>
                      <div>Qty: {it.qty}</div>
                      <div>Price: {it.price}</div>
                      <div>Total: {it.price * it.qty}</div>
                    </div>
                  ))
                )}
              </div>

              {openOrder.stripeSessionId && (
                <div style={{ marginTop: "12px", fontSize: "12px", opacity: 0.75 }}>
                  Stripe Session:{" "}
                  <span style={{ fontFamily: "monospace" }}>{openOrder.stripeSessionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "10px 12px", background: "#fff" }}>
    <div style={{ fontSize: "12px", opacity: 0.7 }}>{label}</div>
    <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "2px" }}>{value ?? "-"}</div>
  </div>
);

const inputStyle = {
  height: "40px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  padding: "0 12px",
  outline: "none",
};

const selectStyle = {
  height: "40px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  padding: "0 10px",
  background: "#fff",
  outline: "none",
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
  verticalAlign: "top",
  maxWidth: "340px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const miniBtn = {
  padding: "6px 10px",
  borderRadius: "999px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontSize: "12px",
};

const ghostBtn = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
};

const darkBtn = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
};

const refreshBtn = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  height: "40px",
};

export default AdminOrdersPage;
