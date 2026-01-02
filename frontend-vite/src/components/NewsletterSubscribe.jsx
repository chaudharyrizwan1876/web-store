import React from "react";

const NewsletterSubscribe = () => {
  const styles = {
    /* FULL WIDTH BACKGROUND */
    outer: {
      width: "100%",
      background: "#f3f4f6", // light grey
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "38px 0", // ✅ top & bottom spacing (figma top = 38)
      boxSizing: "border-box",
    },

    /* INNER CONTENT BOX */
    inner: {
      width: "617px",          // ✅ Figma width
      height: "113px",         // ✅ Figma height
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box",
    },

    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111",
      margin: 0,
    },

    desc: {
      fontSize: "14px",
      color: "#6b7280",
      margin: "4px 0 12px 0",
      textAlign: "center",
    },

    formRow: {
      display: "flex",
      gap: "8px",
    },

    input: {
      width: "260px",
      height: "40px",
      padding: "0 12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "14px",
      boxSizing: "border-box",
    },

    button: {
      height: "40px",
      padding: "0 18px",
      background: "#0d6efd",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.outer}>
      <div style={styles.inner}>
        <h2 style={styles.title}>Subscribe on our newsletter</h2>

        <p style={styles.desc}>
          Get daily news on upcoming offers from many suppliers all over the world
        </p>

        <div style={styles.formRow}>
          <input type="email" placeholder="Email" style={styles.input} />
          <button style={styles.button}>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;
