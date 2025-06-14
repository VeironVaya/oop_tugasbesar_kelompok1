import React, { useState } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { useShop } from "../context/ShopContext";

const CATEGORY_MAP = {
  Topwear: "TopWare",
  Bottomwear: "BottomWare",
  Footwear: "Footwear",
  Accessories: "accessories",
};

const categoryList = ["Topwear", "Bottomwear", "Footwear", "Accessories"];

const Collection = () => {
  const { products, loading, error } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  // FILTER PRODUK
  let filterProducts = products;
  if (selectedCategory) {
    filterProducts = filterProducts.filter(
      (item) =>
        item.category &&
        item.category.toLowerCase() ===
          (CATEGORY_MAP[selectedCategory] || selectedCategory).toLowerCase()
    );
  }
  if (search) {
    filterProducts = filterProducts.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Checkbox seperti radio: hanya satu bisa aktif
  const handleCheckbox = (cat) => {
    setSelectedCategory(selectedCategory === cat ? "" : cat);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? " rotate-90" : ""}`}
            src="/dropdown_icon.png" // Ganti dengan path asset dropdown-icon kamu
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categoryList.map((cat) => (
              <label
                className="flex items-center gap-2 cursor-pointer"
                key={cat}
              >
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  checked={selectedCategory === cat}
                  onChange={() => handleCheckbox(cat)}
                  style={{
                    accentColor: selectedCategory === cat ? "#1a1a1a" : "#bdbdbd",
                  }}
                />
                <span
                  style={{
                    color: selectedCategory === cat ? "#1a1a1a" : "#bdbdbd",
                    fontWeight: selectedCategory === cat ? "bold" : "normal",
                  }}
                >
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
        </div>

        {/* Pencarian */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="border px-3 py-2 rounded w-full max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                Produk tidak ditemukan.
              </p>
            ) : (
              filterProducts.map((item) => (
                <ProductItem
                  key={item.id_product || item._id}
                  id={item.id_product || item._id}
                  image={
                    item.image && item.image.length > 0
                      ? Array.isArray(item.image)
                        ? item.image
                        : [item.image]
                      : ["/default.jpg"] // fallback default image jika benar-benar kosong
                  }
                  name={item.name}
                  price={item.price}
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
