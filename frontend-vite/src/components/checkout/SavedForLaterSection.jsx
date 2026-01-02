import React from "react";

import sflTablet from "../../assets/images/e-smartphone.png";
import sflPhone from "../../assets/images/grid_phone_blue.png";
import sflWatch from "../../assets/images/grid_watch.png";
import sflLaptop from "../../assets/images/laptop.png";

const SavedForLaterSection = () => {
  const items = [
    { id: 1, price: "$99.50", title: "GoPro HERO6 4K Action Camera - Black", img: sflTablet },
    { id: 2, price: "$99.50", title: "GoPro HERO6 4K Action Camera - Black", img: sflPhone },
    { id: 3, price: "$99.50", title: "GoPro HERO6 4K Action Camera - Black", img: sflWatch },
    { id: 4, price: "$99.50", title: "GoPro HERO6 4K Action Camera - Black", img: sflLaptop },
  ];

  return (
    <div
      style={{
        width: "1180px",        // ✅ Figma outer box
        height: "475px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
        boxSizing: "border-box",
        padding: "16px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "14px" }}>
        Saved for later
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {items.map((p) => (
          <div
            key={p.id}
            style={{
              width: "270px",      // ✅ Figma inner card
              height: "382px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              boxSizing: "border-box",
              padding: "14px",
              background: "#fff",
            }}
          >
            {/* image box */}
            <div
              style={{
                width: "100%",
                height: "210px",
                borderRadius: "8px",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={p.img}
                alt={p.title}
                style={{ width: "200px", height: "200px", objectFit: "contain" }}
              />
            </div>

            {/* price */}
            <div style={{ marginTop: "12px", fontSize: "13px", fontWeight: 800, color: "#111827" }}>
              {p.price}
            </div>

            {/* title */}
            <div style={{ marginTop: "6px", fontSize: "11px", color: "#6B7280", lineHeight: "15px" }}>
              {p.title}
            </div>

            {/* button */}
            <button
              style={{
                marginTop: "14px",
                height: "30px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #BFDBFE",
                background: "#fff",
                color: "#2563EB",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🛒 Move to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedForLaterSection;
