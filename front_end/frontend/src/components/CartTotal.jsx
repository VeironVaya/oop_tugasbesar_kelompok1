import React from "react";
import Title from "./Title";
import { useShop } from "../context/ShopContext";

const CartTotal = () => {
  const { currency="Rp", getCartAmount } = useShop();
  const total = getCartAmount();
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {getCartAmount()}.00
          </p>
        </div>
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency} {getCartAmount() === 0 ? 0 : getCartAmount()}.00
          </b>
        </div>
      </div>
    </div>
  );
};
export default CartTotal;
