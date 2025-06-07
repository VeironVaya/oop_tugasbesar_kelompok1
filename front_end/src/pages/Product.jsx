import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";image
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const found = products.find((item) => item._id === productId);
      if (found) {
        setProductData(found);
        setImage(found.image[0]);
        setSize("");
      } else {
        setProductData(null);
      }
    }
  }, [productId, products]);

  if (!productData) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ------- Product Images ------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border rounded hover:opacity-80"
                onClick={() => setImage(imgUrl)}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>

          {/* ---------- Main Image + Favorite Icon ---------- */}
          <div className="w-full sm:w-[80%] relative">
            <button
              onClick={() => setFavorited(!favorited)}
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

        {/* ------- Product Info ------- */}
        <div className="flex-1">
          {/* Subcategory Badge */}
          {productData.subCategory && (
            <div className="text-xs mb-2 inline-block bg-gray-200 px-2 py-1 rounded uppercase tracking-widest font-medium">
              {productData.subCategory}
            </div>
          )}

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

          {/* Select Size */}
          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-medium">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((s, index) => (
                <button
                  key={index}
                  onClick={() => setSize(s)}
                  className={`py-2 px-4 rounded-md text-sm border transition-all duration-300 ${
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

          {/* Stock Info (if available) */}
          {productData.stock != null && (
            <p className="text-sm mb-6 text-gray-600">
              Stock: {productData.stock}
            </p>
          )}

          {/* Stok */}
          <p className="text-sm mb-6 text-gray-600">
            Stock: {productData.stock ?? 0}
          </p>

          {/* Add to Cart */}
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
          

          {/* Extra Info */}
          {/* <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div> */}
        </div>
      </div>

      {/* Description / Reviews Tabs (optional)
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals
            can showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div> */}

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
