// === src/pages/Orders.jsx (Tampilan Disesuaikan) ===

import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

const Orders = () => {
  const { user, cancelOrder } = useShop(); 
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect untuk mengambil riwayat transaksi (tidak berubah)
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/customers/${user.id}/transactions`);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Gagal memuat riwayat transaksi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  // handleCancelClick tidak berubah
  const handleCancelClick = async (transactionId) => {
    if (window.confirm("Yakin ingin membatalkan pesanan ini? Aksi ini tidak bisa diurungkan.")) {
      try {
        await cancelOrder(transactionId);
        setOrders(prevOrders => prevOrders.filter(order => order.idTransaction !== transactionId));
        alert("Pesanan berhasil dibatalkan.");
      } catch (error) {
        alert("Gagal membatalkan pesanan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">MY ORDERS</h2>

      {loading ? (
        <p>Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">Anda belum memiliki pesanan.</p>
      ) : (
        orders.map((order) => (
          <div key={order.idTransaction} className="border-b py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={order.productImage || "/default.jpg"} alt={order.productName} className="w-20 h-24 object-cover rounded" />
              <div>
                <p className="font-semibold">{order.productName}</p>
                <p className="text-sm text-gray-600">ID: {order.idTransaction}</p>
                
                {/* ✅ UBAH BAGIAN INI: Tampilkan tanggal, bukan kuantitas & ukuran */}
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.date).toLocaleDateString("id-ID")}
                </p>

                <Link to={`/checkout/${order.idTransaction}`} className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                  See Order Details
                </Link>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-semibold mb-2 ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                {order.paymentStatus}
              </p>
              
              {order.paymentStatus === 'UNPAID' && (
                <button
                  onClick={() => handleCancelClick(order.idTransaction)}
                  className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;