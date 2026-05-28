import React, { useState, useMemo, useRef } from "react";

const Divider = () => (
  <div style={{ height: "1px", background: "#E5E7EB", margin: "10px 0" }} />
);

// Modal component for showing all categories/brands
const FilterModal = ({ title, items, selectedItems, onToggle, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
          maxWidth: "400px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#111827" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "#6B7280",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
          {items.map((item) => (
            <label
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 0",
                cursor: "pointer",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => onToggle(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

const FiltersSidebar = ({
  selectedCategories = [],
  setSelectedCategories = () => {},
  selectedBrands = [],
  setSelectedBrands = () => {},
  selectedFeatures = [],
  setSelectedFeatures = () => {},
  priceRange = { min: 0, max: 1000000 },
  setPriceRange = () => {},
  selectedCondition = "Any",
  setSelectedCondition = () => {},
  selectedRatings = [],
  setSelectedRatings = () => {},
  allProducts = [],
}) => {
  const MAX_PRICE = 1000000; // 10 lakhs

  const [open, setOpen] = useState({
    category: true,
    brands: true,
    price: true,
    condition: true,
    rating: true,
  });

  const [tempPrice, setTempPrice] = useState(priceRange);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandsModal, setShowBrandsModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const priceBarRef = useRef(null);

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  // Extract unique categories from products
  const allCategories = useMemo(() => {
    const cats = new Set();
    (allProducts || []).forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [allProducts]);

  // Fixed brands list
  const fixedBrands = ["Samsung", "Apple", "Cannon", "Lenovo", "Oppo", "Dell"];

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) => {
      if (prev.includes(rating)) {
        return prev.filter((r) => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };

  const handlePriceApply = () => {
    setPriceRange(tempPrice);
  };

  const handlePriceSliderDrag = (e) => {
    if (!priceBarRef.current) return;

    const rect = priceBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newPrice = Math.round((percentage / 100) * MAX_PRICE);

    setTempPrice((prev) => ({
      ...prev,
      max: newPrice,
    }));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      handlePriceSliderDrag(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const sectionTitleStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#111827",
  };

  return (
    <>
      <div
        style={{
          width: "240px",
          height: "1448px",
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
                {allCategories.slice(0, 4).map((category) => (
                  <label
                    key={category}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "5px 0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
                {allCategories.length > 4 && (
                  <div
                    onClick={() => setShowCategoryModal(true)}
                    style={{ padding: "6px 0", color: "#2563EB", cursor: "pointer" }}
                  >
                    See all ({allCategories.length})
                  </div>
                )}
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
                {fixedBrands.slice(0, 5).map((brand) => (
                  <label
                    key={brand}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "5px 0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
                {fixedBrands.length > 5 && (
                  <div
                    onClick={() => setShowBrandsModal(true)}
                    style={{ padding: "6px 0", color: "#2563EB", cursor: "pointer" }}
                  >
                    See all ({fixedBrands.length})
                  </div>
                )}
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
                {/* Draggable price slider */}
                <div
                  ref={priceBarRef}
                  style={{
                    position: "relative",
                    height: "4px",
                    background: "#E5E7EB",
                    borderRadius: "999px",
                    cursor: "pointer",
                    marginBottom: "8px",
                  }}
                >
                  {/* Blue progress */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: `${Math.min(100, (tempPrice.max / MAX_PRICE) * 100)}%`,
                      height: "100%",
                      background: "#3B82F6",
                      borderRadius: "999px",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Draggable circle */}
                  <div
                    onMouseDown={handleMouseDown}
                    style={{
                      position: "absolute",
                      left: `${Math.min(100, (tempPrice.max / MAX_PRICE) * 100)}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "16px",
                      height: "16px",
                      background: "#3B82F6",
                      borderRadius: "50%",
                      cursor: isDragging ? "grabbing" : "grab",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: isDragging ? "none" : "background 0.2s",
                      userSelect: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>Min</div>
                    <input
                      placeholder="0"
                      type="number"
                      value={tempPrice.min}
                      onChange={(e) =>
                        setTempPrice((prev) => ({
                          ...prev,
                          min: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
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
                      placeholder="1000000"
                      type="number"
                      value={tempPrice.max}
                      onChange={(e) =>
                        setTempPrice((prev) => ({
                          ...prev,
                          max: Math.min(MAX_PRICE, Math.max(0, Number(e.target.value) || MAX_PRICE)),
                        }))
                      }
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
                  onClick={handlePriceApply}
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
                {["Any", "Refurbished", "Brand new", "Old items"].map((condition) => (
                  <label
                    key={condition}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "5px 0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === condition}
                      onChange={() => setSelectedCondition(condition)}
                    />
                    <span>{condition}</span>
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
                  <label
                    key={r}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6px 0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(r)}
                      onChange={() => handleRatingToggle(r)}
                    />
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

      {/* Modals */}
      <FilterModal
        title="All Categories"
        items={allCategories}
        selectedItems={selectedCategories}
        onToggle={handleCategoryToggle}
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />

      <FilterModal
        title="All Brands"
        items={fixedBrands}
        selectedItems={selectedBrands}
        onToggle={handleBrandToggle}
        isOpen={showBrandsModal}
        onClose={() => setShowBrandsModal(false)}
      />
    </>
  );
};

export default FiltersSidebar;
