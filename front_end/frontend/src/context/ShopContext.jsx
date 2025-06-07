import { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify"; // ✅ penting
import { useNavigate } from "react-router-dom"; // ✅ untuk navigate

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  // const delivery_fee = 10;

  const [cartItems, setCartItems] = useState({});
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("role", userRole);
  }, [userRole]);

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
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const value = {
    currency,
    // delivery_fee,
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
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
