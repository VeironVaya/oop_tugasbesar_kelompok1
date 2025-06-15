// === src/pages/Cart.jsx ===

import React, { useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useShop } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  // ✅ PERBAIKAN: Tambahkan 'loading' dan semua fungsi yang dibutuhkan di sini
  const { 
    cartItems, 
    updateQuantity, 
    getCartAmount, // Anda juga memerlukan ini untuk CartTotal
    currency, 
    loading, 
    user, 
    handleCheckout 
  } = useShop();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onCheckoutClick = async () => {
    try {
      await handleCheckout();
      alert("Checkout berhasil! Pesanan Anda telah dibuat.");
      navigate("/orders");
    } catch (error) {
      alert(error.message || "Terjadi kesalahan saat checkout.");
    }
  };

  // Sisa kode di bawah ini sudah benar dan tidak perlu diubah
  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {loading ? (
        <p>Loading cart ...</p>
      ) : (
        <div>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart kosong.</p>
          ) : (
            cartItems.map((item, index) => {
              const idToUpdate = item.stockId || item.productId;

              return (
                <div
                  key={item.idCartItem || index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20"
                      src={item.image || "/default.jpg"}
                      alt={item.name}
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {item.price?.toLocaleString()}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateQuantity(idToUpdate, item.quantity - 1)}
                      className="px-2 py-1 border rounded text-lg"
                    > - </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(idToUpdate, item.quantity + 1)}
                      className="px-2 py-1 border rounded text-lg"
                    > + </button>
                  </div>

                  <img
                    onClick={() => updateQuantity(idToUpdate, 0)}
                    className="w-4 mr-4 sm:w-5 cursor-pointer justify-self-end"
                    src={assets.bin_icon}
                    alt="Delete"
                  />
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={onCheckoutClick}
              className="bg-black text-white text-sm my-8 px-8 py-3"
              disabled={cartItems.length === 0}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;