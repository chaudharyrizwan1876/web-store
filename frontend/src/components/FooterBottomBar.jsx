import React from "react";

const FooterBottomBar = () => {
  const styles = {
    outer: {
      width: "100%",
      background: "#f3f4f6",
      borderTop: "1px solid #e5e7eb",
      boxSizing: "border-box",
    },

    wrapper: {
      maxWidth: "1180px",      // ✅ 1440 - 130*2
      height: "56px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },

    leftText: {
      width: "320px",          // ✅ Figma
      height: "24px",          // ✅ Figma
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
      color: "#6b7280",
    },

    spacer: {
      flex: 1,                // ✅ pushes right block exactly to end
    },

    rightBox: {
      width: "107px",         // ✅ Figma
      height: "24px",         // ✅ Figma
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: "#374151",
      cursor: "pointer",
      userSelect: "none",
      justifyContent: "flex-end",
    },

    flag: {
      width: "22px",
      height: "14px",
      borderRadius: "2px",
      objectFit: "cover",
      display: "block",
    },

    arrow: {
      fontSize: "14px",
      lineHeight: 1,
      marginLeft: "2px",
    },
  };

  return (
    <div style={styles.outer}>
      <div style={styles.wrapper}>
        {/* LEFT */}
        <div style={styles.leftText}>© 2023 Ecommerce.</div>

        {/* SPACE */}
        <div style={styles.spacer}></div>

        {/* RIGHT */}
        <div style={styles.rightBox}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
            alt="US Flag"
            style={styles.flag}
          />
          <span>English</span>
          <span style={styles.arrow}>˄</span>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBar;
