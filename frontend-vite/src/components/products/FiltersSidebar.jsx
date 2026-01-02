import React, { useState } from "react";

const Divider = () => (
  <div style={{ height: "1px", background: "#E5E7EB", margin: "10px 0" }} />
);

const FiltersSidebar = () => {
  const [open, setOpen] = useState({
    category: true,
    brands: true,
    features: true,
    price: true,
    condition: true,
    rating: true,
  });

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const sectionTitleStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#111827",
  };

  return (
    <div
      style={{
        width: "240px",           // Figma
        height: "1448px",         // ✅ Figma height
        border: "1px solid #E5E7EB",
        borderRadius: "6px",
        background: "#FFFFFF",
        padding: "10px",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Make inner content scroll if needed, so sidebar stays exactly 1448px */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px" }}>
        {/* CATEGORY */}
        <div style={{ width: "230px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggle("category")}
          >
            <span style={sectionTitleStyle}>Category</span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{open.category ? "˄" : "˅"}</span>
          </div>

          {open.category && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#374151" }}>
              <div style={{ padding: "4px 0" }}>Mobile accessory</div>
              <div style={{ padding: "4px 0" }}>Electronics</div>
              <div style={{ padding: "4px 0" }}>Smartphones</div>
              <div style={{ padding: "4px 0" }}>Modern tech</div>
              <div style={{ padding: "6px 0", color: "#2563EB", cursor: "pointer" }}>See all</div>
            </div>
          )}
        </div>

        <Divider />

        {/* BRANDS */}
        <div style={{ width: "230px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggle("brands")}
          >
            <span style={sectionTitleStyle}>Brands</span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{open.brands ? "˄" : "˅"}</span>
          </div>

          {open.brands && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#374151" }}>
              {["Samsung", "Apple", "Huawei", "Poco", "Lenovo"].map((b) => (
                <label key={b} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0" }}>
                  <input type="checkbox" />
                  <span>{b}</span>
                </label>
              ))}
              <div style={{ padding: "6px 0", color: "#2563EB", cursor: "pointer" }}>See all</div>
            </div>
          )}
        </div>

        <Divider />

        {/* FEATURES */}
        <div style={{ width: "230px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggle("features")}
          >
            <span style={sectionTitleStyle}>Features</span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{open.features ? "˄" : "˅"}</span>
          </div>

          {open.features && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#374151" }}>
              {["Metallic", "Plastic cover", "8GB Ram", "Super power", "Large Memory"].map((f) => (
                <label key={f} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0" }}>
                  <input type="checkbox" />
                  <span>{f}</span>
                </label>
              ))}
              <div style={{ padding: "6px 0", color: "#2563EB", cursor: "pointer" }}>See all</div>
            </div>
          )}
        </div>

        <Divider />

        {/* PRICE RANGE */}
        <div style={{ width: "230px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggle("price")}
          >
            <span style={sectionTitleStyle}>Price range</span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{open.price ? "˄" : "˅"}</span>
          </div>

          {open.price && (
            <div style={{ marginTop: "10px" }}>
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "999px" }}>
                <div style={{ width: "55%", height: "100%", background: "#3B82F6", borderRadius: "999px" }} />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>Min</div>
                  <input
                    placeholder="0"
                    style={{
                      width: "100%",
                      height: "32px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      padding: "0 10px",
                      fontSize: "12px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>Max</div>
                  <input
                    placeholder="999999"
                    style={{
                      width: "100%",
                      height: "32px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      padding: "0 10px",
                      fontSize: "12px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  height: "34px",
                  marginTop: "12px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#3B82F6",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <Divider />

        {/* CONDITION */}
        <div style={{ width: "230px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggle("condition")}
          >
            <span style={sectionTitleStyle}>Condition</span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{open.condition ? "˄" : "˅"}</span>
          </div>

          {open.condition && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#374151" }}>
              {["Any", "Refurbished", "Brand new", "Old items"].map((c, idx) => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0" }}>
                  <input type="radio" name="condition" defaultChecked={idx === 0} />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* RATINGS */}
        <div style={{ width: "230px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggle("rating")}
          >
            <span style={sectionTitleStyle}>Ratings</span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{open.rating ? "˄" : "˅"}</span>
          </div>

          {open.rating && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#374151" }}>
              {[5, 4, 3, 2].map((r) => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}>
                  <input type="checkbox" />
                  <span style={{ letterSpacing: "1px" }}>
                    {"★★★★★".slice(0, r)}
                    <span style={{ color: "#D1D5DB" }}>{"★★★★★".slice(0, 5 - r)}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
