// === src/context/ShopContext.jsx (FINAL MERGED VERSION) ===

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";

export const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  // --- STATE MANAGEMENT (Gabungan dari kedua versi) ---
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [checkoutData, setCheckoutData] = useState([]); // ✅ Diambil dari kode lama
  const [currency] = useState("Rp"); // ✅ Diambil dari kode lama

  // --- FUNGSI OTENTIKASI ---
  const login = (jwtToken, customerId) => {
    const decodedToken = jwtDecode(jwtToken);
    const completeUser = { 
      id: customerId, 
      sub: decodedToken.sub, // Ini adalah username
      role: decodedToken.role || 'user' 
    };
    localStorage.setItem('authToken', jwtToken);
    localStorage.setItem('user', JSON.stringify(completeUser));
    setToken(jwtToken);
    setUser(completeUser);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // --- FUNGSI FETCH DATA ---

  // Fungsi terpusat untuk fetch cart, dengan mapping data yang benar
  const fetchCart = async () => {
    if (!user?.id) {
      setCartItems([]); // Kosongkan keranjang jika tidak ada user
      return;
    }
    try {
      const res = await api.get(`/customers/${user.id}/carts`);
      if (res.data && res.data.items) {
        // ✅ Mapping data dari API ke format yang diinginkan frontend
        const mappedItems = res.data.items.map((item) => ({
          // Properti ini didasarkan pada kode 'non-tokenize' Anda
          idCartItem: item.idCartItem,
          stockId: item.idStock,
          productId: item.idProduct, // Menggunakan nama yang lebih jelas
          quantity: item.itemQuantity,
          size: item.size || "-",
          // Gabungkan detail produk ke dalam setiap item
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
      setCartItems([]); // Kosongkan jika gagal
    }
  };

  useEffect(() => {
    setLoading(true);
    // Fetch products
    const fetchProducts = api.get("/products").then(res => setProducts(res.data));
    // Fetch cart (jika user ada)
    const fetchCartPromise = user?.id ? fetchCart() : Promise.resolve();

    Promise.all([fetchProducts, fetchCartPromise])
      .catch(error => console.error("Gagal memuat data awal:", error))
      .finally(() => setLoading(false));

  }, [user]); // Effect ini berjalan kembali jika user login/logout

  // --- FUNGSI AKSI (Cart, Favorites, dll) ---

  // File: src/context/ShopContext.jsx

const addToCart = async (stockId, size = "-") => {
  if (!user) throw new Error("Anda harus login untuk menambahkan ke keranjang.");

  try {
    // Panggil API, sekarang kita akan menggunakan responsenya
    const response = await api.post(`/customers/${user.id}/carts/stocks/${stockId}`, { size });
    
    // Asumsi: Backend merespon dengan data item yang diupdate/ditambahkan
    // Contoh response.data: { status: true, item: { idCartItem: 123, name: '...', ... } }
    if (response.data && response.data.item) {
      const updatedItem = response.data.item;

      // ✅ Logika untuk update state secara lokal tanpa refetch
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => item.idCartItem === updatedItem.idCartItem
        );
        
        // Jika item sudah ada, ganti dengan yang baru (kuantitas terupdate)
        if (existingItemIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingItemIndex] = updatedItem;
          return newItems;
        } else {
          // Jika item baru, tambahkan ke dalam array
          return [...prevItems, updatedItem];
        }
      });
    } else {
      // Fallback: jika response tidak sesuai harapan, tetap lakukan refetch
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
      // Panggil API untuk membuat transaksi
      const response = await api.post(`/customers/${user.id}/checkout`);
      // Setelah checkout, panggil fetchCart untuk mengosongkan keranjang dari server
      await fetchCart();
      return response.data;
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      throw error;
    }
  };

  const cancelOrder = async (transactionId) => {
    if (!user?.id || !transactionId) throw new Error("Data tidak lengkap untuk pembatalan.");
    try {
      // Asumsi: Endpoint untuk membatalkan transaksi adalah seperti ini
      const response = await api.delete(`/customers/${user.id}/transactions/${transactionId}`);
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
        // Mengirim request PATCH dengan body yang benar
        await api.patch(`/customers/${user.id}/carts/stocks/${stockId}`, {
          itemQuantity: newQuantity,
        });
      } else {
        // Menghapus item jika kuantitas 0
        await api.delete(`/customers/${user.id}/carts/stocks/${stockId}`);
      }
      
      // Refresh data keranjang setelah berhasil
      await fetchCart();

    } catch (err) {
      console.error("Gagal update quantity:", err);
      alert(`Error: ${err.response?.data?.message || 'Gagal memperbarui item'}`);
    }
  };
  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };
  const fetchFavorites = async () => {
    if (!user?.id) {
      setFavoriteItems([]); // Kosongkan jika tidak ada user
      return;
    }
    try {
      // Asumsi: Endpoint untuk mengambil daftar favorit adalah seperti ini
      const res = await api.get(`/customers/${user.id}/favorites`);
      if (res.data && Array.isArray(res.data)) {
        setFavoriteItems(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = api.get("/products").then(res => setProducts(res.data));
    const fetchCartPromise = user?.id ? fetchCart() : Promise.resolve();
    // ✅ PANGGIL fetchFavorites saat user berubah
    const fetchFavoritesPromise = user?.id ? fetchFavorites() : Promise.resolve();

    Promise.all([fetchProducts, fetchCartPromise, fetchFavoritesPromise])
      .catch(error => console.error("Gagal memuat data awal:", error))
      .finally(() => setLoading(false));

  }, [user]);
  const addToFavorites = async (productId) => {
    if (!user) return;
    try {
      // Asumsi: Endpoint untuk menambah favorit adalah POST
      await api.post(`/products/${productId}/customer/${user.id}/favorites`);
      await fetchFavorites(); // Refresh daftar favorit setelah berhasil
    } catch (err) {
      console.error("Gagal menambahkan ke favorit:", err);
      alert("Gagal menambahkan item ke favorit.");
    }
  };
  const removeFromFavorites = async (productId) => {
    if (!user) return;
    try {
      // Gunakan endpoint yang Anda berikan
      await api.delete(`/products/${productId}/customer/${user.id}/favorites`);
      await fetchFavorites(); // Refresh daftar favorit setelah berhasil
    } catch (err) {
      console.error("Gagal menghapus dari favorit:", err);
      alert("Gagal menghapus item dari favorit.");
    }
  };
  
 
  
  // --- NILAI YANG DISEDIAKAN OLEH CONTEXT ---
  const contextValue = {
    // State
    user,
    token,
    products,
    cartItems,
    favoriteItems,
    loading,
    selectedProductId,
    checkoutData,
    currency,
    // Fungsi
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
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};