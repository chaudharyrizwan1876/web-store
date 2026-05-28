import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

import CartSummaryBox from "../components/checkout/CartSummaryBox";
import CouponBox from "../components/checkout/CouponBox";
import OrderSummaryBox from "../components/checkout/OrderSummaryBox";
import CheckoutInfoRow from "../components/checkout/CheckoutInfoRow";
import SavedForLaterSection from "../components/checkout/SavedForLaterSection";
import SuperDiscountBanner from "../components/productDetails/SuperDiscountBanner";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);

  // ✅ NEW: payment method state
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "STRIPE"

  const reloadCart = useCallback(async () => {
    try {
      const data = await apiFetch("/api/cart");
      setCartItems(Array.isArray(data?.cart) ? data.cart : []);
    } catch (err) {
      console.log("❌ Cart error:", err.message);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  const findCartItemNameById = (pid) => {
    const found = cartItems.find((c) => {
      const id =
        c?.productId?._id ||
        c?.productId ||
        c?.product?._id ||
        c?.product ||
        c?._id;
      return String(id) === String(pid);
    });
    return found?.name || found?.title || found?.productName || null;
  };

  // ✅ Place Order (COD OR Stripe)
  const placeOrder = async () => {
    try {
      setPlacingOrder(true);

      // 1) Create order (with selected payment method)
      const orderRes = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      });

      const orderId = orderRes?.order?._id;
      if (!orderId) {
        alert("Order created but ID missing");
        return;
      }

      // 2) If COD → go to success page
      if (paymentMethod === "COD") {
        await reloadCart();
        navigate(`/order-success/${orderId}`);
        return;
      }

      // 3) If STRIPE → create checkout session and redirect to Stripe URL
      const sessionRes = await apiFetch("/api/payments/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const url = sessionRes?.url;
      if (!url) {
        alert("Stripe session created but URL missing");
        return;
      }

      // ✅ Redirect to Stripe checkout page
      window.location.href = url;
    } catch (err) {
      // ✅ Better error messaging for stock issues
      const msg = String(err?.message || "Payment/Order failed");

      // If apiFetch sets err.message from backend {message}, we catch "Out of stock"
      if (msg.toLowerCase().includes("out of stock")) {
        const pid = err?.data?.productId; // if your apiFetch keeps response json in err.data
        const name = pid ? findCartItemNameById(pid) : null;

        if (msg.toLowerCase().includes("out of stock")) {
  const pid = err?.data?.productId;
  const name = pid ? findCartItemNameById(pid) : null;

  if (name) {
    alert(
      `${name} is out of stock.\n\nPlease visit tomorrow. New stock will be updated soon.`
    );
  } else {
    alert(
      "This product is out of stock.\n\nPlease visit tomorrow. New stock will be updated soon."
    );
  }
  return;
}

        return;
      }

      alert(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CartSummaryBox cartItems={cartItems} reloadCart={reloadCart} />
          <CheckoutInfoRow />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "35px",
          }}
        >
          <CouponBox />

          {/* ✅ NEW: Payment Method selector */}
          <div
            style={{
              width: "280px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              background: "#fff",
              padding: "14px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>
              Payment Method
            </div>

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontSize: "13px",
              }}
            >
              <input
                type="radio"
                name="pay"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery (COD)
            </label>

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontSize: "13px",
              }}
            >
              <input
                type="radio"
                name="pay"
                value="STRIPE"
                checked={paymentMethod === "STRIPE"}
                onChange={() => setPaymentMethod("STRIPE")}
              />
              Card (Stripe)
            </label>

            <div style={{ fontSize: "12px", color: "#6B7280" }}>
              Stripe select karoge to payment Stripe checkout page par hogi.
            </div>
          </div>

          <OrderSummaryBox
            cartItems={cartItems}
            onPlaceOrder={placeOrder}
            loading={placingOrder}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>

      <div style={{ marginTop: "18px" }}>
        <SavedForLaterSection />
      </div>

      <div style={{ marginTop: "18px", marginBottom: "20px" }}>
        <SuperDiscountBanner />
      </div>
    </div>
  );
};

export default CheckoutPage;
