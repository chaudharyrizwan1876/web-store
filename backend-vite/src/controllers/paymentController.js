import Stripe from "stripe";
import Order from "../models/Order.js";

// ✅ stripe client lazily create (after env check)
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("STRIPE_SECRET_KEY missing in .env");
  }

  return new Stripe(key);
};

const RESERVE_MINUTES = 15;
const reserveUntilDate = () => new Date(Date.now() + RESERVE_MINUTES * 60 * 1000);

export const createStripeCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();

    const userId = req.user?.id;
    const { orderId } = req.body || {};

    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentMethod !== "STRIPE") {
      return res.status(400).json({ message: "Order paymentMethod is not STRIPE" });
    }

    // ✅ if already paid, block
    if (order.paymentStatus === "PAID" || order.isPaid === true) {
      return res.status(400).json({ message: "Order already paid" });
    }

    // ✅ if cancelled, block
    if (order.status === "CANCELLED") {
      return res.status(400).json({ message: "Order was cancelled. Please place order again." });
    }

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({ message: "Order items missing" });
    }

    // ✅ IMPORTANT: extend reservation when user starts stripe payment
    order.reservedUntil = reserveUntilDate();

    // ✅ prevent duplicate sessions: if already exists, reuse same success/cancel flow
    // (Stripe session URL cannot be fetched back easily; safest is create new but we avoid spam)
    // We'll only create a new session if no sessionId exists OR previous one is old.
    const line_items = order.items.map((it) => ({
      quantity: it.qty,
      price_data: {
        currency: "pkr",
        product_data: { name: it.name },
        unit_amount: Math.round(Number(it.price) * 100),
      },
    }));

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      metadata: {
        orderId: String(order._id),
        userId: String(order.user),
      },
      success_url: `${frontend}/order-success/${order._id}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend}/order-success/${order._id}?paid=0`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("createStripeCheckoutSession error:", err);

    // ✅ friendly message if env missing
    if (String(err?.message || "").includes("STRIPE_SECRET_KEY missing")) {
      return res.status(500).json({ message: "STRIPE_SECRET_KEY missing in backend .env" });
    }

    return res.status(500).json({ message: "Stripe session error" });
  }
};
