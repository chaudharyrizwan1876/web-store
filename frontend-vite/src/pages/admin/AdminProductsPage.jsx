import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";

const emptyForm = {
  name: "",
  price: "",
  oldPrice: "",
  brand: "",
  description: "",
  category: "",
  stock: "",
  imagesText: "", // comma separated URLs
};

const AdminProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({});

  // UI
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL / ACTIVE / INACTIVE
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ✅ file upload state
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/admin/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => !!p.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = [...products];

    if (term) {
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const id = (p._id || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();
        return (
          name.includes(term) ||
          cat.includes(term) ||
          id.includes(term) ||
          brand.includes(term)
        );
      });
    }

    if (statusFilter === "ACTIVE") list = list.filter((p) => !!p.isActive);
    if (statusFilter === "INACTIVE") list = list.filter((p) => !p.isActive);

    list.sort((a, b) => {
      const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bT - aT;
    });

    return list;
  }, [products, q, statusFilter]);

  const toggleActive = async (id) => {
    try {
      setSaving((p) => ({ ...p, [id]: true }));
      setError("");
      const res = await apiFetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
      });
      const updated = res?.product;
      if (updated?._id) {
        setProducts((prev) =>
          prev.map((x) => (x._id === updated._id ? updated : x))
        );
      }
    } catch (e) {
      setError(e?.message || "Failed to update product");
    } finally {
      setSaving((p) => ({ ...p, [id]: false }));
    }
  };

  const openCreate = () => {
    setMode("create");
    setActiveId(null);
    setForm(emptyForm);
    setFiles([]);
    setOpenModal(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setActiveId(p._id);
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      oldPrice: String(p.oldPrice ?? ""),
      brand: p.brand || "",
      description: p.description || "",
      category: p.category || "",
      stock: String(p.stock ?? ""),
      imagesText: Array.isArray(p.images) ? p.images.join(", ") : "",
    });
    setFiles([]);
    setOpenModal(true);
  };

  const closeModal = () => {
    if (saving.modal || uploading) return;
    setOpenModal(false);
    setActiveId(null);
    setForm(emptyForm);
    setFiles([]);
    setUploading(false);
  };

  const onChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (form.price === "" || Number.isNaN(Number(form.price)))
      return "Valid price is required";
    if (form.oldPrice !== "" && Number.isNaN(Number(form.oldPrice)))
      return "oldPrice must be a number";
    if (form.stock !== "" && Number.isNaN(Number(form.stock)))
      return "stock must be a number";
    return "";
  };

  // ✅ Upload one file to Cloudinary via backend endpoint
  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append("image", file); // IMPORTANT: key must be "image"
    const res = await apiFetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    // ✅ robust extraction
    const url =
      res?.url ||
      res?.secure_url ||
      res?.imageUrl ||
      res?.data?.url ||
      res?.data?.secure_url ||
      "";

    if (!url) throw new Error("Upload succeeded but no URL returned");
    return url;
  };

  const parseUrls = (txt) =>
    txt
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const saveProduct = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setError("");
      setSaving((p) => ({ ...p, modal: true }));

      // ✅ Step A: upload selected files first (if any)
      let uploadedUrls = [];
      if (files.length > 0) {
        setUploading(true);

        // max 6 files
        const toUpload = files.slice(0, 6);

        // sequential upload (simple + stable)
        for (const f of toUpload) {
          const url = await uploadOne(f);
          if (url) uploadedUrls.push(url);
        }

        setUploading(false);
      }

      // ✅ Step B: merge URLs (existing + uploaded)
      const existingUrls = parseUrls(form.imagesText || "");
      const merged = [...existingUrls, ...uploadedUrls];

      // ✅ Step C: send product data
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("price", String(Number(form.price)));
      if (form.oldPrice !== "") fd.append("oldPrice", String(Number(form.oldPrice)));
      if (form.brand.trim()) fd.append("brand", form.brand.trim());
      if (form.category.trim()) fd.append("category", form.category.trim());
      if (form.description.trim()) fd.append("description", form.description.trim());
      if (form.stock !== "") fd.append("stock", String(Number(form.stock)));

      // send merged URLs as comma separated string
      if (merged.length > 0) fd.append("images", merged.join(", "));

      if (mode === "create") {
        const res = await apiFetch("/api/admin/products", {
          method: "POST",
          body: fd,
        });
        const created = res?.product;
        if (created?._id) setProducts((prev) => [created, ...prev]);
        else await loadProducts();
        closeModal();
      } else {
        if (!activeId) return;
        const res = await apiFetch(`/api/admin/products/${activeId}`, {
          method: "PATCH",
          body: fd,
        });
        const updated = res?.product;
        if (updated?._id) {
          setProducts((prev) =>
            prev.map((x) => (x._id === updated._id ? updated : x))
          );
        } else {
          await loadProducts();
        }
        closeModal();
      }
    } catch (e) {
      setError(e?.message || "Failed to save product");
      setUploading(false);
    } finally {
      setSaving((p) => ({ ...p, modal: false }));
    }
  };

  const badge = (isActive) => ({
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
    border: "1px solid #E5E7EB",
    background: isActive ? "#ECFDF5" : "#FEF2F2",
    color: isActive ? "#065F46" : "#991B1B",
    whiteSpace: "nowrap",
  });

  const discountText = (p) => {
    const price = Number(p.price || 0);
    const oldPrice = Number(p.oldPrice || 0);
    if (!oldPrice || oldPrice <= price) return "-";
    const off = Math.round(((oldPrice - price) / oldPrice) * 100);
    return `${off}% OFF`;
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>Admin — Products</h2>
          <div style={{ marginTop: "6px", fontSize: "13px", opacity: 0.75 }}>
            Total: <b>{stats.total}</b> • Active: <b>{stats.active}</b> • Inactive: <b>{stats.inactive}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="button" onClick={loadProducts} style={ghostBtn}>Refresh</button>
          <button type="button" onClick={openCreate} style={darkBtn}>+ Create Product</button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "10px" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: name / category / brand / id..." style={inputStyle} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Status */}
      <div style={{ marginTop: "12px" }}>
        {loading && <p>Loading products...</p>}
        {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Table */}
      {!loading && !error && (
        <div style={{ marginTop: "14px", overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "1250px", borderCollapse: "collapse", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={th}>Product</th>
                <th style={th}>Brand</th>
                <th style={th}>Category</th>
                <th style={th}>Price</th>
                <th style={th}>Discount</th>
                <th style={th}>Stock</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
                <th style={th}>Created</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: "14px" }}>No matching products.</td></tr>
              ) : (
                filtered.map((p) => {
                  const busy = !!saving[p._id];
                  const thumb = Array.isArray(p.images) && p.images[0] ? p.images[0] : "";

                  return (
                    <tr key={p._id} style={{ borderTop: "1px solid #E5E7EB" }}>
                      <td style={td}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ width: "44px", height: "44px", borderRadius: "10px", border: "1px solid #E5E7EB", overflow: "hidden", background: "#F9FAFB" }}>
                            {thumb ? (
                              <img src={thumb} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : null}
                          </div>
                          <div>
                            <div style={{ fontWeight: 900 }}>{p.name}</div>
                            <div style={{ fontFamily: "monospace", fontSize: "12px", opacity: 0.75 }}>{p._id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={td}>{p.brand || "-"}</td>
                      <td style={td}>{p.category || "-"}</td>

                      <td style={td}>
                        <div><b>Rs {p.price}</b></div>
                        {p.oldPrice ? <div style={{ fontSize: "12px", opacity: 0.7, textDecoration: "line-through" }}>Rs {p.oldPrice}</div> : null}
                      </td>

                      <td style={td}>{discountText(p)}</td>
                      <td style={td}>{p.stock ?? "-"}</td>

                      <td style={td}>
                        <span style={badge(!!p.isActive)}>{p.isActive ? "ACTIVE" : "INACTIVE"}</span>
                      </td>

                      <td style={td}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button type="button" onClick={() => openEdit(p)} style={ghostBtn}>Edit</button>
                          <button
                            type="button"
                            onClick={() => toggleActive(p._id)}
                            disabled={busy}
                            style={{ ...ghostBtn, opacity: busy ? 0.6 : 1, cursor: busy ? "not-allowed" : "pointer" }}
                          >
                            {p.isActive ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </td>

                      <td style={tdSmall}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "18px", zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(920px, 100%)", background: "#fff", borderRadius: "14px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <div>
                <div style={{ fontWeight: 900 }}>{mode === "create" ? "Create Product" : "Edit Product"}</div>
                <div style={{ fontSize: "12px", opacity: 0.75 }}>
                  {mode === "create" ? "Upload images or paste URLs (both supported)" : "You can upload new images and also update URLs"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={closeModal} style={ghostBtn}>Close</button>
                <button
                  type="button"
                  onClick={saveProduct}
                  disabled={!!saving.modal || uploading}
                  style={{ ...darkBtn, opacity: saving.modal || uploading ? 0.6 : 1, cursor: saving.modal || uploading ? "not-allowed" : "pointer" }}
                >
                  {uploading ? "Uploading..." : saving.modal ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <div style={label}>Name *</div>
                  <input value={form.name} onChange={(e) => onChange("name", e.target.value)} style={inputStyle} placeholder="Wireless Headphones" />
                </div>

                <div>
                  <div style={label}>Price *</div>
                  <input value={form.price} onChange={(e) => onChange("price", e.target.value)} style={inputStyle} placeholder="4999" />
                </div>

                <div>
                  <div style={label}>Old Price</div>
                  <input value={form.oldPrice} onChange={(e) => onChange("oldPrice", e.target.value)} style={inputStyle} placeholder="5999" />
                </div>

                <div>
                  <div style={label}>Brand</div>
                  <input value={form.brand} onChange={(e) => onChange("brand", e.target.value)} style={inputStyle} placeholder="Apple / Nike / etc" />
                </div>

                <div>
                  <div style={label}>Category</div>
                  <input value={form.category} onChange={(e) => onChange("category", e.target.value)} style={inputStyle} placeholder="Electronics" />
                </div>

                <div>
                  <div style={label}>Stock</div>
                  <input value={form.stock} onChange={(e) => onChange("stock", e.target.value)} style={inputStyle} placeholder="25" />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={label}>Images URLs (comma separated)</div>
                  <input
                    value={form.imagesText}
                    onChange={(e) => onChange("imagesText", e.target.value)}
                    style={inputStyle}
                    placeholder="https://..., https://..."
                  />
                </div>

                {/* ✅ THIS IS THE UPLOAD FIELD (it should show) */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={label}>Upload Images (max 6)</div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const picked = Array.from(e.target.files || []);
                      if (picked.length > 6) {
                        alert("Max 6 images allowed. Please select up to 6.");
                        setFiles(picked.slice(0, 6));
                      } else {
                        setFiles(picked);
                      }
                    }}
                    style={{ ...inputStyle, paddingTop: "8px", height: "46px" }}
                  />
                  {files.length > 0 && (
                    <div style={{ marginTop: "6px", fontSize: "12px", opacity: 0.75 }}>
                      Selected: <b>{files.length}</b> file(s)
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={label}>Description</div>
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    style={{ ...inputStyle, height: "110px", paddingTop: "10px" }}
                    placeholder="Product description..."
                  />
                </div>
              </div>

              <div style={{ marginTop: "12px", fontSize: "12px", opacity: 0.75 }}>
                ✅ Uploaded images will be saved as Cloudinary URLs (safe on hosting).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const label = { fontSize: "12px", opacity: 0.75, marginBottom: "6px", fontWeight: 800 };

const inputStyle = {
  height: "40px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  padding: "0 12px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const selectStyle = {
  height: "40px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  padding: "0 10px",
  background: "#fff",
  outline: "none",
};

const th = {
  textAlign: "left",
  padding: "12px",
  fontSize: "13px",
  borderBottom: "1px solid #E5E7EB",
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px",
  fontSize: "13px",
  verticalAlign: "top",
};

const tdSmall = {
  padding: "12px",
  fontSize: "12px",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const ghostBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 900,
};

const darkBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
};

export default AdminProductsPage;
