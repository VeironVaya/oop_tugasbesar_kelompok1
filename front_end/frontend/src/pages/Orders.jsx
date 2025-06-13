import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { checkoutData, products } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState(checkoutData);

  const handleCancel = (id) => {
    const confirm = window.confirm("Yakin ingin membatalkan pesanan ini?");
    if (!confirm) return;

    const updatedOrders = orders.filter((item) => item._id !== id);
    setOrders(updatedOrders);
    alert("Pesanan berhasil dibatalkan.");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">MY ORDERS</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">Tidak ada pesanan.</p>
      ) : (
        orders.map((order, idx) => {
          const product = products.find((p) => p._id === order._id);
          if (!product) return null;

          return (
            <div
              key={idx}
              className="border-b py-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded"
                />
                <div>
                  <p
                    onClick={() => navigate(`/checkout/${order._id}`)}
                    className="font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.quantity} &nbsp; Size: {order.size}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-red-600 mb-2">Unpaid</p>

                <button
                  onClick={() => handleCancel(order._id)}
                  className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
