import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const currency = "$";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    user,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    // Redirect ke login jika user belum login
    if (!user) {
      navigate("/login");
      return;
    }

    if (products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
        setSize("");

        // Cek apakah produk sudah difavoritkan
        const isFavorited = favoriteItems.some(
          (item) => item._id === product._id
        );
        setFavorited(isFavorited);
      } else {
        setProductData(null);
      }
    }
  }, [productId, products, user, navigate, favoriteItems]);

  const handleFavoriteToggle = () => {
    if (favorited) {
      removeFromFavorites(productData._id);
    } else {
      addToFavorites(productData);
    }
    setFavorited(!favorited);
  };

  if (!productData) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ------- Product Images ------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((img, index) => (
              <img
                src={img}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border rounded hover:opacity-80"
                onClick={() => setImage(img)}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>

          {/* ---------- Gambar Utama + Ikon favorite ---------- */}
          <div className="w-full sm:w-[80%] relative">
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <img
                src={favorited ? assets.heartfill_icon : assets.heart_icon}
                alt="Love"
                className="w-5 h-5"
              />
            </button>
            <img
              className="w-full h-auto rounded-md"
              src={image}
              alt="Product"
            />
          </div>
        </div>

        {/* ------- Product Info -------- */}
        <div className="flex-1">
          <div className="text-xs mb-2 inline-block bg-gray-200 px-2 py-1 rounded uppercase tracking-widest font-medium">
            {productData.subCategory}
          </div>

          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          {/* <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="star" className="w-4" />
            <img src={assets.star_icon} alt="star" className="w-4" />
            <img src={assets.star_icon} alt="star" className="w-4" />
            <img src={assets.star_icon} alt="star" className="w-4" />
            <img src={assets.star_dull_icon} alt="star dull" className="w-4" />
            <p className="pl-2 text-sm text-gray-500">(122)</p>
          </div> */}
          <p className="mt-5 text-3xl font-semibold">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-600 md:w-4/5 leading-relaxed">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-medium">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((s, index) => (
                <button
                  key={index}
                  onClick={() => setSize(s)}
                  className={`py-2 px-4 rounded-none text-sm border transition-all duration-300 ${
                    s === size
                      ? "border-orange-500 bg-orange-100 text-orange-600"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm mb-6 text-gray-600">
            Stock: {productData.stock ?? 0}
          </p>

          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={!size}
            className={`px-8 py-3 text-sm rounded font-medium ${
              size
                ? "bg-black text-white hover:bg-gray-800 transition"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            {size ? "ADD TO CART" : "SELECT SIZE FIRST"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
