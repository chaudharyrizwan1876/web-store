import React, { useMemo } from "react";

const OrderSummaryBox = ({
  cartItems = [],
  onPlaceOrder,
  loading = false,
  paymentMethod = "COD", // ✅ new prop
}) => {
  const { subtotal, itemsCount } = useMemo(() => {
    if (!Array.isArray(cartItems)) return { subtotal: 0, itemsCount: 0 };

    let sub = 0;
    let count = 0;

    for (const x of cartItems) {
      const p = x?.product || {};
      const price = typeof p?.price === "number" ? p.price : 0;
      const qty = typeof x?.qty === "number" ? x.qty : 0;

      sub += price * qty;
      count += qty;
    }

    return { subtotal: sub, itemsCount: count };
  }, [cartItems]);

  const discount = 0;
  const tax = 0;
  const total = subtotal - discount + tax;

  const isDisabled = itemsCount === 0 || loading;

  const btnText =
    loading ? "Processing..." : paymentMethod === "STRIPE" ? "Pay with Stripe" : "Place Order";

  return (
    <div
      style={{
        width: "280px",
        height: "302px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
        boxSizing: "border-box",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {[
        {
          label: `Subtotal: (${itemsCount} items)`,
          value: `Rs ${Math.round(subtotal).toLocaleString()}`,
          color: "#111827",
        },
        {
          label: "Discount:",
          value: `- Rs ${Math.round(discount).toLocaleString()}`,
          color: "#DC2626",
        },
        {
          label: "Tax:",
          value: `+ Rs ${Math.round(tax).toLocaleString()}`,
          color: "#16A34A",
        },
      ].map((r) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#6B7280",
          }}
        >
          <span>{r.label}</span>
          <span style={{ color: r.color, fontWeight: 600 }}>{r.value}</span>
        </div>
      ))}

      <div style={{ borderTop: "1px solid #E5E7EB", margin: "6px 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        <span>Total:</span>
        <span>Rs {Math.round(total).toLocaleString()}</span>
      </div>

      <button
        style={{
          marginTop: "10px",
          height: "38px",
          borderRadius: "8px",
          border: "none",
          background: "#22C55E",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 800,
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.6 : 1,
        }}
        disabled={isDisabled}
        onClick={() => {
          if (onPlaceOrder) onPlaceOrder();
        }}
      >
        {btnText}
      </button>

      <div
        style={{
          marginTop: "6px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          fontSize: "12px",
          color: "#9CA3AF",
        }}
      >
        <span>💳</span>
        <span>Master</span>
        <span>Visa</span>
        <span>Pay</span>
      </div>
    </div>
  );
};

export default OrderSummaryBox;
