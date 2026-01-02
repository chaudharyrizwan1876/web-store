// ====================== frontend-vite/src/pages/ProductsPage.jsx (UPDATED: category + search + not-found) ======================
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

  // ✅ API state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ admin modal state
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // ✅ Read category + search from URL
  const selectedCategory = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return (sp.get("category") || "").trim();
  }, [location.search]);

  const searchText = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return (sp.get("search") || "").trim();
  }, [location.search]);

  // ✅ Build API URL (backend filters only by category; search is client-side)
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

      const url = buildProductsUrl();
      const data = await apiFetch(url);

      setProducts(data.products || []);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [buildProductsUrl]);

  // ✅ load products on mount + whenever URL category changes
  useEffect(() => {
    load();
  }, [load]);

  // ✅ search matcher (partial + tokens)
  const matchesSearch = useCallback((name, query) => {
    const n = String(name || "").toLowerCase();
    const q = String(query || "").toLowerCase().trim();
    if (!q) return true;

    // full phrase
    if (n.includes(q)) return true;

    // token match (e.g. "computer system" -> matches "system")
    const tokens = q.split(/\s+/).filter(Boolean);
    return tokens.some((t) => n.includes(t));
  }, []);

  // ✅ Filtered products (category already filtered by backend; search here)
  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => matchesSearch(p?.name, searchText));
  }, [products, searchText, matchesSearch]);

  // ✅ map backend products -> List component shape
  const listItems = useMemo(() => {
    return (filteredProducts || []).map((p) => ({
      id: p._id,
      title: p.name,
      price: p.price,
      oldPrice: p.oldPrice || null,
      rating: p.rating || 0,
      orders: p.numReviews || 0,
      desc: p.description || "",
      image: p.images && p.images[0] ? p.images[0] : prodHeadphones,
    }));
  }, [filteredProducts]);

  // ✅ map backend products -> Grid component shape
  const gridItems = useMemo(() => {
    return (filteredProducts || []).slice(0, 9).map((p) => ({
      id: p._id,
      title: p.name,
      price: p.price,
      oldPrice: p.oldPrice || null,
      rating: p.rating || 0,
      short: p.category || "Product",
      image: p.images && p.images[0] ? p.images[0] : gridPhoneRed,
    }));
  }, [filteredProducts]);

  const totalText = loading ? "Loading..." : `${listItems.length} items in`;
  const categoryText = selectedCategory ? selectedCategory : "Store";

  // ✅ Admin actions
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      price: p.price ?? "",
      category: p.category || "",
      stock: p.stock ?? "",
      image: p.images && p.images[0] ? p.images[0] : "",
      description: p.description || "",
      isActive: p.isActive !== false,
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setOpenModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const onChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const submit = async () => {
    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        setError("Product name is required");
        return;
      }
      if (form.price === "" || isNaN(Number(form.price))) {
        setError("Valid price is required");
        return;
      }

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: form.stock === "" ? 0 : Number(form.stock),
        description: form.description,
        images: form.image ? [form.image] : [],
        isActive: !!form.isActive,
      };

      if (editing?._id) {
        const res = await apiFetch(`/api/products/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const updated = res?.product;
        if (updated?._id) {
          setProducts((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
        }
      } else {
        const res = await apiFetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = res?.product;
        if (created?._id) {
          setProducts((prev) => [created, ...prev]);
        } else {
          await load();
        }
      }

      closeModal();
    } catch (e) {
      setError(e?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    const ok = window.confirm(`Deactivate product?\n\n${p.name}`);
    if (!ok) return;

    try {
      setError("");
      await apiFetch(`/api/products/${p._id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
    } catch (e) {
      setError(e?.message || "Failed to delete product");
    }
  };

  const showAdminPanel = isAuthed && isAdmin;

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
      <BreadcrumbBar />

      {/* ✅ Admin Products Panel (only admin) */}
      {showAdminPanel && (
        <div style={adminPanel.box}>
          <div style={adminPanel.header}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Admin — Manage Products</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                Create / Edit / Deactivate products (users see only active products)
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={openCreate} style={adminPanel.primaryBtn}>
                + Create Product
              </button>
              <button type="button" onClick={load} style={adminPanel.ghostBtn}>
                Refresh
              </button>
            </div>
          </div>

          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <table style={adminPanel.table}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={adminPanel.th}>Name</th>
                  <th style={adminPanel.th}>Price</th>
                  <th style={adminPanel.th}>Category</th>
                  <th style={adminPanel.th}>Stock</th>
                  <th style={adminPanel.th}>Active</th>
                  <th style={adminPanel.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 12 }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  (products || []).map((p) => (
                    <tr key={p._id} style={{ borderTop: "1px solid #E5E7EB" }}>
                      <td style={adminPanel.td}>
                        <div style={{ fontWeight: 800 }}>{p.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.7, fontFamily: "monospace" }}>{p._id}</div>
                      </td>
                      <td style={adminPanel.td}>{p.price}</td>
                      <td style={adminPanel.td}>{p.category || "-"}</td>
                      <td style={adminPanel.td}>{p.stock ?? 0}</td>
                      <td style={adminPanel.td}>{p.isActive === false ? "NO" : "YES"}</td>
                      <td style={adminPanel.td}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" onClick={() => openEdit(p)} style={adminPanel.ghostBtn}>
                            Edit
                          </button>
                          <button type="button" onClick={() => remove(p)} style={adminPanel.dangerBtn}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", marginTop: "20px", alignItems: "flex-start" }}>
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

          {/* ✅ Search hint (optional, small) */}
          {searchText && !loading && !error && (
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
              Search: <b>{searchText}</b>
            </div>
          )}

          {/* ✅ loading/error messages */}
          {loading && <p style={{ padding: "16px 0", margin: 0 }}>Loading products...</p>}
          {!loading && error && <p style={{ padding: "16px 0", margin: 0, color: "red" }}>{error}</p>}

          {/* ✅ Not found */}
          {!loading && !error && listItems.length === 0 && (
            <div
              style={{
                marginTop: 14,
                padding: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 900 }}>No products found</div>
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.75 }}>
                Try a different keyword{searchText ? ` (you searched: "${searchText}")` : ""}.
              </div>
            </div>
          )}

          {!loading && !error && listItems.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              {view === "grid" ? (
                <>
                  <GridFilterBar />
                  <ProductsGrid items={gridItems} />
                </>
              ) : (
                <ProductsList items={listItems} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Create/Edit Modal */}
      {openModal && showAdminPanel && (
        <div onClick={closeModal} style={modal.backdrop}>
          <div onClick={(e) => e.stopPropagation()} style={modal.card}>
            <div style={modal.header}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{editing ? "Edit Product" : "Create Product"}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{editing ? editing._id : "New product"}</div>
              </div>
              <button type="button" onClick={closeModal} style={adminPanel.ghostBtn}>
                Close
              </button>
            </div>

            <div style={{ padding: 14 }}>
              {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

              <div style={modal.grid}>
                <Field label="Name">
                  <input value={form.name} onChange={(e) => onChange("name", e.target.value)} style={modal.input} />
                </Field>

                <Field label="Price">
                  <input value={form.price} onChange={(e) => onChange("price", e.target.value)} style={modal.input} />
                </Field>

                <Field label="Category">
                  <input
                    value={form.category}
                    onChange={(e) => onChange("category", e.target.value)}
                    style={modal.input}
                  />
                </Field>

                <Field label="Stock">
                  <input value={form.stock} onChange={(e) => onChange("stock", e.target.value)} style={modal.input} />
                </Field>

                <Field label="Image URL (optional)">
                  <input value={form.image} onChange={(e) => onChange("image", e.target.value)} style={modal.input} />
                </Field>

                <Field label="Active">
                  <select
                    value={form.isActive ? "YES" : "NO"}
                    onChange={(e) => onChange("isActive", e.target.value === "YES")}
                    style={modal.input}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </Field>

                <Field label="Description" full>
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    style={modal.textarea}
                    rows={4}
                  />
                </Field>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button type="button" onClick={closeModal} style={adminPanel.ghostBtn} disabled={saving}>
                  Cancel
                </button>
                <button type="button" onClick={submit} style={adminPanel.primaryBtn} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children, full }) => (
  <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
    <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

const adminPanel = {
  box: {
    marginTop: 16,
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    background: "#fff",
    padding: 14,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 820,
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: 12,
    fontSize: 12,
    borderBottom: "1px solid #E5E7EB",
    whiteSpace: "nowrap",
  },
  td: {
    padding: 12,
    fontSize: 13,
    verticalAlign: "top",
  },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  ghostBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  dangerBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #FCA5A5",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
};

const modal = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    zIndex: 9999,
  },
  card: {
    width: "min(860px, 100%)",
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    overflow: "hidden",
  },
  header: {
    padding: "12px 14px",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    padding: "0 12px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    padding: 12,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  },
};

export default ProductsPage;
