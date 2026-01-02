import React from "react";

const ProductsToolbar = ({
  totalText = "12,911 items in",
  category = "Mobile accessory",
  verifiedOnly = true,
  onToggleVerified = () => {},
  sortValue = "Featured",
  onChangeSort = () => {},
  view = "grid", // grid | list
  onChangeView = () => {},
}) => {
  return (
    <div
      style={{
        width: "920px",                 // Figma width
        height: "62px",                 // Figma height
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",              // clean inner spacing
        boxSizing: "border-box",
      }}
    >
      {/* LEFT TEXT */}
      <div
        style={{
          fontSize: "14px",
          color: "#111827",
        }}
      >
        <span>{totalText} </span>
        <span style={{ fontWeight: 600 }}>{category}</span>
      </div>

      {/* RIGHT CONTROLS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* VERIFIED ONLY */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onToggleVerified(e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          Verified only
        </label>

        {/* SORT */}
        <select
          value={sortValue}
          onChange={(e) => onChangeSort(e.target.value)}
          style={{
            height: "36px",
            minWidth: "120px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "0 12px",
            fontSize: "13px",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          <option>Featured</option>
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>

        {/* GRID / LIST TOGGLE */}
        <div
          style={{
            display: "flex",
            height: "36px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* GRID */}
          <button
            onClick={() => onChangeView("grid")}
            style={{
              width: "36px",
              border: "none",
              backgroundColor: view === "grid" ? "#F3F4F6" : "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 6px)",
                gap: "3px",
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#111827",
                    borderRadius: "1px",
                  }}
                />
              ))}
            </div>
          </button>

          {/* LIST */}
          <button
            onClick={() => onChangeView("list")}
            style={{
              width: "36px",
              border: "none",
              backgroundColor: view === "list" ? "#F3F4F6" : "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#111827",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsToolbar;
