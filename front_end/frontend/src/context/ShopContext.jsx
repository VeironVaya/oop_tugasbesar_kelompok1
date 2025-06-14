import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DEFAULT_CURRENCY = "Rp";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Produk
  const [products, setProducts] = useState([]);
  // User
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // Cart
  const [cartItems, setCartItems] = useState([]);
  // Favorite
  const [favoriteItems, setFavoriteItems] = useState([]);
  // Search UI
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // Checkout
  const [checkoutData, setCheckoutData] = useState([]);
  // Lainnya
  const [currency] = useState(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ========== FETCH PRODUCTS ==========
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/products");
      setProducts(res.data.data || []);
    } catch (err) {
      setError("Gagal ambil data produk!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ========== FETCH CART ==========
  const fetchCartItems = async () => {
    const id_customer = localStorage.getItem("id_customer");
    if (!id_customer) {
      setCartItems([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/customers/${id_customer}/carts`
      );
      setCartItems(res.data.data || []);
    } catch (err) {
      setCartItems([]);
    }
  };

  // ========== FETCH FAVORITES ==========
  const fetchFavorites = async () => {
    const id_customer = localStorage.getItem("id_customer");
    if (!id_customer) {
      setFavoriteItems([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/customers/${id_customer}/favorites`
      );
      setFavoriteItems(res.data.data || []);
    } catch (err) {
      setFavoriteItems([]);
    }
  };

  // ========== EFFECT SYNC USER (cart & favorite) ==========
  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchFavorites();
    } else {
      setCartItems([]);
      setFavoriteItems([]);
    }
  }, [user]);

  // ========== CART ACTION ==========
  // Total harga cart
  const getCartAmount = () =>
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Tambah ke cart (FE only, bisa kamu tambah POST ke backend jika ingin)
  const addToCart = (id_product, size) => {
    const product = products.find(
      (p) => String(p.id_product) === String(id_product)
    );
    if (!product) return;

    const exist = cartItems.find(
      (item) =>
        String(item.id_product) === String(id_product) && item.size === size
    );
    if (exist) {
      setCartItems((items) =>
        items.map((item) =>
          String(item.id_product) === String(id_product) && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((items) => [
        ...items,
        { ...product, id_product, size, quantity: 1 },
      ]);
    }
    // Optional: sync ke backend di sini
  };

  const updateQuantity = (id_product, size, qty) => {
    if (qty <= 0) {
      setCartItems((items) =>
        items.filter(
          (item) =>
            !(
              String(item.id_product) === String(id_product) &&
              item.size === size
            )
        )
      );
    } else {
      setCartItems((items) =>
        items.map((item) =>
          String(item.id_product) === String(id_product) && item.size === size
            ? { ...item, quantity: qty }
            : item
        )
      );
    }
    // Optional: update ke backend
  };

  // ========== FAVORITE ACTION ==========
  const addToFavorites = async (product) => {
    const id_customer = localStorage.getItem("id_customer");
    try {
      await axios.post(
        `http://localhost:8080/api/v1/products/${product.id_product}/customer/${id_customer}/favorites`
      );
      fetchFavorites();
    } catch (err) {
      alert("Gagal tambah ke favorite");
    }
  };

  const removeFromFavorites = async (id_product) => {
    const id_customer = localStorage.getItem("id_customer");
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/products/${id_product}/customer/${id_customer}/favorites`
      );
      fetchFavorites();
    } catch (err) {
      alert("Gagal hapus favorite");
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,

        user,
        setUser,
        userRole,
        setUserRole,

        cartItems,
        setCartItems,
        fetchCartItems,
        getCartAmount,
        addToCart,
        updateQuantity,

        favoriteItems,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,

        currency,
        search,
        setSearch,
        showSearch,
        setShowSearch,

        checkoutData,
        setCheckoutData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
export default ShopProvider;
