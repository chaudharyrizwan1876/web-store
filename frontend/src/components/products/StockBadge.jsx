import React from "react";

// stock: number | null (null matlab stock field track nahi ho rahi — badge mat dikhao)
// threshold: kitni quantity se neeche "Low Stock" maana jaye
const StockBadge = ({ stock, threshold = 5, style = {} }) => {
  if (stock === null || stock === undefined) return null;

  if (stock <= 0) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 8px",
          borderRadius: "999px",
          background: "#FEF2F2",
          color: "#B91C1C",
          border: "1px solid #FCA5A5",
          fontSize: "10.5px",
          fontWeight: 800,
          whiteSpace: "nowrap",
          ...style,
        }}
      >
        Out of Stock
      </span>
    );
  }

  if (stock <= threshold) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 8px",
          borderRadius: "999px",
          background: "#FFFBEB",
          color: "#B45309",
          border: "1px solid #FDE68A",
          fontSize: "10.5px",
          fontWeight: 800,
          whiteSpace: "nowrap",
          ...style,
        }}
      >
        Only {stock} left
      </span>
    );
  }

  return null; // Normal stock — koi badge nahi
};

export default StockBadge;
