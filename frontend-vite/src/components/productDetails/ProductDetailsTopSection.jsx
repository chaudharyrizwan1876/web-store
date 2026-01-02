import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";

// Fallback images (UI break na ho)
import mainImg from "../../assets/images/pd_main_tshirt.jpg";
import t1 from "../../assets/images/pd_thumb_1.jpg";
import t2 from "../../assets/images/pd_thumb_2.jpg";
import t3 from "../../assets/images/pd_thumb_3.jpg";
import t4 from "../../assets/images/pd_thumb_4.jpg";
import t5 from "../../assets/images/pd_thumb_5.jpg";
import t6 from "../../assets/images/pd_thumb_6.jpg";

const ProductDetailsTopSection = ({ product }) => {
  const fallbackThumbs = useMemo(() => [t1, t2, t3, t4, t5, t6], []);

  const productImages = useMemo(() => {
    const imgs = product?.images || [];
    return Array.isArray(imgs) ? imgs.filter(Boolean) : [];
  }, [product]);

  const thumbs = productImages.length > 0 ? productImages : fallbackThumbs;

  const defaultMain = productImages.length > 0 ? productImages[0] : mainImg;
  const [active, setActive] = useState(defaultMain);

  // ✅ qty
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActive(defaultMain);

    // ✅ when product changes, reset qty properly (stock based)
    const stockNum = Number(product?.stock);
    if (Number.isFinite(stockNum) && stockNum <= 0) setQty(0);
    else setQty(1);
  }, [defaultMain, product]);

  const title = product?.name || "Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle";
  const rating = typeof product?.rating === "number" ? product.rating : 9.3;
  const reviews = typeof product?.numReviews === "number" ? product.numReviews : 32;
  const sold = typeof product?.sold === "number" ? product.sold : 154;

  const stockNum = Number(product?.stock);
  const hasStockField = Number.isFinite(stockNum);
  const availableStock = hasStockField ? Math.max(0, stockNum) : 999999;

  const inStock = hasStockField ? availableStock > 0 : true;

  const mainPrice = typeof product?.price === "number" ? product.price : 98;

  const priceTiers = useMemo(() => {
    const p1 = mainPrice;
    const p2 = Math.max(0, Math.round(mainPrice * 0.92));
    const p3 = Math.max(0, Math.round(mainPrice * 0.80));

    return [
      { price: `$${p1}.00`, qty: "50-100 pcs" },
      { price: `$${p2}.00`, qty: "100-700 pcs" },
      { price: `$${p3}.00`, qty: "700+ pcs" },
    ];
  }, [mainPrice]);

  const detailsRows = useMemo(() => {
    const category = product?.category || "Classic shoes";
    const desc = product?.description || "Negotiable";

    return [
      { k: "Price:", v: "Negotiable" },
      { k: "Type:", v: category },
      { k: "Material:", v: "Plastic material" },
      { k: "Design:", v: "Modern nice" },
      { k: "Customization:", v: "Customized logo and design custom packages" },
      { k: "Protection:", v: "Refund Policy" },
      { k: "Warranty:", v: "2 years full warranty" },
    ].map((row) => {
      if (row.k === "Price:") return { ...row, v: desc ? "Negotiable" : "Negotiable" };
      return row;
    });
  }, [product]);

  const starCount = useMemo(() => {
    const r = typeof product?.rating === "number" ? product.rating : 4.6;
    const clamped = Math.max(0, Math.min(5, r));
    const full = Math.round(clamped);
    return "★★★★★".slice(0, full).padEnd(5, "☆");
  }, [product]);

  const canMinus = qty > (inStock ? 1 : 0);
  const canPlus = inStock ? qty < availableStock : false;

  // ✅ Add to cart (qty FIX + stock safe)
  const handleAddToCart = async () => {
    try {
      if (!product?._id) {
        alert("Product load nahi hua abhi.");
        return;
      }

      if (!inStock || qty < 1) {
        alert(
          `${title} is out of stock.\n\nPlease visit tomorrow. New stock will be updated soon.`
        );
        return;
      }

      await apiFetch("/api/cart", {
        method: "POST",
        body: {
          productId: product._id,
          qty, // ✅ FIX: backend expects qty (NOT quantity)
        },
      });

      alert("✅ Added to cart!");
    } catch (err) {
      // backend already sends friendly out-of-stock msg in cart controller
      alert(err?.message || "❌ Something went wrong");
    }
  };

  return (
    <div
      style={{
        width: "1180px",
        height: "580px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#FFFFFF",
        boxSizing: "border-box",
        padding: "18px",
        display: "flex",
        gap: "22px",
      }}
    >
      {/* LEFT IMAGE BOX */}
      <div style={{ width: "380px" }}>
        <div
          style={{
            width: "380px",
            height: "380px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            boxSizing: "border-box",
          }}
        >
          <img src={active} alt={title} style={{ width: "320px", height: "320px", objectFit: "contain" }} />
        </div>

        {/* thumbnails row */}
        <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {thumbs.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={() => setActive(img)}
              style={{
                width: "56px",
                height: "56px",
                border: active === img ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                borderRadius: "8px",
                background: "#fff",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <img src={img} alt={`thumb-${idx + 1}`} style={{ width: "44px", height: "44px", objectFit: "contain" }} />
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE DETAILS BOX */}
      <div style={{ width: "430px", height: "514px", boxSizing: "border-box" }}>
        {/* In stock */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ color: inStock ? "#16A34A" : "#DC2626", fontSize: "14px", fontWeight: 700 }}>
            {inStock ? "✓" : "✕"}
          </span>
          <span style={{ color: inStock ? "#16A34A" : "#DC2626", fontSize: "13px", fontWeight: 600 }}>
            {inStock ? "In stock" : "Out of stock"}
          </span>

          {hasStockField && (
            <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6B7280" }}>
              Available: {availableStock}
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", lineHeight: "24px" }}>{title}</div>

        {/* rating row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <span style={{ color: "#F59E0B", letterSpacing: "1px" }}>{starCount}</span>
          <span style={{ fontSize: "13px", color: "#F97316", fontWeight: 700 }}>
            {typeof product?.rating === "number" ? product.rating.toFixed(1) : rating}
          </span>

          <span style={{ width: "4px", height: "4px", background: "#D1D5DB", borderRadius: "999px" }} />
          <span style={{ fontSize: "13px", color: "#6B7280" }}>{reviews} reviews</span>
          <span style={{ width: "4px", height: "4px", background: "#D1D5DB", borderRadius: "999px" }} />
          <span style={{ fontSize: "13px", color: "#6B7280" }}>{sold} sold</span>
        </div>

        {/* Price boxes row */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          {priceTiers.map((p, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                border: "1px solid #FDE68A",
                background: "#FFFBEB",
                borderRadius: "8px",
                padding: "12px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontWeight: 800, color: "#DC2626", fontSize: "14px" }}>{p.price}</div>
              <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{p.qty}</div>
            </div>
          ))}
        </div>

        {/* QTY + ADD TO CART */}
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
          <div
            style={{
              width: "110px",
              height: "40px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
              boxSizing: "border-box",
              background: "#fff",
              opacity: inStock ? 1 : 0.6,
            }}
          >
            <button
              onClick={() => setQty((p) => Math.max(inStock ? 1 : 0, p - 1))}
              disabled={!canMinus}
              style={{
                border: "none",
                background: "transparent",
                cursor: canMinus ? "pointer" : "not-allowed",
                fontSize: "18px",
                fontWeight: 700,
                opacity: canMinus ? 1 : 0.4,
              }}
            >
              −
            </button>

            <span style={{ fontSize: "14px", fontWeight: 700 }}>{inStock ? qty : 0}</span>

            <button
              onClick={() => setQty((p) => Math.min(availableStock, p + 1))}
              disabled={!canPlus}
              style={{
                border: "none",
                background: "transparent",
                cursor: canPlus ? "pointer" : "not-allowed",
                fontSize: "18px",
                fontWeight: 700,
                opacity: canPlus ? 1 : 0.4,
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{
              flex: 1,
              height: "40px",
              border: "none",
              borderRadius: "8px",
              background: inStock ? "#16A34A" : "#9CA3AF",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 800,
              cursor: inStock ? "pointer" : "not-allowed",
            }}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>

        {/* details rows */}
        <div style={{ marginTop: "18px", fontSize: "13px" }}>
          {detailsRows.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                padding: "9px 0",
                borderBottom: idx === 6 ? "none" : "1px solid #F3F4F6",
                color: "#111827",
              }}
            >
              <div style={{ color: "#6B7280" }}>{row.k}</div>
              <div style={{ fontWeight: 600 }}>{row.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SELLER BOX */}
      <div
        style={{
          width: "280px",
          height: "325px",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "14px",
          boxSizing: "border-box",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "6px",
              background: "#E0F2FE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#0284C7",
            }}
          >
            R
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#6B7280" }}>Supplier</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Guanjoi Trading LLC</div>
          </div>
        </div>

        <div style={{ marginTop: "12px", fontSize: "12px", color: "#111827" }}>
          🇩🇪 <span style={{ color: "#6B7280" }}>Germany, Berlin</span>
        </div>

        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {["Verified Seller", "Worldwide shipping"].map((t) => (
            <div key={t} style={{ fontSize: "12px", color: "#6B7280", display: "flex", gap: "8px" }}>
              <span style={{ color: "#3B82F6" }}>✔</span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <button
          style={{
            width: "100%",
            height: "36px",
            marginTop: "14px",
            border: "none",
            borderRadius: "8px",
            background: "#2563EB",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Send inquiry
        </button>

        <button
          style={{
            width: "100%",
            height: "36px",
            marginTop: "10px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            color: "#2563EB",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Seller&apos;s profile
        </button>

        <div style={{ marginTop: "14px", textAlign: "center", color: "#2563EB", fontSize: "12px" }}>
          ♡ Save for later
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsTopSection;
