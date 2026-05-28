import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch(`/api/orders/my/${id}`);
      const o = data?.order || data; // support both shapes
      setOrder(o);
    } catch (e) {
      setError(e?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const statusBadge = useMemo(() => getStatusBadge(order?.status), [order?.status]);
  const paidBadge = useMemo(() => getPaidBadge(!!order?.isPaid), [order?.isPaid]);

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

  const canPayNow =
    order &&
    order.paymentMethod === "STRIPE" &&
    !order.isPaid &&
    (order.paymentStatus === "UNPAID" || !order.paymentStatus);

  const payNow = async () => {
    try {
      setPaying(true);
      setError("");

      // create stripe session again for this order
      const res = await apiFetch("/api/payments/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id }),
      });

      const url = res?.url || res?.checkoutUrl || res?.redirectUrl;
      if (!url) {
        throw new Error("Stripe URL not received");
      }

      window.location.href = url;
    } catch (e) {
      setError(e?.message || "Failed to open Stripe checkout");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "24px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>Order Details</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.75 }}>
            Track your order status and payment here.
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={loadOrder} style={ghostBtn}>
            Refresh
          </button>
          <button type="button" onClick={() => navigate("/my-orders")} style={darkBtn}>
            My Orders
          </button>
        </div>
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading order...</p>}
        {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {!loading && !error && order && (
        <>
          {/* Summary card */}
          <div style={{ marginTop: "14px", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>Order ID</div>
                <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 900 }}>{order._id}</div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={statusBadge.style}>{statusBadge.text}</span>
                <span style={badgeStyle("#F9FAFB", "#374151")}>{order.paymentMethod || "-"}</span>
                <span style={paidBadge.style}>{paidBadge.text}</span>

                <button type="button" onClick={() => copyText(order._id)} style={miniBtn}>
                  Copy ID
                </button>
              </div>
            </div>

            <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <Info label="Subtotal" value={`Rs ${order.subtotal ?? 0}`} />
              <Info label="Shipping" value={`Rs ${order.shipping ?? 0}`} />
              <Info label="Total" value={`Rs ${order.total ?? 0}`} strong />
            </div>

            {canPayNow && (
              <div style={{ marginTop: "14px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>
                  Payment is still unpaid. You can complete it now.
                </div>
                <button type="button" onClick={payNow} disabled={paying} style={{ ...darkBtn, opacity: paying ? 0.6 : 1 }}>
                  {paying ? "Opening Stripe..." : "Pay Now"}
                </button>
              </div>
            )}
          </div>

          {/* Items */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontWeight: 900, marginBottom: "8px" }}>Items</div>

            <div style={{ border: "1px solid #E5E7EB", borderRadius: "14px", overflow: "hidden", background: "#fff" }}>
              {(order.items || []).length === 0 ? (
                <div style={{ padding: "14px" }}>No items</div>
              ) : (
                (order.items || []).map((it, idx) => (
                  <div
                    key={`${it.product}-${idx}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.6fr 0.4fr 0.5fr 0.5fr",
                      gap: "10px",
                      padding: "12px 14px",
                      borderTop: idx === 0 ? "none" : "1px solid #E5E7EB",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{it.name}</div>
                    <div>Qty: {it.qty}</div>
                    <div>Rs {it.price}</div>
                    <div style={{ fontWeight: 900 }}>Rs {it.price * it.qty}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" onClick={() => navigate("/products")} style={ghostBtn}>
                Continue Shopping
              </button>
              <button type="button" onClick={() => navigate("/my-orders")} style={darkBtn}>
                View My Orders
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Info = ({ label, value, strong }) => (
  <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "10px 12px", background: "#fff" }}>
    <div style={{ fontSize: "12px", opacity: 0.7 }}>{label}</div>
    <div style={{ fontSize: "13px", fontWeight: strong ? 900 : 800, marginTop: "2px" }}>{value}</div>
  </div>
);

const miniBtn = {
  padding: "6px 10px",
  borderRadius: "999px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 800,
};

const ghostBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 900,
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

export default OrderSuccessPage;
