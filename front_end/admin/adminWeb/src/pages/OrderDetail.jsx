import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // === GET TOKEN ===
  const token = localStorage.getItem("token");
  console.log("Token for OrderDetail page:", token);

  useEffect(() => {
    if (!token) {
      // Use a custom modal or message box instead of alert()
      // For now, retaining alert() as per the previous pattern, but it's a candidate for improvement.
      alert("Unauthorized: Please log in first.");
      navigate("/login");
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/transactions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(res.data);
      } catch (error) {
        console.error("Gagal mengambil detail transaksi:", error);
        // Use a custom modal or message box instead of alert()
        alert("Tidak dapat mengambil data transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, navigate, token]);

  if (loading) return <p className="p-6 text-gray-700">Memuat data transaksi...</p>;
  if (!order)
    return <p className="p-6 text-red-500">Transaksi tidak ditemukan.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg font-sans">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-sm text-gray-600 hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke daftar pesanan
      </button>

      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        ID Transaksi: {order.idTransaction}
      </h2>
      <p className="mb-2 text-gray-700">
        <span className="font-semibold">Status Pembayaran:</span>{" "}
        {order.paymentStatus} {/* Display status as text */}
      </p>

      <p className="mb-4 text-gray-700">
        <span className="font-semibold">Tanggal Pesanan:</span>{" "}
        {order.date}
      </p>

      <h3 className="text-lg font-semibold mb-3 text-gray-800">Item Transaksi:</h3>
      {order.transactionItems && order.transactionItems.length > 0 ? (
        order.transactionItems.map((item, idx) => {
          const stock = item.stock || {};
          // Assuming product details are nested under stock or a similar structure within transactionItems
          const productName = item.product?.name || "N/A"; // Access product name
          const productImageUrl = item.product?.urlimage || "https://via.placeholder.com/80"; // Access product image URL

          return (
            <div
              key={idx}
              className="flex items-center border border-gray-200 p-4 rounded-lg mb-3 bg-gray-50"
            >
              <img
                src={productImageUrl}
                alt={productName}
                className="w-20 h-20 object-cover rounded-md mr-4 shadow-sm"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80'; }}
              />
              <div className="flex-1 text-gray-700">
                <p className="font-semibold text-lg">{productName}</p>
                <p className="text-sm">Ukuran: {stock.size || "N/A"}</p>
                <p className="text-sm">Jumlah: {item.quantity}</p>
                <p className="text-sm">Stok Tersisa: {stock.stockQuantity ?? "N/A"}</p>
              </div>
              <p className="font-bold text-lg text-right text-gray-900">
                Subtotal: Rp.{item.totalPrice?.toLocaleString("id-ID")}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 italic">Tidak ada item dalam transaksi ini.</p>
      )}

      <p className="mt-6 font-bold text-xl text-gray-900 border-t pt-4 border-gray-200">
        Total Pembayaran: Rp.{order.totalPrice?.toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default OrderDetail;