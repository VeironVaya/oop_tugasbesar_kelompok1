// === src/pages/MyFavorite.jsx ===

import React from "react";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const MyFavorite = () => {
  const { favoriteItems, removeFromFavorites, loading } = useShop();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Favorite Items</h1>

      {loading ? (
        <p className="text-gray-500">Loading your favorite items...</p>
      ) : favoriteItems.length === 0 ? (
        <p className="text-gray-500">You don't have any favorite items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <div
              key={item.idProduct}
              className="border rounded-md p-4 shadow hover:shadow-md transition relative bg-white"
            >
              <Link to={`/product/${item.idProduct}`}>
                <img
                  src={
                    item.image && item.image.trim() !== ""
                      ? item.image
                      : "https://placehold.co/100x100/e0e0e0/777?text=No+Img"
                  }
                  alt={item.name || "Favorite product"}
                  className="w-full h-48 object-cover rounded mb-3"
                  onError={(e) => {
                    if (
                      e.currentTarget.src !==
                      "https://placehold.co/100x100/e0e0e0/777?text=No+Img"
                    ) {
                      e.currentTarget.src =
                        "https://placehold.co/100x100/e0e0e0/777?text=No+Img";
                    }
                  }}
                />
                <h2 className="text-lg font-medium text-black hover:text-blue-600">
                  {item.name}
                </h2>
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                {item.subCategory || item.category}
              </p>
              <p className="font-semibold text-black mt-2">
                Rp{item.price?.toLocaleString()}
              </p>
              <button
                onClick={() => removeFromFavorites(item.idProduct)}
                className="absolute top-2 right-2 p-1.5 bg-white border rounded-full hover:bg-gray-100"
              >
                <img
                  src={assets.bin_icon}
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
