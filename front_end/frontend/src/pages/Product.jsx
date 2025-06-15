// === src/pages/Product.jsx (FIXED) ===

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext"; // ✅ UBAH: Gunakan hook useShop
import api from "../api/axiosConfig"; // ✅ TAMBAH: Impor instance api kita
import { assets } from "../assets/assets";

const currency = "Rp";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // ✅ UBAH: Ambil data dari useShop. setSelectedProductId tidak lagi dipakai di sini.
  const { user, addToCart, addToFavorites, removeFromFavorites } = useShop();

  const [productData, setProductData] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ UBAH: Logika utama untuk memuat data produk digabung dan disederhanakan
  useEffect(() => {
    // Hapus effect yang me-redirect, karena sudah ditangani oleh RequireAuth
    const loadProduct = async () => {
      // Pastikan ada productId dan user yang sudah login (dengan ID yang valid)
      if (!productId || !user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // ✅ UBAH: Gunakan 'api.get' dan 'user.id' yang benar
        const res = await api.get(
          `/products/${productId}/customer/${user.id}`
        );

        const data = res.data;

        if (data) { // Cukup periksa apakah data ada
          const stock = data.stocks?.[0] || {};
          setProductData({
            id: data.idProduct,
            stockId: stock.idStock,
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            isFavorite: data.isFavorite,
            size: stock.size || "-",
            stockQuantity: stock.stockQuantity || 0,
            image: "/default.jpg", // Ganti dengan data.image dari API jika ada
          });
          setFavorited(data.isFavorite || false);
        } else {
          console.error("Produk gagal dimuat:", data.message);
          setProductData(null);
        }
      } catch (err) {
        console.error("Error fetch product:", err);
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, user]); // Jalankan effect jika productId atau user berubah

  const handleFavoriteToggle = () => {
    if (!productData) return;
    if (favorited) {
      removeFromFavorites(productData.id);
    } else {
      addToFavorites(productData);
    }
    setFavorited(!favorited);
  };

  const handleAddToCart = async () => {
    if (!productData) return;
    try {
      // Pastikan fungsi addToCart di context Anda menerima argumen yang sesuai
      await addToCart(productData.stockId, productData.size);
      navigate("/cart");
    } catch (err) {
      console.error("Gagal add to cart:", err);
    }
  };

  if (loading) return <div className="text-center p-6">Loading product...</div>;
  if (!productData)
    return (
      <div className="text-center text-red-500 p-6">Produk tidak ditemukan atau gagal dimuat.</div>
    );

  // Bagian JSX di bawah ini tidak perlu diubah
  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 border-t-2">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 relative">
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
          >
            <img
              src={favorited ? assets.heartfill_icon : assets.heart_icon}
              alt="Favorite"
              className="w-5 h-5"
            />
          </button>
          <img
            src={productData.image}
            alt={productData.name}
            className="w-full rounded-md border"
          />
        </div>

        <div className="flex-1">
          <div className="text-xs bg-gray-200 inline-block px-2 py-1 rounded uppercase font-medium">
            {productData.category}
          </div>

          <h1 className="text-2xl font-semibold mt-2">{productData.name}</h1>
          <p className="text-3xl mt-4 font-bold">
            {currency} {productData.price.toLocaleString()}
          </p>

          <p className="mt-4 text-gray-700">{productData.description}</p>

          <div className="my-6">
            <p className="text-sm font-medium">Size</p>
            <div className="flex gap-2 mt-2">
              <button
                disabled
                className="py-2 px-4 border border-orange-500 bg-orange-100 text-orange-600 text-sm rounded"
              >
                {productData.size}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Stock: {productData.stockQuantity}
          </p>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-black text-white text-sm rounded"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;