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
      // alert("Unauthorized: Please log in first.");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2000);
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
        // The API response directly gives us the order object, so we set it directly
        // The 'data' field of the response contains the actual transaction object
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to load transaction data:", error);
        alert("Cannot load transaction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, navigate, token]);

  if (loading) return <p className="p-6 text-gray-700">Loading transaction data...</p>;
  if (!order)
    return <p className="p-6 text-red-500">There is no transaction.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg font-sans">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-sm text-gray-600 hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Transaction ID: {order.idTransaction}
      </h2>
      <p className="mb-2 text-gray-700">
        <span className="font-semibold">Payment Status:</span>{" "}
        {order.paymentStatus}
      </p>

      <p className="mb-4 text-gray-700">
        <span className="font-semibold">Order Date:</span>{" "}
        {order.date}
      </p>

      <h3 className="text-lg font-semibold mb-3 text-gray-800">Items:</h3>
      {order.transactionItems && order.transactionItems.length > 0 ? (
        order.transactionItems.map((item, idx) => {
          // Adjusting access paths based on your JSON response
          const productName = item.name || "N/A";
          // Use 'urlimage' directly from the item, provide a placeholder if null
          const productImageUrl = item.urlimage || "https://via.placeholder.com/80";
          const itemSize = item.size || "N/A";
          // Your JSON doesn't provide stockQuantity for the item, so it will be N/A.
          // If you need stock quantity, your backend should include it in 'transactionItems'.
          const stockQuantity = "N/A"; // As per the provided JSON, stockQuantity is not available directly on transactionItems

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
                <p className="text-sm">Size: {itemSize}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
                
              </div>
              <p className="font-bold text-lg text-right text-gray-900">
                Subtotal: Rp.{item.totalPrice?.toLocaleString("id-ID")}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 italic">There is no items in this transaction.</p>
      )}

      <p className="mt-6 font-bold text-xl text-gray-900 border-t pt-4 border-gray-200">
        Total: Rp.{order.totalPrice?.toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default OrderDetail;