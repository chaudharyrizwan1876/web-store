// ====================== frontend-vite/src/components/DealsAndOffers.jsx (UPDATED: add id) ======================
// ✅ Only change: wrapper div me id="deals-section" add kar do
// Tumhare current updated DealsAndOffers file me return ke andar first div aisa karo:

// BEFORE:
// <div style={styles.wrapper}>

// AFTER:
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

// ✅ fallback images
import watchImg from "../assets/images/watch.png";
import laptopImg from "../assets/images/laptop.png";
import cameraImg from "../assets/images/camera.png";
import headphoneImg from "../assets/images/headphone.png";
import mobileImg from "../assets/images/mobile.png";

const FALLBACK_IMAGES = [watchImg, laptopImg, cameraImg, headphoneImg, mobileImg];

const DealsAndOffers = () => {
  const [dealTitle, setDealTitle] = useState("Deals and offers");
  const [dealSubtitle, setDealSubtitle] = useState("Hygiene equipments");
  const [dealCategory, setDealCategory] = useState("Electronics");

  const [endsAt, setEndsAt] = useState(() => {
    const saved = localStorage.getItem("active_deal_end_at");
    if (saved) {
      const d = new Date(saved);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    return new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString();
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDealConfigIfExists = async () => {
      try {
        const data = await apiFetch("/api/deals/active");
        if (!mounted || !data) return;

        if (data.title) setDealTitle(String(data.title));
        if (data.subtitle) setDealSubtitle(String(data.subtitle));
        if (data.category) setDealCategory(String(data.category));

        if (data.endsAt) {
          const d = new Date(data.endsAt);
          if (!isNaN(d.getTime())) {
            setEndsAt(d.toISOString());
            localStorage.setItem("active_deal_end_at", d.toISOString());
          }
        }
      } catch (e) {}
    };

    loadDealConfigIfExists();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await apiFetch(`/api/products?category=${encodeURIComponent(dealCategory)}`);
        const list = Array.isArray(data?.products) ? data.products : [];

        const top5 = list.slice(0, 5).map((p, idx) => ({
          _id: p._id,
          name: p.name,
          image: p.images && p.images[0] ? p.images[0] : FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
          discountLabel: ["-25%", "-15%", "-40%", "-25%", "-25%"][idx] || "-10%",
        }));

        if (mounted) setItems(top5);
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      mounted = false;
    };
  }, [dealCategory]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeLeft = useMemo(() => {
    const endMs = new Date(endsAt).getTime();
    const diff = Math.max(0, endMs - now);

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / (24 * 3600));
    const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad2 = (n) => String(n).padStart(2, "0");

    return {
      isOver: diff <= 0,
      days: pad2(days),
      hours: pad2(hours),
      mins: pad2(mins),
      secs: pad2(secs),
    };
  }, [endsAt, now]);

  const styles = {
    wrapper: {
      width: "100%",
      maxWidth: "1180px",
      height: "240px",
      margin: "20px auto 0",
      padding: "20px",
      background: "#fff",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    leftBox: {
      width: "220px",
      borderRight: "1px solid #e5e7eb",
      paddingRight: "20px",
      boxSizing: "border-box",
    },
    headingLink: { textDecoration: "none", color: "inherit", display: "inline-block" },
    heading: { fontSize: "18px", fontWeight: "600", margin: "0 0 4px 0", cursor: "pointer" },
    subHeading: { fontSize: "14px", color: "#6b7280", margin: "0 0 12px 0" },
    timerRow: { display: "flex", gap: "6px" },
    timerBox: {
      background: timeLeft.isOver ? "#9CA3AF" : "#4b5563",
      color: "#fff",
      padding: "6px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      textAlign: "center",
      minWidth: "44px",
      boxSizing: "border-box",
    },
    productsRow: {
      display: "flex",
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
      paddingLeft: "20px",
      boxSizing: "border-box",
    },
    productCardLink: { textDecoration: "none", color: "inherit", display: "block" },
    productCard: { textAlign: "center", width: "120px", cursor: "pointer" },
    productImage: {
      width: "80px",
      height: "80px",
      objectFit: "contain",
      marginBottom: "8px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
    productTitle: {
      fontSize: "14px",
      marginBottom: "6px",
      color: "#111",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    discount: {
      display: "inline-block",
      background: "#fee2e2",
      color: "#dc2626",
      fontSize: "12px",
      padding: "4px 10px",
      borderRadius: "999px",
      fontWeight: "600",
    },
    emptyText: { fontSize: 14, color: "#6b7280" },
  };

  return (
    <div id="deals-section" style={styles.wrapper}>
      {/* LEFT SIDE */}
      <div style={styles.leftBox}>
        <Link to={`/products?category=${encodeURIComponent(dealCategory)}`} style={styles.headingLink}>
          <h3 style={styles.heading}>{dealTitle}</h3>
        </Link>

        <p style={styles.subHeading}>
          {dealSubtitle} {timeLeft.isOver ? "— Deal ended" : ""}
        </p>

        <div style={styles.timerRow}>
          <div style={styles.timerBox}>
            <b>{timeLeft.days}</b>
            <div>Days</div>
          </div>
          <div style={styles.timerBox}>
            <b>{timeLeft.hours}</b>
            <div>Hour</div>
          </div>
          <div style={styles.timerBox}>
            <b>{timeLeft.mins}</b>
            <div>Min</div>
          </div>
          <div style={styles.timerBox}>
            <b>{timeLeft.secs}</b>
            <div>Sec</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PRODUCTS */}
      <div style={styles.productsRow}>
        {loading ? (
          <div style={styles.emptyText}>Loading deals...</div>
        ) : items.length === 0 ? (
          <div style={styles.emptyText}>No deal products found in “{dealCategory}”.</div>
        ) : (
          items.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} style={styles.productCardLink}>
              <div style={styles.productCard}>
                <img src={p.image} alt={p.name} style={styles.productImage} />
                <div style={styles.productTitle} title={p.name}>
                  {p.name}
                </div>
                <span style={styles.discount}>{p.discountLabel}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default DealsAndOffers;
