import { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    localStorage.setItem("role", userRole);
  }, [userRole]);

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
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
