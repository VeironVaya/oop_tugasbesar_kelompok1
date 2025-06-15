import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Order = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // === GET TOKEN FROM LOCAL STORAGE ===
  const token = localStorage.getItem("token");
  console.log("Token for Order page:", token);

  useEffect(() => {
    if (!token) {
      // alert("Unauthorized: Please log in first.");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, [navigate, token]);

  // === FILTER ORDERS ===
  const filteredOrders = orders.filter((order) => {
    const id = String(order.idTransaction || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return id.includes(search);
  });

  // === UPDATE STATUS ===
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/v1/transactions/${id}`,
        null,
        {
          params: { paymentStatus: newStatus },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
          placeholder="Search by Transaction ID (e.g., 12345)"
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
        filteredOrders.map((order, index) => {
          const item = order.transactionItems?.[0];
          const stock = item?.stock;

          return (
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
                    <p>Customer ID: {order.idCustomer}</p>
                    <p>Total: Rp {order.totalPrice}</p>
                    <p>Status: {order.paymentStatus}</p>
                    <p>Date: {order.date}</p>
                    {/* <p>Size: {stock?.size || "N/A"}</p> */}
                    <p>Qty: {item?.quantity || "N/A"}</p>
                    {/* <p>Stock Qty: {stock?.stockQuantity || "N/A"}</p> */}
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
          );
        })
      )}
    </div>
  );
};

export default Order;
