// ====================== frontend-vite/src/pages/MenuItemPage.jsx (NEW random products) ======================
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";

const MenuItemPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // ✅ reload whenever query changes (we add ts=Date.now() from TopMenu)
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/products");
        const list = Array.isArray(data?.products) ? data.products : [];

        // shuffle
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        const pick = shuffled.slice(0, 12);

        if (mounted) setProducts(pick);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [location.search]);

  const items = useMemo(() => products || [], [products]);

  const styles = {
    wrap: { maxWidth: 1180, margin: "0 auto", padding: "24px 0" },
    title: { fontSize: 22, fontWeight: 900, margin: 0 },
    sub: { marginTop: 6, fontSize: 13, opacity: 0.75 },
    grid: {
      marginTop: 16,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14,
    },
    cardLink: { textDecoration: "none", color: "inherit" },
    card: {
      border: "1px solid #E5E7EB",
      borderRadius: 14,
      background: "#fff",
      padding: 14,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    imgBox: {
      width: "100%",
      height: 160,
      borderRadius: 12,
      border: "1px solid #F3F4F6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "#fff",
    },
    img: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
    name: { fontSize: 14, fontWeight: 900, margin: 0 },
    price: { fontSize: 13, opacity: 0.8, margin: 0 },
    msg: { marginTop: 14, fontSize: 14, opacity: 0.8 },
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Menu item</h2>
      <div style={styles.sub}>Every time you open this page, you’ll see a new random selection.</div>

      {loading && <div style={styles.msg}>Loading...</div>}
      {!loading && error && <div style={{ ...styles.msg, color: "red" }}>{error}</div>}

      {!loading && !error && (
        <div style={styles.grid}>
          {items.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} style={styles.cardLink}>
              <div style={styles.card}>
                <div style={styles.imgBox}>
                  <img src={p.images?.[0] || ""} alt={p.name} style={styles.img} />
                </div>
                <p style={styles.name}>{p.name}</p>
                <p style={styles.price}>USD {p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemPage;
