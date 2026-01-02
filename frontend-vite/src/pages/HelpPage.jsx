// ====================== frontend-vite/src/pages/HelpPage.jsx (NEW) ======================
import React from "react";

const HelpPage = () => {
  const styles = {
    wrap: { maxWidth: 980, margin: "0 auto", padding: "24px 0" },
    title: { fontSize: 26, fontWeight: 900, margin: 0 },
    sub: { marginTop: 8, fontSize: 14, opacity: 0.8, lineHeight: 1.5 },

    card: {
      marginTop: 16,
      border: "1px solid #E5E7EB",
      borderRadius: 14,
      background: "#fff",
      padding: 18,
    },

    h: { fontSize: 16, fontWeight: 900, margin: 0 },
    p: { marginTop: 10, fontSize: 14, opacity: 0.85, lineHeight: 1.6, marginBottom: 0 },
    note: { marginTop: 10, fontSize: 13, opacity: 0.75, lineHeight: 1.5, marginBottom: 0 },
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Help</h1>
      <div style={styles.sub}>
        This guide explains how to use the store as a customer: browsing products, filtering by category, adding items to
        your cart, checking out, and tracking your orders.
      </div>

      <div style={styles.card}>
        <h2 style={styles.h}>1) Finding products</h2>
        <p style={styles.p}>
          Use the Home page to explore featured sections. To see everything, click “All category” in the top menu to open
          the Products page, where all listed products are shown.
        </p>
        <p style={styles.p}>
          Categories help you narrow down products. When you choose a category, the Products page will display only items
          from that category.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h}>2) Product details</h2>
        <p style={styles.p}>
          Click any product to open its details page. You can review the price, description, and available stock. Choose
          your quantity, then add it to your cart.
        </p>
        <p style={styles.note}>
          Tip: Quantity is limited by stock so you can’t add more items than are available.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h}>3) Cart and checkout</h2>
        <p style={styles.p}>
          Open your cart to review items, update quantities, or remove products. When ready, proceed to checkout to enter
          required details and choose a payment method.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h}>4) Payment methods</h2>
        <p style={styles.p}>
          You can pay using Cash on Delivery (COD) or Stripe Checkout. COD confirms the order and you pay when the package
          arrives. Stripe Checkout takes you to a secure payment page to complete payment online.
        </p>
        <p style={styles.note}>
          After a successful Stripe payment, your order status will be marked as paid automatically.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h}>5) Orders and tracking</h2>
        <p style={styles.p}>
          After placing an order, you can view it from “My Orders”. Open an order to see its details, payment status, and
          progress.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h}>6) Common issues</h2>
        <p style={styles.p}>
          If a product is out of stock, you won’t be able to add it beyond the available quantity. If you don’t see items
          under a category, it usually means no products are currently listed in that category.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
