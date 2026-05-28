// ====================== frontend-vite/src/pages/ProductsPage.jsx ======================
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { resolveProductImage } from "../utils/productImages";
import { useAuth } from "../context/AuthContext";

import BreadcrumbBar from "../components/products/BreadcrumbBar";
import FiltersSidebar from "../components/products/FiltersSidebar";
import ProductsToolbar from "../components/products/ProductsToolbar";
import ProductsList from "../components/products/ProductsList";
import ProductsGrid from "../components/products/ProductsGrid";
import GridFilterBar from "../components/products/GridFilterBar";

import prodHeadphones from "../assets/images/prod_headphones.png";
import gridPhoneRed from "../assets/images/grid_phone_red.png";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  description: "",
  isActive: true,
};

const ProductsPage = () => {
  const { isAuthed, isAdmin } = useAuth();
  const location = useLocation();

  const [view, setView] = useState("list");
  const [sortValue, setSortValue] = useState("Featured");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 9;

  // ✅ FILTER STATES
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [selectedCondition, setSelectedCondition] = useState("Any");
  const [selectedRatings, setSelectedRatings] = useState([]);

  const selectedCategory = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return (sp.get("category") || "").trim();
  }, [location.search]);

  const searchText = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return (sp.get("search") || "").trim();
  }, [location.search]);

  const buildProductsUrl = useCallback(() => {
    let url = "/api/products";
    if (selectedCategory) {
      const qs = new URLSearchParams();
      qs.set("category", selectedCategory);
      url += `?${qs.toString()}`;
    }
    return url;
  }, [selectedCategory]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch(buildProductsUrl());
      setProducts(data.products || []);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [buildProductsUrl]);

  useEffect(() => {
    load();
  }, [load]);

  const matchesSearch = useCallback((name, query) => {
    const n = String(name || "").toLowerCase();
    const q = String(query || "").toLowerCase().trim();
    if (!q) return true;
    if (n.includes(q)) return true;
    const tokens = q.split(/\s+/).filter(Boolean);
    return tokens.some((t) => n.includes(t));
  }, []);

  const matchesFilters = useCallback((product) => {
    // Search filter
    if (!matchesSearch(product?.name, searchText)) return false;

    // Category filter (from URL or sidebar)
    if (selectedCategories.length > 0) {
      const productCategory = (product?.category || "").toLowerCase();
      const matchesSelectedCategory = selectedCategories.some(
        (cat) => cat.toLowerCase() === productCategory
      );
      if (!matchesSelectedCategory) return false;
    } else if (selectedCategory) {
      // Fall back to URL category
      const productCategory = (product?.category || "").toLowerCase();
      if (selectedCategory.toLowerCase() !== productCategory) return false;
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      const productBrand = (product?.brand || "").toLowerCase();
      const matchesBrand = selectedBrands.some(
        (brand) => brand.toLowerCase() === productBrand
      );
      if (!matchesBrand) return false;
    }

    // Price filter
    const productPrice = product?.price || 0;
    if (productPrice < priceRange.min || productPrice > priceRange.max) {
      return false;
    }

    // Features filter
    if (selectedFeatures.length > 0) {
      const productFeatures = (product?.features || []).map((f) =>
        String(f).toLowerCase()
      );
      const matchesFeature = selectedFeatures.some((feat) =>
        productFeatures.some((pf) => pf === feat.toLowerCase())
      );
      if (!matchesFeature) return false;
    }

    // Condition filter
    if (selectedCondition !== "Any") {
      const productCondition = (product?.condition || "Brand new").toLowerCase();
      if (selectedCondition.toLowerCase() !== productCondition) return false;
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      const productRating = product?.rating || 0;
      const matchesRating = selectedRatings.some((r) => productRating >= r);
      if (!matchesRating) return false;
    }

    return true;
  }, [searchText, selectedCategories, selectedCategory, selectedBrands, selectedFeatures, priceRange, selectedCondition, selectedRatings, matchesSearch]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter(matchesFilters);
  }, [products, matchesFilters]);

  // ✅ SORTING LOGIC ADDED HERE
  const sortedProducts = useMemo(() => {
    let items = [...filteredProducts];

    switch (sortValue) {
      case "Price: Low to High":
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;

      case "Price: High to Low":
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;

      case "Newest":
        items.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;

      case "Featured":
      default:
        break;
    }

    return items;
  }, [filteredProducts, sortValue]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchText, sortValue]);

  const totalCount = sortedProducts.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, page, pageSize]);

  const listItems = useMemo(() => {
    return pageProducts.map((p) => ({
      id: p._id,
      title: p.name,
      price: p.price,
      oldPrice: p.oldPrice || null,
      rating: p.rating || 0,
      orders: p.numReviews || 0,
      desc: p.description || "",
      image: resolveProductImage(p.images?.[0], prodHeadphones),
    }));
  }, [pageProducts]);

  const gridItems = useMemo(() => {
    return pageProducts.map((p) => ({
      id: p._id,
      title: p.name,
      price: p.price,
      oldPrice: p.oldPrice || null,
      rating: p.rating || 0,
      short: p.category || "Product",
      image: resolveProductImage(p.images?.[0], gridPhoneRed),
    }));
  }, [pageProducts]);

  const totalText = loading ? "Loading..." : `${totalCount} items in`;
  const categoryText = selectedCategory || "Store";

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
      <BreadcrumbBar
        crumbs={
          selectedCategory
            ? ["Home", selectedCategory]
            : ["Home"]
        }
      />

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <FiltersSidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          allProducts={products}
        />

        <div style={{ flex: 1 }}>
          <ProductsToolbar
            totalText={totalText}
            category={categoryText}
            sortValue={sortValue}
            onChangeSort={setSortValue}
            view={view}
            onChangeView={setView}
          />

          {loading && <p style={{ padding: 16 }}>Loading products...</p>}
          {!loading && error && (
            <p style={{ padding: 16, color: "red" }}>{error}</p>
          )}

          {!loading && !error && totalCount === 0 && (
            <div
              style={{
                marginTop: 14,
                padding: 16,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                color: "#6b7280",
              }}
            >
              No products found.
            </div>
          )}

          {!loading && !error && totalCount > 0 && (
            <div style={{ marginTop: 14 }}>
              {view === "grid" ? (
                <>
                  <GridFilterBar />
                  <ProductsGrid
                    items={gridItems}
                    page={page}
                    setPage={setPage}
                    pageCount={pageCount}
                  />
                </>
              ) : (
                <ProductsList
                  items={listItems}
                  page={page}
                  setPage={setPage}
                  pageCount={pageCount}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
