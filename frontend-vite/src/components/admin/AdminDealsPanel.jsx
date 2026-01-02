// ====================== frontend-vite/src/components/admin/AdminDealsPanel.jsx ======================
import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";

const AdminDealsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form fields
  const [title, setTitle] = useState("Deals and offers");
  const [subtitle, setSubtitle] = useState("Limited time offer");
  const [category, setCategory] = useState("Electronics");

  // datetime-local expects: YYYY-MM-DDTHH:mm
  const [endsAtLocal, setEndsAtLocal] = useState("");

  const nowPlusHours = (h) => {
    const d = new Date(Date.now() + h * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  };

  const localToISO = (localStr) => {
    // localStr like "2026-01-10T17:30" -> Date in local time -> ISO string
    const d = new Date(localStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString();
  };

  const isoToLocalInput = (isoStr) => {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiFetch("/api/admin/deals/active");

      const deal = data?.deal;
      if (deal) {
        setTitle(deal.title || "Deals and offers");
        setSubtitle(deal.subtitle || "");
        setCategory(deal.category || "Electronics");
        setEndsAtLocal(deal.endsAt ? isoToLocalInput(deal.endsAt) : nowPlusHours(48));
      } else {
        setEndsAtLocal(nowPlusHours(48));
      }
    } catch (e) {
      setError(e?.message || "Failed to load deal");
      setEndsAtLocal(nowPlusHours(48));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickSetHours = (hours) => {
    setEndsAtLocal(nowPlusHours(hours));
  };

  const endsAtPreview = useMemo(() => {
    const iso = localToISO(endsAtLocal);
    if (!iso) return "Invalid date/time";
    const d = new Date(iso);
    return d.toString();
  }, [endsAtLocal]);

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const iso = localToISO(endsAtLocal);
      if (!iso) {
        setError("Please select a valid end date/time");
        return;
      }

      const endDate = new Date(iso);
      if (endDate.getTime() <= Date.now()) {
        setError("End time must be in the future");
        return;
      }

      await apiFetch("/api/admin/deals/active", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Deals and offers",
          subtitle: subtitle.trim(),
          category: category.trim(),
          endsAt: iso, // ✅ server expects ISO
        }),
      });

      setSuccess("Deal saved ✅ (timer will update on Home automatically)");
      await load();
    } catch (e) {
      setError(e?.message || "Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    box: {
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      background: "#fff",
      padding: 14,
      marginTop: 14,
    },
    h: { fontSize: 16, fontWeight: 900, margin: 0 },
    sub: { fontSize: 12, opacity: 0.75, marginTop: 6, marginBottom: 12 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 12, opacity: 0.75 },
    input: {
      width: "100%",
      height: 40,
      borderRadius: 10,
      border: "1px solid #E5E7EB",
      padding: "0 12px",
      outline: "none",
      boxSizing: "border-box",
    },
    btnRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
    ghostBtn: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #E5E7EB",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 800,
    },
    primaryBtn: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #111827",
      background: "#111827",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
    },
    msgErr: { color: "red", marginTop: 10, fontSize: 13 },
    msgOk: { color: "green", marginTop: 10, fontSize: 13 },
    preview: { fontSize: 12, opacity: 0.75, marginTop: 6 },
    full: { gridColumn: "1 / -1" },
  };

  return (
    <div style={styles.box}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <div>
          <p style={styles.h}>Admin — Deals Timer</p>
          <p style={styles.sub}>
            Admin yahan se title/subtitle/category set karega + end time choose karega. Home page ka countdown auto update
            ho jayega.
          </p>
        </div>
        <button type="button" onClick={load} style={styles.ghostBtn} disabled={loading || saving}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ fontSize: 13, opacity: 0.75 }}>Loading...</div>
      ) : (
        <>
          <div style={styles.row}>
            <div style={styles.field}>
              <div style={styles.label}>Title</div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.field}>
              <div style={styles.label}>Category (must match Product.category)</div>
              <input value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} />
            </div>

            <div style={{ ...styles.field, ...styles.full }}>
              <div style={styles.label}>Subtitle</div>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={styles.input} />
            </div>

            <div style={{ ...styles.field, ...styles.full }}>
              <div style={styles.label}>Deal end time (Admin chooses)</div>
              <input
                type="datetime-local"
                value={endsAtLocal}
                onChange={(e) => setEndsAtLocal(e.target.value)}
                style={styles.input}
              />
              <div style={styles.preview}>Preview: {endsAtPreview}</div>
            </div>
          </div>

          {/* ✅ Quick presets (admin apni marzi se 24h/48h etc.) */}
          <div style={styles.btnRow}>
            <button type="button" onClick={() => quickSetHours(6)} style={styles.ghostBtn} disabled={saving}>
              +6 hours
            </button>
            <button type="button" onClick={() => quickSetHours(12)} style={styles.ghostBtn} disabled={saving}>
              +12 hours
            </button>
            <button type="button" onClick={() => quickSetHours(24)} style={styles.ghostBtn} disabled={saving}>
              +24 hours
            </button>
            <button type="button" onClick={() => quickSetHours(48)} style={styles.ghostBtn} disabled={saving}>
              +48 hours
            </button>
            <button type="button" onClick={() => quickSetHours(72)} style={styles.ghostBtn} disabled={saving}>
              +72 hours
            </button>

            <div style={{ flex: 1 }} />

            <button type="button" onClick={save} style={styles.primaryBtn} disabled={saving}>
              {saving ? "Saving..." : "Save Deal"}
            </button>
          </div>

          {error && <div style={styles.msgErr}>{error}</div>}
          {success && <div style={styles.msgOk}>{success}</div>}
        </>
      )}
    </div>
  );
};

export default AdminDealsPanel;
