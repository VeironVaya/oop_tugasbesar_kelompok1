import { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null); // ✅ Untuk checkout

  useEffect(() => {
    localStorage.setItem("role", userRole);
  }, [userRole]);

  // ====================
  // Cart & Favorites
  // ====================
  const addToFavorites = (item) => {
    setFavoriteItems((prev) => {
      const exists = prev.some((fav) => fav._id === item._id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id) => {
    setFavoriteItems((prev) => prev.filter((item) => item._id !== id));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
  };

  // ====================
  // Cart Summary
  // ====================
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  // ====================
  // Context Value
  // ====================
  const value = {
    currency,
    products,
    cartItems,
    setCartItems,
    user,
    setUser,
    userRole,
    setUserRole,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    checkoutData, // ✅ akses checkout
    setCheckoutData, // ✅ setter checkout
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
