// ====================== ConsumerElectronicsSection.jsx (UPDATED) ======================
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

// ✅ LEFT BANNER IMAGE
import consumerBanner from "../assets/images/consumer-banner.png";

// ✅ FALLBACK IMAGES
import smartWatch1Img from "../assets/images/e-smart-watch-1.png";
import cameraImg from "../assets/images/e-camera.png";
import headphonesImg from "../assets/images/e-headphones.png";
import smartWatch2Img from "../assets/images/e-smart-watch-2.png";
import gamingSetImg from "../assets/images/e-gaming-set.png";
import laptopPcImg from "../assets/images/e-laptop-pc.png";
import smartphoneImg from "../assets/images/e-smartphone.png";
import electricKettleImg from "../assets/images/e-electric-kettle.png";

const FALLBACKS = [
  smartWatch1Img,
  cameraImg,
  headphonesImg,
  smartWatch2Img,
  gamingSetImg,
  laptopPcImg,
  smartphoneImg,
  electricKettleImg,
];

const ConsumerElectronicsSection = () => {
  const sectionCategory = "Electronics"; // ✅ must match your DB categories

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/products?category=${encodeURIComponent(sectionCategory)}`);
        const list = Array.isArray(data?.products) ? data.products : [];

        const mapped = list.slice(0, 8).map((p, idx) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          image: p.images && p.images[0] ? p.images[0] : FALLBACKS[idx % FALLBACKS.length],
        }));

        if (mounted) setProducts(mapped);
      } catch (e) {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [sectionCategory]);

  const items = useMemo(() => products || [], [products]);

  const styles = {
    wrapper: {
      width: "100%",
      maxWidth: "1180px",
      height: "257px",
      margin: "20px auto 0",
      background: "#fff",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      display: "flex",
      boxSizing: "border-box",
    },

    /* LEFT BANNER */
    left: {
      width: "250px",
      height: "257px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundImage: `url(${consumerBanner})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      boxSizing: "border-box",
    },

    leftTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111",
      lineHeight: "1.3",
      maxWidth: "190px",
    },

    leftBtn: {
      width: "120px",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      background: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      textDecoration: "none",
      color: "#111",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },

    /* RIGHT GRID */
    right: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridAutoRows: "128px",
      boxSizing: "border-box",
    },

    cardLink: {
      textDecoration: "none",
      color: "inherit",
      display: "block",
    },

    card: {
      borderLeft: "1px solid #e5e7eb",
      borderTop: "1px solid #e5e7eb",
      padding: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      boxSizing: "border-box",
      cursor: "pointer",
    },

    cardTopRow: {
      borderTop: "none",
    },

    textBox: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: 0,
    },

    title: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#111",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    from: {
      fontSize: "12px",
      color: "#6b7280",
      margin: 0,
      lineHeight: "1.2",
    },

    img: {
      width: "70px",
      height: "70px",
      objectFit: "contain",
      flexShrink: 0,
    },

    emptyCell: {
      padding: 14,
      borderLeft: "1px solid #e5e7eb",
      borderTop: "1px solid #e5e7eb",
      boxSizing: "border-box",
      fontSize: 13,
      color: "#6b7280",
      display: "flex",
      alignItems: "center",
    },

    emptyTopRow: {
      borderTop: "none",
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT BANNER */}
      <div style={styles.left}>
        <div style={styles.leftTitle}>
          Consumer <br />
          electronics and <br />
          gadgets
        </div>

        <Link
          to={`/products?category=${encodeURIComponent(sectionCategory)}`}
          style={styles.leftBtn}
        >
          Source now
        </Link>
      </div>

      {/* RIGHT PRODUCTS GRID */}
      <div style={styles.right}>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.emptyCell,
                ...(index < 4 ? styles.emptyTopRow : {}),
              }}
            >
              Loading...
            </div>
          ))
        ) : items.length === 0 ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.emptyCell,
                ...(index < 4 ? styles.emptyTopRow : {}),
              }}
            >
              No products
            </div>
          ))
        ) : (
          items.map((item, index) => (
            <Link key={item._id} to={`/product/${item._id}`} style={styles.cardLink}>
              <div
                style={{
                  ...styles.card,
                  ...(index < 4 ? styles.cardTopRow : {}),
                }}
              >
                <div style={styles.textBox}>
                  <p style={styles.title} title={item.name}>
                    {item.name}
                  </p>
                  <p style={styles.from}>
                    From <br /> USD {item.price}
                  </p>
                </div>
                <img src={item.image} alt={item.name} style={styles.img} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsumerElectronicsSection;
