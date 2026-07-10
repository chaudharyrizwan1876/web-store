// ====================== frontend-vite/src/App.jsx (UPDATED) ======================
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CheckoutLayout from "./layouts/CheckoutLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import WishlistPage from "./pages/WishlistPage";

import AuthPage from "./pages/AuthPage";

// ✅ NEW pages
import GiftProjectsPage from "./pages/GiftProjectsPage";
import MenuItemPage from "./pages/MenuItemPage";
import HelpPage from "./pages/HelpPage";

// ✅ Admin
import AdminRoute from "./components/admin/AdminRoute";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth full screen */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />

          {/* ✅ NEW normal pages (header/footer included) */}
          <Route path="gift-projects" element={<GiftProjectsPage />} />
          <Route path="menu-item" element={<MenuItemPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/* ✅ ADMIN — separate full-screen layout with sidebar (no store navbar/footer) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
        </Route>

        {/* checkout layout */}
        <Route element={<CheckoutLayout />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success/:id" element={<OrderSuccessPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
