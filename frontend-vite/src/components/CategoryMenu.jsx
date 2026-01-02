import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const CategoryMenu = () => {
  const location = useLocation();

  const categories = [
    "Automobiles",
    "Clothes and wear",
    "Home interiors",
    "Computer and tech",
    "Tools, equipments",
    "Sports and outdoor",
    "Animal and pets",
    "Machinery tools",
    "More category",
  ];

  // ✅ read active category from URL: /products?category=...
  const activeCategory = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return (sp.get("category") || "").trim();
  }, [location.search]);

  const styles = {
    menu: {
      width: "230px",
      height: "400px", // ✅ match Hero height
      background: "#fff",
      padding: "10px 0",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
    },
    item: {
      padding: "10px 18px",
      fontSize: "14px",
      cursor: "pointer",
      color: "#333",
      textDecoration: "none",
      display: "block",
    },
    active: {
      background: "#e8f0fe",
      color: "#2b64f1",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.menu}>
      {categories.map((item) => {
        const isActive = activeCategory.toLowerCase() === item.toLowerCase();

        return (
          <Link
            key={item}
            to={`/products?category=${encodeURIComponent(item)}`}
            style={{
              ...styles.item,
              ...(isActive ? styles.active : {}),
            }}
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryMenu;
