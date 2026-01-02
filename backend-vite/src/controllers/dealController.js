// ====================== backend-vite/src/controllers/dealController.js ======================
import Deal from "../models/Deal.js";

// ✅ GET /api/deals/active  (public)
export const getActiveDeal = async (req, res) => {
  try {
    const now = new Date();

    // active + not expired
    const deal = await Deal.findOne({
      isActive: true,
      endsAt: { $gt: now },
    }).sort({ createdAt: -1 });

    if (!deal) {
      return res.json({
        active: false,
        message: "No active deal",
      });
    }

    return res.json({
      active: true,
      title: deal.title || "Deals and offers",
      subtitle: deal.subtitle || "",
      category: deal.category || "",
      endsAt: deal.endsAt,
      dealId: deal._id,
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to load active deal" });
  }
};
