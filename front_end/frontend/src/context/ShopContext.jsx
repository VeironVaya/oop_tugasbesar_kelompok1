// === src/context/ShopContext.jsx (FINAL MERGED VERSION) ===

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";

export const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [checkoutData, setCheckoutData] = useState([]);
  const [currency] = useState("Rp");

  const login = (jwtToken, customerId) => {
    const decodedToken = jwtDecode(jwtToken);
    const completeUser = {
      id: customerId,
      sub: decodedToken.sub,
      role: decodedToken.role || "user",
    };
    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("user", JSON.stringify(completeUser));
    setToken(jwtToken);
    setUser(completeUser);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const fetchCart = async () => {
    if (!user?.id) {
      setCartItems([]);
      return;
    }
    try {
      const res = await api.get(`/customers/${user.id}/carts`);
      if (res.data && res.data.items) {
        const mappedItems = res.data.items.map((item) => ({
          idCartItem: item.idCartItem,
          stockId: item.idStock,
          productId: item.idProduct,
          quantity: item.itemQuantity,
          size: item.size || "-",
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          stockQuantity: item.stockQuantity,
          image: item.image || "/default.jpg",
        }));
        setCartItems(mappedItems);
      }
    } catch (err) {
      console.error("Gagal memuat cart:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = api
      .get("/products")
      .then((res) => setProducts(res.data));
    const fetchCartPromise = user?.id ? fetchCart() : Promise.resolve();

    Promise.all([fetchProducts, fetchCartPromise])
      .catch((error) => console.error("Gagal memuat data awal:", error))
      .finally(() => setLoading(false));
  }, [user]);

  const addToCart = async (stockId, size = "-") => {
    if (!user)
      throw new Error("Anda harus login untuk menambahkan ke keranjang.");

    try {
      const response = await api.post(
        `/customers/${user.id}/carts/stocks/${stockId}`,
        { size }
      );
      if (response.data && response.data.item) {
        const updatedItem = response.data.item;

        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) => item.idCartItem === updatedItem.idCartItem
          );
          if (existingItemIndex > -1) {
            const newItems = [...prevItems];
            newItems[existingItemIndex] = updatedItem;
            return newItems;
          } else {
            return [...prevItems, updatedItem];
          }
        });
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.error("Gagal menambahkan ke cart:", err);
      throw err;
    }
  };

  const handleCheckout = async () => {
    if (!user?.id) throw new Error("Pengguna belum login.");
    if (cartItems.length === 0) throw new Error("Keranjang kosong.");
    try {
      const response = await api.post(`/customers/${user.id}/checkout`);
      await fetchCart();
      return response.data;
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      throw error;
    }
  };

  const cancelOrder = async (transactionId) => {
    if (!user?.id || !transactionId)
      throw new Error("Data tidak lengkap untuk pembatalan.");
    try {
      const response = await api.delete(
        `/customers/${user.id}/transactions/${transactionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Gagal membatalkan pesanan:", error);
      throw error;
    }
  };

  const updateQuantity = async (stockId, newQuantity) => {
    if (!user?.id || !stockId) {
      console.error("Gagal update: User ID atau Stock ID tidak ada.");
      return;
    }

    try {
      if (newQuantity > 0) {
        await api.patch(`/customers/${user.id}/carts/stocks/${stockId}`, {
          itemQuantity: newQuantity,
        });
      } else {
        await api.delete(`/customers/${user.id}/carts/stocks/${stockId}`);
      }
      await fetchCart();
    } catch (err) {
      console.error("Gagal update quantity:", err);
      alert(
        `Error: ${err.response?.data?.message || "Gagal memperbarui item"}`
      );
    }
  };

  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const fetchFavorites = async () => {
    if (!user?.id) {
      setFavoriteItems([]);
      return;
    }

    const token = localStorage.getItem("authToken");
    console.log("🔐 Token untuk fetchFavorites:", token);
    console.log("👤 User ID:", user.id);

    try {
      const res = await api.get(`/products/customer/${user.id}/favorites`);

      // ✅ Ambil hanya bagian product dari favorites
      if (res.data?.favorites && Array.isArray(res.data.favorites)) {
        const favoriteProducts = res.data.favorites.map((fav) => fav.product);
        setFavoriteItems(favoriteProducts);
        console.log("✅ Favorites:", favoriteProducts);
      } else {
        setFavoriteItems([]);
      }
    } catch (err) {
      console.error(
        "❌ Gagal memuat favorit:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = api
      .get("/products")
      .then((res) => setProducts(res.data));
    const fetchCartPromise = user?.id ? fetchCart() : Promise.resolve();
    const fetchFavoritesPromise = user?.id
      ? fetchFavorites()
      : Promise.resolve();

    Promise.all([fetchProducts, fetchCartPromise, fetchFavoritesPromise])
      .catch((error) => console.error("Gagal memuat data awal:", error))
      .finally(() => setLoading(false));
  }, [user]);

  const addToFavorites = async (productId) => {
    if (!user) {
      console.warn("User belum login. Tidak bisa menambahkan ke favorit.");
      return;
    }

    const token = localStorage.getItem("authToken");
    console.log("🔐 Token yang akan dikirim:", token);
    console.log(
      "📦 Menambahkan ke favorit - Product ID:",
      productId,
      "User ID:",
      user.id
    );

    try {
      const response = await api.post(
        `/products/${productId}/customer/${user.id}/favorites`,
        {} // bisa juga dikosongkan dengan `null` jika backend tidak memerlukan body sama sekali
      );

      console.log("✅ Favorit berhasil ditambahkan:", response.data);
      await fetchFavorites(); // refresh list favorit
    } catch (err) {
      console.error(
        "❌ Gagal menambahkan ke favorit:",
        err.response?.data || err.message
      );
      alert("Gagal menambahkan item ke favorit.");
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!user) return;
    try {
      await api.delete(`/products/${productId}/customer/${user.id}/favorites`);
      await fetchFavorites();
    } catch (err) {
      console.error("Gagal menghapus dari favorit:", err);
      alert("Gagal menghapus item dari favorit.");
    }
  };

  const contextValue = {
    user,
    token,
    products,
    cartItems,
    favoriteItems,
    loading,
    selectedProductId,
    checkoutData,
    currency,
    login,
    logout,
    addToCart,
    updateQuantity,
    getCartAmount,
    addToFavorites,
    removeFromFavorites,
    setSelectedProductId,
    setCheckoutData,
    handleCheckout,
    cancelOrder,
    fetchCart,
    fetchFavorites,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};
