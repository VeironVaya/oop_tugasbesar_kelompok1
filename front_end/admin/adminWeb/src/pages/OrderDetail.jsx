import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data detail transaksi dari API
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/transactions/${id}`
        );
        setOrder(res.data);
      } catch (error) {
        console.error("Gagal mengambil detail transaksi:", error);
        alert("Tidak dapat mengambil data transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <p className="p-6">Memuat data transaksi...</p>;
  if (!order)
    return <p className="p-6 text-red-500">Transaksi tidak ditemukan.</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Kembali ke daftar pesanan
      </button>

      <h2 className="font-semibold mb-2">ID: {order.idTransaction}</h2>
      <p className="mb-2">
        Status:
        <select
          value={order.paymentStatus}
          disabled
          className="border rounded px-2 py-1 ml-2"
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
      </p>

      <p className="mb-4">Tanggal Pesanan: {order.date}</p>

      {order.transactionItems && order.transactionItems.length > 0 ? (
        order.transactionItems.map((item, idx) => (
          <div key={idx} className="flex items-center border p-4 rounded mb-2">
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <p>{item.name}</p>
              <p>{item.gender}</p>
            </div>
            <p>Rp.{item.price.toLocaleString("id-ID")}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Tidak ada item dalam transaksi ini.</p>
      )}

      <p className="mt-4 font-semibold">
        Total: Rp.{order.totalPrice?.toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default OrderDetail;
