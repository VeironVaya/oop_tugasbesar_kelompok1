import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const MyFavorite = () => {
  // Ambil id_customer dari localStorage (sudah disimpan saat login)
  const id_customer = localStorage.getItem("id_customer");

  const [favoriteItems, setFavoriteItems] = useState([]);

  // Fetch data favorite ketika komponen pertama kali render
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!id_customer) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/customers/${id_customer}/favorites`
        );
        setFavoriteItems(res.data.data || []);
      } catch (err) {
        setFavoriteItems([]);
        alert("Gagal mengambil data favorite.");
      }
    };
    fetchFavorites();
  }, [id_customer]);

  // Handler remove favorite, langsung fetch ke backend
  const removeFromFavorites = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/products/${productId}/customer/${id_customer}/favorites`
      );
      setFavoriteItems((prev) =>
        prev.filter(
          (item) =>
            String(item.id_product || item._id) !== String(productId)
        )
      );
    } catch (err) {
      alert("Gagal menghapus dari favorite.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Favorite Items</h1>

      {favoriteItems.length === 0 ? (
        <p className="text-gray-500">You don't have any favorite items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <div
              key={item.id_product || item._id}
              className="border rounded-md p-4 shadow-sm relative bg-white"
            >
              <img
                src={item.image?.[0] || ""}
                alt={item.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p className="text-gray-600">{item.subCategory}</p>
              <p className="text-black font-semibold mt-2">${item.price}</p>
              <button
                onClick={() =>
                  removeFromFavorites(item.id_product || item._id)
                }
                className="absolute top-2 right-2"
              >
                <img
                  src={assets.bin_icon}
                  alt="Remove"
                  className="w-5 h-5 hover:opacity-70"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorite;
