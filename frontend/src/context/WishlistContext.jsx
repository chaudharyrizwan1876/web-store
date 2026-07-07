import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthed } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]); // array of product IDs (strings)
  const [loaded, setLoaded] = useState(false);

  // ✅ Load wishlist jab user login ho
  const loadWishlist = useCallback(async () => {
    if (!isAuthed) {
      setWishlistIds([]);
      setLoaded(true);
      return;
    }
    try {
      const data = await apiFetch("/api/wishlist");
      const ids = (data.wishlist || []).map((p) => String(p._id || p));
      setWishlistIds(ids);
    } catch (_) {
      setWishlistIds([]);
    } finally {
      setLoaded(true);
    }
  }, [isAuthed]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = useCallback(
    (productId) => wishlistIds.includes(String(productId)),
    [wishlistIds]
  );

  // ✅ Toggle wishlist — instant UI update + backend sync
  const toggleWishlist = useCallback(
    async (productId) => {
      if (!isAuthed) {
        return { needsAuth: true };
      }

      const id = String(productId);
      const currentlyIn = wishlistIds.includes(id);

      // Optimistic update
      setWishlistIds((prev) =>
        currentlyIn ? prev.filter((x) => x !== id) : [...prev, id]
      );

      try {
        const data = await apiFetch(`/api/wishlist/${id}/toggle`, { method: "PUT" });
        // Sync with actual server response
        const ids = (data.wishlist || []).map((x) => String(x));
        setWishlistIds(ids);
        return { inWishlist: data.inWishlist };
      } catch (err) {
        // Revert on failure
        setWishlistIds((prev) =>
          currentlyIn ? [...prev, id] : prev.filter((x) => x !== id)
        );
        return { error: err.message };
      }
    },
    [isAuthed, wishlistIds]
  );

  const value = {
    wishlistIds,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlistIds.length,
    loaded,
    reloadWishlist: loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
