import { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const [cartItems, setCartItems] = useState({});
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  // Simpan role user di localStorage
  useEffect(() => {
    localStorage.setItem("role", userRole);
  }, [userRole]);

  // Tambah ke favorit (hindari duplikat)
  const addToFavorites = (item) => {
    setFavoriteItems((prev) => {
      const exists = prev.some((fav) => fav._id === item._id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  // Hapus dari favorit
  const removeFromFavorites = (id) => {
    setFavoriteItems((prev) => prev.filter((item) => item._id !== id));
  };

  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    setCartItems,
    user,
    setUser,
    userRole,
    setUserRole,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
