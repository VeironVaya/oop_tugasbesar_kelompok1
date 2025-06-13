import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { assets } from "../assets/assets";
import axios from "axios";

const CATEGORY_MAP = {
  Topwear: "TopWare",
  Bottomwear: "BottomWare",
  Footwear: "Footwear",
  Accessories: "accessories",
};

const Collection = () => {
  const [filterProducts, setFilterProducts] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  // Toggle Subcategory Filter
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((a) => a !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Fetch API sesuai filter
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        let apiUrl = "http://localhost:8080/api/v1/products";
        // Jika ada filter kategori, kirim ?category=xxx (atau jika >1, bisa pakai array) 9NTAR SESUAIIN LAGI SETELAH QA PROCESS)
        if (subCategory.length === 1) {
          apiUrl += `?category=${encodeURIComponent(
            CATEGORY_MAP[subCategory[0]] || subCategory[0]
          )}`;
        }

        const res = await axios.get(apiUrl);
        let products = res.data.data || [];

        // Filter pencarian (search)
        if (showSearch && search) {
          products = products.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Filter multi subcategory di frontend (ini backend hanya support satu kategori di query???????)
        if (subCategory.length > 1) {
          products = products.filter((item) =>
            subCategory
              .map((cat) => CATEGORY_MAP[cat] || cat)
              .includes(item.category)
          );
        }

        setFilterProducts(products);
      } catch (err) {
        setFilterProducts([]);
        alert("Gagal mengambil data produk dari server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategory, search, showSearch]);

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
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Sub Category Filter Only */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Footwear", "Accessories"].map((cat) => (
              <p className="flex gap-2" key={cat}>
                <input
                  className="w-3"
                  value={cat}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(cat)}
                  type="checkbox"
                />{" "}
                {cat}{" "}
              </p>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearch(true);
            }}
          />
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.length === 0 ? (
              <p className="text-gray-500 col-span-full">Produk tidak ditemukan.</p>
            ) : (
              filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  id={item.id_product || item._id}
                  image={item.image}
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
