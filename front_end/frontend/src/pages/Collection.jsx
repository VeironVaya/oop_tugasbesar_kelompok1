// === src/pages/Collection.jsx (Dengan Filter Kategori) ===

import React, { useState } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { useShop } from "../context/ShopContext";

// Definisikan kategori dan mapping jika nama di API berbeda
const categoryList = ["Topwear", "Bottomwear", "Footwear", "Accessories"];

const Collection = () => {
  const { products, loading, error } = useShop();

  // State untuk menyimpan kategori yang sedang dipilih
  const [selectedCategory, setSelectedCategory] = useState("");
  // State untuk mengontrol tampilan filter di mode mobile
  const [showFilter, setShowFilter] = useState(false);
  // State untuk input pencarian
  const [search, setSearch] = useState("");

  // Logikanya: jika kategori yang diklik sama dengan yang sudah aktif, nonaktifkan.
  // Jika berbeda, ganti dengan yang baru. Ini memastikan hanya satu yang bisa aktif.
  const handleCheckbox = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(""); // Batalkan pilihan jika diklik lagi
    } else {
      setSelectedCategory(category); // Pilih kategori baru
    }
  };

  // --- Logika untuk memfilter produk ---
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true; // Jika tidak ada kategori dipilih, loloskan semua

    const matchesSearch = search
      ? product.name.toLowerCase().includes(search.toLowerCase())
      : true; // Jika tidak ada pencarian, loloskan semua

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* --- BAGIAN FILTER (SISI KIRI) --- */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center justify-between cursor-pointer sm:cursor-default"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${
              showFilter ? "rotate-180" : ""
            }`}
            src="/dropdown_icon.png" // Ganti dengan path asset Anda
            alt="toggle filter"
          />
        </p>

        {/* Kotak Filter Kategori */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {categoryList.map((categoryName) => (
              <label
                className="flex items-center gap-2 cursor-pointer"
                key={categoryName}
              >
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  // 'checked' akan true hanya jika state cocok dengan nama kategori ini
                  checked={selectedCategory === categoryName}
                  // 'onChange' memanggil handler kita
                  onChange={() => handleCheckbox(categoryName)}
                  style={{ accentColor: "black" }}
                />
                <span
                  style={{
                    color:
                      selectedCategory === categoryName ? "black" : "#6b7280",
                    fontWeight:
                      selectedCategory === categoryName ? "600" : "normal",
                  }}
                >
                  {categoryName}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* --- BAGIAN PRODUK (SISI KANAN) --- */}
      <div className="flex-1">
        <div className="text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
        </div>

        {/* Input Pencarian */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products by name..."
            className="border px-3 py-2 rounded w-full max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tampilan Grid Produk */}
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                Produk tidak ditemukan.
              </p>
            ) : (
              filteredProducts.map((item) => (
                <ProductItem
                  key={item.idProduct}
                  id={item.idProduct}
                  name={item.name}
                  price={item.price}
                  image={
                    item.urlimage && item.urlimage.trim() !== ""
                      ? item.urlimage
                      : "https://placehold.co/100x100/e0e0e0/777?text=No+Img"
                  }
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
