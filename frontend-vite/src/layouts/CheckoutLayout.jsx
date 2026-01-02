import React from "react";
import { Outlet } from "react-router-dom";

import CheckoutHeader from "../components/checkout/CheckoutHeader";
import Footer from "../components/Footer";
import FooterBottomBar from "../components/FooterBottomBar";

const CheckoutLayout = () => {
  return (
    <div>
      {/* ✅ Checkout header (no search bar) */}
      <CheckoutHeader />

      <Outlet />

      {/* Footer only */}
      <Footer />
      <FooterBottomBar />
    </div>
  );
};

export default CheckoutLayout;
