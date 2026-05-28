import React from "react";
import { useNavigate } from "react-router-dom";

const BreadcrumbBar = ({ crumbs = [] }) => {
  const navigate = useNavigate();

  const handleClick = (item, index) => {
    // last item clickable nahi hoga
    if (index === crumbs.length - 1) return;

    if (index === 0) {
      // Home
      navigate("/");
    } else {
      // Category
      const category = crumbs[1];
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div
      style={{
        width: "auto",
        minHeight: "24px",
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
        lineHeight: "24px",
        gap: "6px",
        flexWrap: "wrap",
      }}
    >
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={index}>
            <span
              onClick={() => handleClick(item, index)}
              style={{
                cursor: isLast ? "default" : "pointer",
                color: isLast ? "#111827" : "#6B7280",
                fontWeight: isLast ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>

            {!isLast && (
              <span style={{ color: "#B0B0B0", margin: "0 4px" }}>
                {">"}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BreadcrumbBar;