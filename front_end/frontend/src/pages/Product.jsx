// === src/pages/Product.jsx (UPDATED with Multiple Sizes Support) ===

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import api from "../api/axiosConfig";
import { assets } from "../assets/assets";

const currency = "Rp";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { user, addToCart, addToFavorites, removeFromFavorites } = useShop();

  const [productData, setProductData] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStockId, setSelectedStockId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId || !user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/products/${productId}/customer/${user.id}`);
        const data = res.data;

        if (data) {
          const imageUrl =
            data.urlimage && data.urlimage.trim() !== ""
              ? data.urlimage
              : "https://placehold.co/600x600/e0e0e0/777?text=No+Img";

          const sizes = data.stocks || [];

          setProductData({
            id: data.idProduct,
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            isFavorite: data.isFavorite,
            image: imageUrl,
            stockQuantity: sizes.reduce(
              (acc, s) => acc + (s.stockQuantity || 0),
              0
            ),
          });

          setAvailableSizes(sizes);
          if (sizes.length > 0) {
            setSelectedSize(sizes[0].size);
            setSelectedStockId(sizes[0].idStock);
          }

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
  }, [productId, user]);

  const handleFavoriteToggle = () => {
    if (!productData) return;
    if (favorited) {
      removeFromFavorites(productData.id);
    } else {
      addToFavorites(productData.id);
    }
    setFavorited(!favorited);
  };

  const handleSizeSelect = (size, stockId) => {
    setSelectedSize(size);
    setSelectedStockId(stockId);
  };

  const handleAddToCart = async () => {
    if (!productData || !selectedStockId) return;
    try {
      await addToCart(selectedStockId, selectedSize);
      navigate("/cart");
    } catch (err) {
      console.error("Gagal add to cart:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center p-6 text-gray-500">Loading product...</div>
    );

  if (!productData)
    return (
      <div className="text-center text-red-500 p-6">
        Produk tidak ditemukan atau gagal dimuat.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 border-t-2">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 relative">
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:scale-105 transition-transform"
          >
            <img
              src={favorited ? assets.heartfill_icon : assets.heart_icon}
              alt="Favorite"
              className="w-5 h-5"
            />
          </button>
          <img
            src={productData.image}
            alt={productData.name || "Product Image"}
            className="w-full h-[400px] object-cover rounded-md border"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x600/e0e0e0/777?text=No+Img";
            }}
          />
        </div>

        <div className="flex-1">
          <div className="text-xs bg-gray-200 inline-block px-2 py-1 rounded uppercase font-medium tracking-wider">
            {productData.category}
          </div>

          <h1 className="text-2xl font-semibold mt-2">{productData.name}</h1>
          <p className="text-3xl mt-4 font-bold text-gray-800">
            {currency} {productData.price.toLocaleString()}
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {productData.description}
          </p>

          <div className="my-6">
            <p className="text-sm font-medium text-gray-700">Size</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {availableSizes.map((stock) => (
                <button
                  key={stock.idStock}
                  onClick={() => handleSizeSelect(stock.size, stock.idStock)}
                  className={`py-2 px-4 border rounded text-sm transition-colors ${
                    selectedSize === stock.size
                      ? "bg-orange-500 text-white border-orange-600"
                      : "bg-white text-orange-600 border-orange-400"
                  }`}
                >
                  {stock.size}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Total Stock: {productData.stockQuantity}
          </p>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
