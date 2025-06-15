// === src/pages/MyFavorite.jsx (Tokenized & Compatible) ===

import React from "react";
import { assets } from "../assets/assets";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";

const MyFavorite = () => {
  // Ambil data dan fungsi dari context. 'favoriteItems' sekarang berisi data dari server.
  const { favoriteItems, removeFromFavorites, loading } = useShop();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Favorite Items</h1>

      {loading ? (
        <p className="text-gray-500">Loading your favorite items...</p>
      ) : favoriteItems.length === 0 ? (
        <p className="text-gray-500">You don't have any favorite items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <div
              // ✅ Gunakan idProduct yang konsisten sebagai key
              key={item.idProduct}
              className="border rounded-md p-4 shadow-sm relative bg-white flex flex-col justify-between"
            >
              <Link to={`/product/${item.idProduct}`}>
                <img
                  src={item.image || "/default.jpg"}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
                />
                <h2 className="text-lg font-medium hover:text-blue-600">{item.name}</h2>
              </Link>

              <div>
                <p className="text-gray-600">{item.subCategory || item.category}</p>
                <p className="text-black font-semibold mt-2">
                  Rp{item.price?.toLocaleString()}
                </p>
              </div>

              <button
                // ✅ Panggil removeFromFavorites dengan idProduct
                onClick={() => removeFromFavorites(item.idProduct)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100"
              >
                <img
                  src={assets.bin_icon} // Ganti dengan ikon 'X' atau 'un-favorite' jika perlu
                  alt="Remove from favorites"
                  className="w-5 h-5"
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