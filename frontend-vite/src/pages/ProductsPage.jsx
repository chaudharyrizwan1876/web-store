// ====================== frontend-vite/src/pages/ProductsPage.jsx ======================
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";
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
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sortValue, setSortValue] = useState("Featured");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

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

  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) =>
      matchesSearch(p?.name, searchText)
    );
  }, [products, searchText, matchesSearch]);

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

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

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
      image: p.images?.[0] || prodHeadphones,
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
      image: p.images?.[0] || gridPhoneRed,
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
        <FiltersSidebar />

        <div style={{ flex: 1 }}>
          <ProductsToolbar
            totalText={totalText}
            category={categoryText}
            verifiedOnly={verifiedOnly}
            onToggleVerified={setVerifiedOnly}
            sortValue={sortValue}
            onChangeSort={setSortValue}
            view={view}
            onChangeView={setView}
          />

          {loading && <p style={{ padding: 16 }}>Loading products...</p>}
          {!loading && error && (
            <p style={{ padding: 16, color: "red" }}>{error}</p>
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
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                  />
                </>
              ) : (
                <ProductsList
                  items={listItems}
                  page={page}
                  setPage={setPage}
                  pageCount={pageCount}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
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