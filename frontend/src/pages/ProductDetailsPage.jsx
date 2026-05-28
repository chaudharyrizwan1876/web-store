import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";

import BreadcrumbBar from "../components/products/BreadcrumbBar";
import ProductDetailsTopSection from "../components/productDetails/ProductDetailsTopSection";
import ProductDetailsTabsSection from "../components/productDetails/ProductDetailsTabsSection";
import YouMayLike from "../components/productDetails/YouMayLike";
import RelatedProductsRow from "../components/productDetails/RelatedProductsRow";
import SuperDiscountBanner from "../components/productDetails/SuperDiscountBanner";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [youMayLike, setYouMayLike] = useState([]);
  const [related, setRelated] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // 1) current product
        const pRes = await apiFetch(`/api/products/${id}`);
        const current = pRes.product || null;
        setProduct(current);

        // 2) all products for suggestions
        const listRes = await apiFetch("/api/products");
        const all = listRes.products || [];

        // remove current product
        const others = all.filter((x) => x?._id !== id);

        // simple split: first 4 = youMayLike, next 6 = related
        setYouMayLike(others.slice(0, 4));
        setRelated(others.slice(4, 10));
      } catch (e) {
        setError(e.message || "Failed to load product");
        setProduct(null);
        setYouMayLike([]);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
      <BreadcrumbBar
  crumbs={
    product
      ? ["Home", product.category || "Product", product.name]
      : ["Home"]
  }
/>

      {loading && <p style={{ padding: "16px 0", margin: 0 }}>Loading product...</p>}

      {!loading && error && (
        <p style={{ padding: "16px 0", margin: 0, color: "red" }}>{error}</p>
      )}

      {!loading && !error && product && (
        <>
          <div style={{ marginTop: "20px" }}>
            <ProductDetailsTopSection product={product} />
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <ProductDetailsTabsSection product={product} />
            {/* ✅ now backend suggestions */}
            <YouMayLike items={youMayLike} />
          </div>

          <div style={{ marginTop: "20px" }}>
            {/* ✅ now backend suggestions */}
            <RelatedProductsRow items={related} />
          </div>

          <div style={{ marginTop: "18px" }}>
            <SuperDiscountBanner />
          </div>

          <div style={{ marginTop: "10px", color: "#6B7280", fontSize: "12px" }}>
            Product ID: <span style={{ color: "#111827", fontWeight: 600 }}>{id}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetailsPage;
