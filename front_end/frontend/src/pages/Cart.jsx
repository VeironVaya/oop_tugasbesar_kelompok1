import React from "react";
import Title from "../components/Title";
import { useShop } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    setCheckoutData,
    loading, // loading dari context
  } = useShop();

  const navigate = useNavigate();

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
              const productData =
                item.product ||
                products.find(
                  (product) =>
                    String(product.id_product) === String(item.id_product)
                );

              if (!productData) return null;

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20"
                      src={
                        productData.image
                          ? Array.isArray(productData.image)
                            ? productData.image[0]
                            : productData.image
                          : ""
                      }
                      alt=""
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {productData.price}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          productData.id_product,
                          item.size,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-2 py-1 border rounded text-lg"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          productData.id_product,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="px-2 py-1 border rounded text-lg"
                    >
                      +
                    </button>
                  </div>

                  <img
                    onClick={() =>
                      updateQuantity(
                        productData.id_product,
                        item.size,
                        0
                      )
                    }
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt=""
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
              onClick={() => {
                setCheckoutData(cartItems);
                navigate("/orders");
              }}
              className="bg-black text-white text-sm my-8 px-8 py-3"
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
