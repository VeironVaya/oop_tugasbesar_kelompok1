// === src/pages/Checkout.jsx (Final) ===

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import api from "../api/axiosConfig";

const Checkout = () => {
  const { transactionId } = useParams();
  const { user, currency } = useShop();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !transactionId) {
      setLoading(false);
      return;
    }

    const fetchTransactionDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/customers/${user.id}/transactions/${transactionId}`
        );
        if (response.data) {
          setTransaction(response.data);
        }
      } catch (error) {
        console.error(`Gagal memuat detail transaksi ${transactionId}:`, error);
        alert("Gagal memuat detail pesanan.");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [user, transactionId, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-center">Loading transaction details...</div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Transaction Not Found</h2>
        <p className="text-gray-600">
          Tidak dapat menemukan detail pesanan yang Anda cari.
        </p>
        <Link
          to="/orders"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold">Order Detail</h2>
        <p className="text-sm text-gray-500">
          Transaction ID: {transaction.idTransaction}
        </p>
        <p className="text-sm text-gray-500">
          Date: {new Date(transaction.date).toLocaleDateString("id-ID")}
        </p>
        <p
          className={`text-lg font-bold mt-2 ${
            transaction.paymentStatus.toLowerCase() !== "paid"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          Status: {transaction.paymentStatus}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>

      {transaction.transactionItems?.map((item, idx) => (
        <div
          key={item.idCartItemTemp || idx}
          className="flex items-start gap-4 border-b py-4"
        >
          <img
            src={
              item.urlimage && item.urlimage.trim() !== ""
                ? item.urlimage
                : "https://placehold.co/100x120/e0e0e0/777?text=No+Img"
            }
            alt={item.name}
            className="w-20 h-24 object-cover rounded border"
          />

          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Category: {item.category}
            </p>
          </div>

          <div className="text-right">
            <p className="font-medium">
              {currency} {item.totalPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Qty: {item.quantity} | Size: {item.size}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right">
        <p className="text-gray-600">Grand Total</p>
        <p className="text-3xl font-bold">
          {currency} {transaction.totalPrice.toLocaleString()}
        </p>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/orders")}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Back to My Orders
        </button>
      </div>
    </div>
  );
};

export default Checkout;
