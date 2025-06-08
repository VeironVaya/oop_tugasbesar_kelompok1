import { Link } from "react-router-dom";
import { useState } from "react";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Simpan order ke state agar bisa diubah statusnya
  const [orders, setOrders] = useState([
    {
      id: "transaction-001",
      total: "113.000,-",
      date: "30-05-2025",
      status: "Unpaid",
      name: "Relaxed Fit Jacket",
      description: "Lightweight topwear for women",
      category: "Topwear",
    },
    {
      id: "transaction-002",
      total: "200.000,-",
      date: "01-06-2025",
      status: "Paid",
      name: "Denim Jeans",
      description: "Durable bottomwear for daily use",
      category: "Bottomwear",
    },
    {
      id: "transaction-003",
      total: "150.000,-",
      date: "02-06-2025",
      status: "Unpaid",
      name: "Running Shoes",
      description: "Comfortable footwear for sport",
      category: "Footwear",
    },
    {
      id: "transaction-004",
      total: "75.000,-",
      date: "03-06-2025",
      status: "Paid",
      name: "Sunglasses",
      description: "UV protection stylish accessories",
      category: "Accessories",
    },
  ]);

  // Handle perubahan status
  const handleStatusChange = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  // Filter berdasarkan search & category
  const filteredOrders = orders.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      order.name.toLowerCase().includes(lowerSearch) ||
      order.description.toLowerCase().includes(lowerSearch);
    const matchesCategory =
      categoryFilter === "All" || order.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 w-full">
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        >
          <option value="All">All Categories</option>
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {filteredOrders.map((order, index) => (
        <Link
          to={`/order/${order.id}`}
          key={index}
          className="block border rounded-lg p-4 mb-4 hover:bg-gray-100 transition"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📦</div>
              <div>
                <p className="font-semibold underline">Id: {order.id}</p>
                <p>Name: {order.name}</p>
                <p>Description: {order.description}</p>
                <p>Category: {order.category}</p>
                <p>Total: {order.total}</p>
                <p>Date: {order.date}</p>
              </div>
            </div>

            <select
              value={order.status}
              onClick={(e) => e.preventDefault()} // supaya link tidak langsung jalan
              onChange={(e) => {
                e.preventDefault();
                handleStatusChange(order.id, e.target.value);
              }}
              className="border rounded px-3 py-1 bg-white cursor-pointer"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </Link>
      ))}

      {filteredOrders.length === 0 && (
        <p className="text-gray-500 mt-4">
          No orders found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default Order;
