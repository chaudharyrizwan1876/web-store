import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Stripe webhook needs RAW body for signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!secretKey) return res.status(500).send("STRIPE_SECRET_KEY missing");
      if (!webhookSecret) return res.status(500).send("STRIPE_WEBHOOK_SECRET missing");

      const stripe = new Stripe(secretKey);
      const sig = req.headers["stripe-signature"];

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.log("❌ Webhook signature verify failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // ✅ Payment success event (Stripe Checkout)
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const orderId = session?.metadata?.orderId;
        const sessionId = session?.id;

        if (orderId) {
          // ✅ safety: do NOT mark cancelled order as paid
          const updated = await Order.findOneAndUpdate(
            { _id: orderId, status: { $ne: "CANCELLED" } },
            {
              isPaid: true,
              paidAt: new Date(),
              paymentStatus: "PAID",
              status: "PAID",
              stripeSessionId: sessionId,

              // ✅ IMPORTANT: clear reservation when paid
              reservedUntil: null,
            },
            { new: true }
          );

          if (updated) {
            console.log("✅ Order marked PAID:", orderId);
          } else {
            console.log("⚠️ Paid webhook received but order was CANCELLED:", orderId);
          }
        }
      }

      return res.json({ received: true });
    } catch (err) {
      console.log("❌ Webhook handler error:", err.message);
      return res.status(500).send("Webhook handler error");
    }
  }
);

export default router;
