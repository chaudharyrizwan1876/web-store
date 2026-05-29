import React, { useState } from "react";
import { apiFetch } from "../utils/api";
import supplierBg from "../assets/images/supplier-bg.png";

const SupplierInquirySection = () => {
  const [form, setForm] = useState({
    item: "",
    details: "",
    quantity: "",
    unit: "Pcs",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const styles = {
    wrapper: {
      width: "100%",
      maxWidth: "1180px",        // ✅ Figma width
      height: "420px",           // ✅ Figma height
      margin: "20px auto 0",     // ✅ center (left=130) + top spacing
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #e5e7eb", // ✅ Figma border
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "28px",
      boxSizing: "border-box",

      backgroundImage: `linear-gradient(
        90deg,
        rgba(29, 110, 255, 0.92),
        rgba(90, 210, 210, 0.55)
      ), url(${supplierBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    left: {
      maxWidth: "430px",
      color: "#fff",
    },

    title: {
      fontSize: "34px",
      fontWeight: "800",
      margin: "0 0 10px 0",
      lineHeight: "1.15",
    },

    desc: {
      fontSize: "14px",
      opacity: 0.9,
      margin: 0,
      maxWidth: "360px",
      lineHeight: "1.6",
    },

    card: {
      width: "440px",
      background: "#fff",
      borderRadius: "8px",
      padding: "18px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      boxSizing: "border-box",
    },

    cardTitle: {
      fontSize: "18px",
      fontWeight: "700",
      margin: "0 0 14px 0",
      color: "#111",
    },

    input: {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "14px",
      marginBottom: "12px",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "14px",
      marginBottom: "12px",
      minHeight: "90px",
      resize: "none",
      boxSizing: "border-box",
    },

    row: {
      display: "flex",
      gap: "10px",
      marginBottom: "14px",
    },

    qtyInput: {
      flex: 1,
      padding: "11px 12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "14px",
      boxSizing: "border-box",
    },

    select: {
      width: "120px",
      padding: "11px 12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "14px",
      background: "#fff",
      cursor: "pointer",
      boxSizing: "border-box",
    },

    btn: {
      background: "#0d6efd",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "14px",
    },
  };

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSendInquiry = async () => {
    if (!form.item.trim()) {
      setMessage("Please enter what item you need");
      return;
    }
    if (!form.quantity.trim()) {
      setMessage("Please enter quantity");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await apiFetch("/api/supplier-inquiry", {
        method: "POST",
        body: {
          item: form.item.trim(),
          details: form.details.trim(),
          quantity: form.quantity.trim(),
          unit: form.unit,
        },
      });

      if (res?.success) {
        setMessage("✅ Inquiry sent successfully!");
        setForm({ item: "", details: "", quantity: "", unit: "Pcs" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res?.error || "Failed to send inquiry");
      }
    } catch (err) {
      setMessage(err?.message || "Error sending inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT TEXT */}
      <div style={styles.left}>
        <h2 style={styles.title}>
          An easy way to send
          <br />
          requests to all suppliers
        </h2>
        <p style={styles.desc}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt.
        </p>
      </div>

      {/* RIGHT FORM CARD */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Send quote to suppliers</h3>

        <input
          style={styles.input}
          type="text"
          placeholder="What item you need?"
          value={form.item}
          onChange={(e) => onChange("item", e.target.value)}
          disabled={loading}
        />
        <textarea
          style={styles.textarea}
          placeholder="Type more details"
          value={form.details}
          onChange={(e) => onChange("details", e.target.value)}
          disabled={loading}
        />

        <div style={styles.row}>
          <input
            style={styles.qtyInput}
            type="text"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => onChange("quantity", e.target.value)}
            disabled={loading}
          />
          <select
            style={styles.select}
            value={form.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            disabled={loading}
          >
            <option>Pcs</option>
            <option>Kg</option>
            <option>Box</option>
            <option>Pack</option>
          </select>
        </div>

        <button
          onClick={handleSendInquiry}
          disabled={loading}
          style={{
            ...styles.btn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send inquiry"}
        </button>

        {message && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              color: message.includes("✅") ? "#16A34A" : "#DC2626",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierInquirySection;
