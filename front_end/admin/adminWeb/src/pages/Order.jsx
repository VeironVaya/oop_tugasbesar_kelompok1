import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil semua transaksi dari API saat halaman dimuat
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/transactions"
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        alert("Gagal mengambil data transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter berdasarkan ID transaksi saja
  const filteredOrders = orders.filter((order) => {
    const id = order.idTransaction?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return id.includes(search);
  });

  // Update status pembayaran ke backend
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/v1/transactions/${id}`,
        null,
        { params: { paymentStatus: newStatus } }
      );

      const updatedOrders = orders.map((order) =>
        order.idTransaction === id
          ? { ...order, paymentStatus: newStatus }
          : order
      );
      setOrders(updatedOrders);
      alert("Status berhasil diubah.");
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal mengubah status pembayaran.");
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari ID transaksi (contoh: transaction-001)"
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading transaksi...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-500 mt-4">
          Tidak ada transaksi dengan ID tersebut.
        </p>
      ) : (
        filteredOrders.map((order, index) => (
          <Link
            to={`/order/${order.idTransaction}`}
            key={index}
            className="block border rounded-lg p-4 mb-4 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📦</div>
                <div>
                  <p className="font-semibold underline">
                    Id: {order.idTransaction}
                  </p>
                  <p>Name: {order.name}</p>
                  <p>Description: {order.description}</p>
                  <p>Category: {order.category}</p>
                  <p>Total: {order.totalPrice}</p>
                  <p>Date: {order.date}</p>
                </div>
              </div>

              <select
                value={order.paymentStatus}
                onClick={(e) => e.preventDefault()}
                onChange={(e) => {
                  e.preventDefault();
                  handleStatusChange(order.idTransaction, e.target.value);
                }}
                className="border rounded px-3 py-1 bg-white cursor-pointer"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Order;
