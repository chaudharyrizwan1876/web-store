import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ProfileModal = ({ onClose }) => {
  const { user, token, updateUser } = useAuth();

  const [tab, setTab] = useState("info"); // "info" | "password"
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const overlayRef = useRef(null);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const setError = (text) => setMsg({ text, type: "error" });
  const setSuccess = (text) => setMsg({ text, type: "success" });

  // ── Save profile info ────────────────────────────
  const handleSaveInfo = async () => {
    setMsg({ text: "", type: "" });
    if (!form.firstName || !form.lastName || !form.phone || !form.address) {
      setError("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.message || "Update failed."); return; }
      updateUser(data.user);
      setSuccess("Profile updated successfully!");
      setTimeout(() => onClose(), 1200); // ✅ 1.2 sec baad modal band
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  // ── Save new password ────────────────────────────
  const handleSavePassword = async () => {
    setMsg({ text: "", type: "" });
    if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (passForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.message || "Password change failed."); return; }
      setSuccess("Password changed successfully!");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} style={s.overlay}>
      <div style={s.modal}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div style={s.avatarCircle}>
            <span style={s.avatarText}>{initials}</span>
          </div>
          <div style={s.headerInfo}>
            <p style={s.headerName}>{user?.firstName} {user?.lastName}</p>
            <p style={s.headerEmail}>{user?.email}</p>
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        {/* ── Tabs ── */}
        <div style={s.tabs}>
          {["info", "password"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg({ text: "", type: "" }); }}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
            >
              {t === "info" ? "Personal Info" : "Change Password"}
            </button>
          ))}
        </div>

        {/* ── Message ── */}
        {msg.text && (
          <div style={{
            ...s.msgBox,
            background: msg.type === "error" ? "#FFF1F0" : "#F0FFF4",
            borderColor: msg.type === "error" ? "#FFA39E" : "#B7EB8F",
            color: msg.type === "error" ? "#CF1322" : "#135200",
          }}>
            {msg.type === "error" ? "⚠ " : "✓ "}{msg.text}
          </div>
        )}

        {/* ── Tab: Personal Info ── */}
        {tab === "info" && (
          <div style={s.body}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>First Name</label>
                <input
                  style={s.input}
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Last Name</label>
                <input
                  style={s.input}
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input
                style={{ ...s.input, ...s.inputDisabled }}
                value={user?.email || ""}
                disabled
              />
              <span style={s.hint}>Email cannot be changed</span>
            </div>

            <div style={s.field}>
              <label style={s.label}>Phone Number</label>
              <input
                style={s.input}
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Address</label>
              <textarea
                style={{ ...s.input, ...s.textarea }}
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Your address"
                rows={3}
              />
            </div>

            <button
              onClick={handleSaveInfo}
              disabled={loading}
              style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* ── Tab: Change Password ── */}
        {tab === "password" && (
          <div style={s.body}>
            <div style={s.field}>
              <label style={s.label}>Current Password</label>
              <input
                style={s.input}
                type="password"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>New Password</label>
              <input
                style={s.input}
                type="password"
                value={passForm.newPassword}
                onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirm New Password</label>
              <input
                style={s.input}
                type="password"
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Re-enter new password"
              />
            </div>

            <button
              onClick={handleSavePassword}
              disabled={loading}
              style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
    overflow: "hidden",
    animation: "slideUp 0.25s cubic-bezier(0.22,1,0.36,1)",
  },
  header: {
    background: "linear-gradient(135deg, #0066ff 0%, #4a7bff 100%)",
    padding: "24px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    position: "relative",
  },
  avatarCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    border: "2px solid rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "20px",
    letterSpacing: "1px",
  },
  headerInfo: { flex: 1 },
  headerName: {
    margin: 0,
    color: "#fff",
    fontWeight: "700",
    fontSize: "17px",
  },
  headerEmail: {
    margin: "3px 0 0",
    color: "rgba(255,255,255,0.8)",
    fontSize: "13px",
  },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "16px",
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #f0f0f0",
    padding: "0 20px",
    gap: "4px",
  },
  tab: {
    padding: "14px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#888",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#0066ff",
    borderBottom: "2px solid #0066ff",
  },
  msgBox: {
    margin: "12px 20px 0",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "13.5px",
    fontWeight: "500",
  },
  body: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12.5px",
    fontWeight: "600",
    color: "#444",
    letterSpacing: "0.3px",
  },
  input: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e8e8e8",
    fontSize: "14px",
    outline: "none",
    color: "#222",
    background: "#fafafa",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  inputDisabled: {
    background: "#f5f5f5",
    color: "#aaa",
    cursor: "not-allowed",
  },
  textarea: {
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
  },
  hint: {
    fontSize: "11.5px",
    color: "#aaa",
    marginTop: "2px",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #0066ff, #4a7bff)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "4px",
    transition: "opacity 0.2s",
  },
};

export default ProfileModal;
