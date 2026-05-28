import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { isAuthed, isAdmin } = useAuth();

  // Not logged in → go auth
  if (!isAuthed) return <Navigate to="/auth" replace />;

  // Logged in but not admin → go home (or you can show a 403 page later)
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
