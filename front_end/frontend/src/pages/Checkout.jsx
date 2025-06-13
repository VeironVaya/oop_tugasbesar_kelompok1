import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Checkout = () => {
  const { checkoutData, products, currency } = useContext(ShopContext);

  if (!checkoutData || checkoutData.length === 0) {
    return (
      <div className="px-6 md:px-20 py-10 text-center">
        <h2 className="text-xl font-semibold">Tidak ada data order.</h2>
        <p>Silakan lakukan checkout dari halaman cart terlebih dahulu.</p>
      </div>
    );
  }

  const totalHarga = checkoutData.reduce((total, item) => {
    const product = products.find((p) => p._id === item._id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="px-6 md:px-20 py-10">
      <div className="text-2xl text-center pt-4 border-t mb-6">
        <Title text1="MY" text2="ORDER" />
      </div>

      <div className="mb-6 text-gray-700">
        <p>
          <b>Tanggal Transaksi:</b> {new Date().toLocaleDateString("id-ID")}
        </p>
        <p>
          <b>Status Pembayaran:</b> <span className="text-red-600">UNPAID</span>
        </p>
      </div>

      <div className="grid gap-5">
        {checkoutData.map((item) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={`${item._id}-${item.size}`}
              className="border p-5 rounded-lg shadow-md bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md"
              />

              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <div className="text-sm mt-2 flex gap-6">
                <p>Ukuran: {item.size}</p>
                <p>Jumlah: {item.quantity}</p>
                <p>
                  Subtotal: {currency}
                  {(product.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-6 border rounded-lg bg-gray-100 text-lg flex justify-between">
        <span>Total Harga:</span>
        <span className="text-blue-600">
          {currency}
          {totalHarga.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
};

export default Checkout;
