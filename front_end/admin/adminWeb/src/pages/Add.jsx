import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Topwear");
  const [productPrice, setProductPrice] = useState("");
  const [size, setSize] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State for the image URL

  // Cloudinary Configuration
  const cloudinaryCloudName = "dim14penk"; // Replace with your Cloudinary Cloud Name
  const cloudinaryUploadPreset = "assetPBO"; // Replace with your unsigned upload preset name

  // Handler for stock quantity input, ensures only numbers
  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setStockQuantity(value);
  };

  // Handler for product price input, ensures valid decimal numbers
  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    setProductPrice(value);
  };

  // --- Cloudinary Upload Handler ---
  const openCloudinaryWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudinaryCloudName,
          uploadPreset: cloudinaryUploadPreset,
          sources: ["local", "url", "camera", "google_drive"], // Customize allowed sources
          folder: "product_images", // Optional: specify a folder in Cloudinary
          // You can add more options here, e.g., transformations, tags
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log(
              "Done uploading!!! Here is the image info: ",
              result.info
            );
            setImageUrl(result.info.secure_url); // Set the URL from Cloudinary
            alert("Image uploaded successfully!");
          } else if (error) {
            console.error("Cloudinary upload error:", error);
            alert("Image upload failed. Please try again.");
          }
        }
      );
      widget.open(); // Open the widget
    } else {
      alert(
        "Cloudinary widget script not loaded. Please check your index.html."
      );
    }
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive validation for all required fields
    if (
      !productName.trim() ||
      !productDescription.trim() ||
      !productPrice ||
      !size.trim() ||
      !stockQuantity ||
      !imageUrl.trim() // Ensure imageUrl is not empty after upload
    ) {
      alert("Please fill out all fields, including uploading an image.");
      return;
    }

    const numericPrice = parseFloat(productPrice);
    const numericStockQuantity = parseInt(stockQuantity, 10);

    // Validate numeric inputs
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Price must be a number greater than 0.");
      return;
    }

    if (isNaN(numericStockQuantity) || numericStockQuantity <= 0) {
      alert("Stock quantity must be a number greater than 0.");
      return;
    }

    // Construct the payload for the API request
    const payload = {
      name: productName,
      description: productDescription,
      price: numericPrice,
      category: productCategory,
      size: size.trim(),
      stockQuantity: numericStockQuantity,
      urlimage: imageUrl.trim(), // Use 'urlimage' to match your backend's expected field
    };

    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost:8080/api/v1/products";

    try {
      // Send the POST request to the backend API
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authentication
          "Content-Type": "application/json", // Explicitly set content type
        },
      });

      console.log("Product added successfully:", response.data);
      alert("Product has been added successfully!");
      navigate("/listitems"); // Navigate to the product list page
    } catch (error) {
      console.error("Error adding product:", error);
      let errorMessage = "Failed to add product. Please try again.";

      // --- START: HANYA TAMBAH BLOCK INI ---
      if (error.response && error.response.status === 401) {
        errorMessage = "Sesi Anda telah berakhir. Mohon login kembali."; // Pesan khusus untuk 401
        localStorage.removeItem("token"); // Hapus token yang tidak valid
        navigate("/login"); // Redirect ke halaman login
        return; // Hentikan eksekusi selanjutnya
      }
      // --- END: HANYA TAMBAH BLOCK INI ---

      if (error.response) {
        // Extract a more specific error message from the server response
        errorMessage = `Error: ${
          error.response.data.message || "The server returned an error."
        } (Status: ${error.response.status})`;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-10 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Product
        </h2>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <button
            type="button" // Important: type="button" to prevent form submission
            onClick={openCloudinaryWidget}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Upload Image
          </button>
          {imageUrl && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img
                src={imageUrl}
                alt="Product Preview"
                className="max-w-xs max-h-48 mx-auto border border-gray-300 rounded-md shadow-sm"
              />
              <p className="text-xs text-gray-500 mt-2 break-all">
                URL: {imageUrl}
              </p>
            </div>
          )}
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            placeholder="Type product name here"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-black focus:border-black transition duration-150 ease-in-out"
            required
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label
            htmlFor="productDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Description
          </label>
          <textarea
            id="productDescription"
            placeholder="Write product description here"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring focus:ring-black focus:border-black transition duration-150 ease-in-out"
            required
          ></textarea>
        </div>

        {/* Category and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="productCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Category
            </label>
            <select
              id="productCategory"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-black focus:border-black transition duration-150 ease-in-out"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Accessories</option>
              <option>Footwear</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Price
            </label>
            <input
              type="text"
              id="productPrice"
              inputMode="decimal"
              placeholder="Price must be > 0 (e.g., 99.99)"
              value={productPrice}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-black focus:border-black transition duration-150 ease-in-out"
              required
            />
          </div>
        </div>

        {/* Size and Initial Stock Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlB="sizeInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Size
            </label>
            <input
              id="sizeInput"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Enter a single size (e.g., S, M, L, XL)"
              className="w-full border-gray-300 border rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
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
              className="w-full border-gray-300 border rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black transition duration-150 ease-in-out"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          ADD PRODUCT
        </button>
      </form>
    </div>
  );
};

export default Add;
