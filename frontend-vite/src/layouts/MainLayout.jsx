import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import TopMenu from "../components/TopMenu";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import Footer from "../components/Footer";
import FooterBottomBar from "../components/FooterBottomBar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <TopMenu />

      {/* Page content yahan change hoga */}
      <Outlet />

      <NewsletterSubscribe />
      <Footer />
      <FooterBottomBar />
    </div>
  );
};

export default MainLayout;
