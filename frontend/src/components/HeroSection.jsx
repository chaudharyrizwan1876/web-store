import React from "react";
import CategoryMenu from "./CategoryMenu";
import MiddleBanner from "./MiddleBanner";
import RightSidebar from "./RightSideBar";

function HeroSection() {
  const styles = {
    section: {
      width: "100%",
      maxWidth: "1180px",        // ✅ Figma width
      height: "400px",           // ✅ Figma height
      margin: "20px auto 0",     // ✅ top=162 comes naturally (86+56+20)
      display: "flex",
      gap: "15px",
      alignItems: "stretch",
      boxSizing: "border-box",
    },
  };

  return (
    <div style={styles.section}>
      <CategoryMenu />
      <MiddleBanner />
      <RightSidebar />
    </div>
  );
}

export default HeroSection;
