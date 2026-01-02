import React from "react";

const BreadcrumbBar = () => {
  const crumbs = ["Home", "Clothings", "Men’s wear", "Summer clothing"];

  return (
    <div
      style={{
        width: "411px",
        height: "24px",
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
        lineHeight: "24px",
        color: "#8A8A8A",
        gap: "6px",
      }}
    >
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={item}>
            <span
              style={{
                cursor: isLast ? "default" : "pointer",
                color: isLast ? "#111827" : "#8A8A8A",
                fontWeight: isLast ? 500 : 400,
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
