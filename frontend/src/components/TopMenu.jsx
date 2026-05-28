// ====================== frontend-vite/src/components/TopMenu.jsx (UPDATED) ======================
import React from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const TopMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goAllCategories = () => {
    navigate("/products"); // ✅ all products
  };

  const goHotOffers = () => {
    // ✅ if already on home, just scroll
    if (location.pathname === "/") {
      const el = document.getElementById("deals-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // ✅ otherwise go home then scroll after render
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("deals-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  };

  const goGiftProjects = () => {
    navigate("/gift-projects");
  };

  const goMenuItemRandom = () => {
    // ✅ every click new random set
    navigate(`/menu-item?ts=${Date.now()}`);
  };

  const goHelp = () => {
    navigate("/help");
  };

  const styles = {
    outer: {
      width: "100%",
      borderBottom: "1px solid #e5e5e5",
      background: "#fff",
    },

    wrapper: {
      maxWidth: "1180px",
      height: "56px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "14px",
      fontFamily: "sans-serif",
      boxSizing: "border-box",
    },

    left: {
      width: "620px",
      display: "flex",
      alignItems: "center",
      gap: "30px",
    },

    leftItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      userSelect: "none",
    },

    linkText: {
      cursor: "pointer",
      userSelect: "none",
    },

    right: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
    },

    rightItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      userSelect: "none",
    },

    flag: {
      width: "20px",
      borderRadius: "3px",
    },
  };

  return (
    <div style={styles.outer}>
      <div style={styles.wrapper}>
        {/* LEFT ITEMS */}
        <div style={styles.left}>
          <div style={styles.leftItem} onClick={goAllCategories} role="button" tabIndex={0}>
            <FaBars size={18} />
            <span>All category</span>
          </div>

          <span style={styles.linkText} onClick={goHotOffers} role="button" tabIndex={0}>
            Hot offers
          </span>

          <span style={styles.linkText} onClick={goGiftProjects} role="button" tabIndex={0}>
            Gift boxes
          </span>

          <span style={styles.linkText} onClick={goGiftProjects} role="button" tabIndex={0}>
            Projects
          </span>

          <span style={styles.linkText} onClick={goMenuItemRandom} role="button" tabIndex={0}>
            Menu item
          </span>

          <div style={styles.leftItem} onClick={goHelp} role="button" tabIndex={0}>
            <span>Help</span>
            <FaChevronDown size={12} />
          </div>
        </div>

        {/* RIGHT ITEMS (UI only for now) */}
        <div style={styles.right}>
          <div style={styles.rightItem}>
            <span>English, USD</span>
            <FaChevronDown size={12} />
          </div>

          <div style={styles.rightItem}>
            <span>Ship to</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg"
              alt="flag"
              style={styles.flag}
            />
            <FaChevronDown size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
