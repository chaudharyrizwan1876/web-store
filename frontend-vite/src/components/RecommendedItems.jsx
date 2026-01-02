// ====================== RecommendedItems.jsx (UPDATED) ======================
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

// ✅ FALLBACK IMAGES
import shirtImg from "../assets/images/rec-shirt.png";
import jacketImg from "../assets/images/rec-jacket.jpg";
import suitImg from "../assets/images/rec-suit.png";
import walletBlueImg from "../assets/images/rec-wallet-blue.png";
import backpackImg from "../assets/images/rec-backpack.png";
import jeansImg from "../assets/images/rec-jeans.png";
import headphonesImg from "../assets/images/rec-headphones.png";
import smartwatchImg from "../assets/images/rec-smartwatch.png";
import potImg from "../assets/images/rec-pot.png";
import kettleImg from "../assets/images/rec-kettle.png";

const FALLBACKS = [
  shirtImg,
  jacketImg,
  suitImg,
  walletBlueImg,
  backpackImg,
  jeansImg,
  headphonesImg,
  smartwatchImg,
  potImg,
  kettleImg,
];

const RecommendedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        // ✅ simplest "recommended": just latest products
        const data = await apiFetch("/api/products");
        const list = Array.isArray(data?.products) ? data.products : [];

        const mapped = list.slice(0, 10).map((p, idx) => ({
          _id: p._id,
          price: `$${Number(p.price || 0).toFixed(2)}`,
          desc: p.name,
          image: p.images && p.images[0] ? p.images[0] : FALLBACKS[idx % FALLBACKS.length],
        }));

        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const viewItems = useMemo(() => items || [], [items]);

  const styles = {
    wrapper: {
      maxWidth: "1180px",
      height: "696px",
      margin: "20px auto 0",
      boxSizing: "border-box",
    },

    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111",
      margin: "0 0 14px 0",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 220px)",
      gridTemplateRows: "repeat(2, 310px)",
      gap: "16px",
    },

    cardLink: {
      textDecoration: "none",
      color: "inherit",
      display: "block",
    },

    card: {
      width: "220px",
      height: "310px",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "12px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
    },

    imgBox: {
      width: "100%",
      height: "160px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10px",
    },

    img: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    },

    price: {
      fontSize: "15px",
      fontWeight: "700",
      margin: "0 0 6px 0",
      color: "#111",
    },

    desc: {
      fontSize: "13px",
      color: "#6b7280",
      lineHeight: "1.35",
      margin: 0,
    },

    empty: {
      fontSize: 14,
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Recommended items</h2>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : viewItems.length === 0 ? (
        <div style={styles.empty}>No products found.</div>
      ) : (
        <div style={styles.grid}>
          {viewItems.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`} style={styles.cardLink}>
              <div style={styles.card}>
                <div style={styles.imgBox}>
                  <img src={item.image} alt={item.desc} style={styles.img} />
                </div>
                <p style={styles.price}>{item.price}</p>
                <p style={styles.desc}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedItems;
