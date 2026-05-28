// ====================== backend-vite/src/controllers/adminDealController.js ======================
import Deal from "../models/Deal.js";

// ✅ PATCH /api/admin/deals/active  (admin only)
// Body: { title, subtitle, category, endsAt }
export const upsertActiveDeal = async (req, res) => {
  try {
    const { title = "Deals and offers", subtitle = "", category = "", endsAt } = req.body;

    if (!endsAt) {
      return res.status(400).json({ message: "endsAt is required (ISO date string)" });
    }

    const endDate = new Date(endsAt);
    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "endsAt must be a valid date" });
    }

    const now = new Date();
    if (endDate <= now) {
      return res.status(400).json({ message: "endsAt must be in the future" });
    }

    // ✅ deactivate any existing active deals
    await Deal.updateMany({ isActive: true }, { $set: { isActive: false } });

    // ✅ create new active deal
    const created = await Deal.create({
      title: String(title || "").trim() || "Deals and offers",
      subtitle: String(subtitle || "").trim(),
      category: String(category || "").trim(),
      endsAt: endDate,
      isActive: true,
    });

    return res.json({
      message: "Active deal set ✅",
      deal: {
        _id: created._id,
        title: created.title,
        subtitle: created.subtitle,
        category: created.category,
        endsAt: created.endsAt,
        isActive: created.isActive,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to set active deal" });
  }
};

// ✅ GET /api/admin/deals/active (admin only) - to view current active deal
export const getActiveDealAdmin = async (req, res) => {
  try {
    const now = new Date();
    const deal = await Deal.findOne({ isActive: true }).sort({ createdAt: -1 });

    if (!deal) {
      return res.json({ active: false, message: "No deal found" });
    }

    return res.json({
      active: deal.isActive && deal.endsAt > now,
      deal: {
        _id: deal._id,
        title: deal.title,
        subtitle: deal.subtitle,
        category: deal.category,
        endsAt: deal.endsAt,
        isActive: deal.isActive,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to load deal" });
  }
};
