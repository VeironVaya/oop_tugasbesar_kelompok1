import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Topware");
  const [productPrice, setProductPrice] = useState("");
  const [size, setSize] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // 🆕 Added image URL

  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setStockQuantity(value);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    setProductPrice(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productName.trim() ||
      !productDescription.trim() ||
      !productPrice ||
      !size.trim() ||
      !stockQuantity ||
      !imageUrl.trim()
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const numericPrice = parseFloat(productPrice);
    const numericStockQuantity = parseInt(stockQuantity, 10);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Price must be a number greater than 0.");
      return;
    }

    if (isNaN(numericStockQuantity) || numericStockQuantity <= 0) {
      alert("Stock quantity must be a number greater than 0.");
      return;
    }

    const payload = {
      name: productName,
      description: productDescription,
      price: numericPrice,
      category: productCategory,
      size: size.trim(),
      stockQuantity: numericStockQuantity,
      imageUrl: imageUrl.trim(), // 🆕 Include image URL in payload
    };

    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost:8080/api/v1/products";

    try {
      await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // 🛡️ Use token for auth
        },
      });
      alert("Product has been added successfully!");
      navigate("/listitems");
    } catch (error) {
      console.error("Error adding product:", error);
      let errorMessage = "Failed to add product. Please try again.";
      if (error.response) {
        errorMessage = `Error: ${
          error.response.data.message || "The server returned an error."
        } (Status: ${error.response.status})`;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-10 rounded-lg shadow-md"
      >
        {/* 🆕 Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-black"
            required
          />
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product name
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-black"
            required
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product description
          </label>
          <textarea
            placeholder="Write content here"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring focus:ring-black"
            required
          ></textarea>
        </div>

        {/* Category and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product category
            </label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option>Topware</option>
              <option>Bottomware</option>
              <option>Accessories</option>
              <option>Footwear</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Price
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Price must be > 0"
              value={productPrice}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Size and Initial Stock Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="sizeInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Size
            </label>
            <input
              id="sizeInput"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Enter a single size (e.g., S, M, L)"
              className="w-full border-gray-300 border rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="stockQuantityInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Initial Stock Quantity
            </label>
            <input
              id="stockQuantityInput"
              type="text"
              inputMode="numeric"
              value={stockQuantity}
              onChange={handleQuantityChange}
              placeholder="Quantity must be > 0"
              className="w-full border-gray-300 border rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-32 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
