import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EditDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Get token
  console.log("Token:", token); // Log token for debugging

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState(""); // New state for image URL

  useEffect(() => {
    // Check for token first, handle unauthorized access
    if (!token) {
      setError("Unauthorized. Please log in to edit product details.");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const productData = response.data;
        if (!productData.stocks) {
          productData.stocks = [];
        }

        // Ensure category is never empty and set default if needed
        if (!productData.category || productData.category.trim() === "") {
          productData.category = "TopWear"; // Set a default category
        }

        // Set the image URL state from fetched data (prioritize urlimage based on previous discussion)
        setProductImageUrl(productData.urlimage || productData.imageUrl || "");

        console.log("Fetched product data:", productData); // Debug log
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        // Similar error handling as AddStock component
        if (err.response && err.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError(
            "Failed to fetch product details. The product may not exist or an error occurred."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && productId !== "undefined") {
      fetchProductById();
    } else {
      setError("No product ID was provided in the URL.");
      setIsLoading(false);
    }
  }, [productId, token, navigate]); // Add navigate to dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value); // Debug log

    if (name === "imageUrl") { // Handle the new image URL input separately
      setProductImageUrl(value);
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!product) {
      alert("Product data not loaded"); // Using alert, as per previous pattern. Consider a modal.
      return;
    }

    // Comprehensive validation
    const requiredFields = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category, // Use product.category directly for validation
    };

    const missingFields = Object.keys(requiredFields).filter((field) => {
      const value = requiredFields[field];
      const isEmpty = !value || value.toString().trim() === "";
      return isEmpty;
    });

    if (missingFields.length > 0) {
      const message = `Please fill in the following required fields: ${missingFields.join(
        ", "
      )}.`;
      alert(message);
      return;
    }

    // Validate price and ensure it's a number > 0
    const numericPrice = parseFloat(product.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Product Price must be a number greater than 0.");
      return;
    }

    // Create update data with the correct backend field names
    const updatedData = {
      name: (product.name || "").toString().trim(),
      description: (product.description || "").toString().trim(),
      price: numericPrice,
      category: (product.category || "").toString().trim(),
      urlimage: (productImageUrl || "").toString().trim(), // Use productImageUrl and backend's expected field name 'urlimage'
    };

    // Remove any undefined or empty string values that are not part of the backend schema
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined || updatedData[key] === null) {
        delete updatedData[key];
      }
    });

    // Final safety check for category
    if (!updatedData.category || updatedData.category === "") {
      alert(
        "CRITICAL: Category is still empty after processing. Please refresh and try again."
      );
      return;
    }

    try {
      // PATCH request to update product details.
      // Assuming the correct API endpoint for updating product details is /api/v1/products/{productId}
      const response = await axios.patch(
        `http://localhost:8080/api/v1/products/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Update successful:", response.data);
      alert("Product updated successfully!");
      navigate("/listitems");
    } catch (err) {
      console.error("=== ERROR DETAILS ===");
      console.error("Full error object:", err);
      console.error(
        "Request URL:",
        `http://localhost:8080/api/v1/products/${productId}`
      );
      console.error(
        "Request data that was sent:",
        JSON.stringify(updatedData, null, 2)
      );
      console.error("Request headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      console.error("=== ERROR DETAILS END ===");

      let errorMessage = "Failed to update product. Please try again.";
      if (err.response) {
        const serverMessage =
          err.response.data.message || JSON.stringify(err.response.data);
        errorMessage = `Update failed. Server says: ${serverMessage} (Status: ${err.response.status})`;
      } else if (err.request) {
        errorMessage = "Update failed. No response from the server. Is it running?";
      } else {
        errorMessage = `Update failed. Error: ${err.message}`;
      }
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 font-semibold text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600">Product Not Found</h2>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Back to Product List
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg font-sans">
      <Link
        to="/"
        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to product list
      </Link>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={productImageUrl || "https://placehold.co/400x400/e0e0e0/777?text=No+Image"} // Use productImageUrl state for display
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x400/e0e0e0/777?text=No+Image";
              }}
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="name"
                value={product.name || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description || ""}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="number" // Using type="number" here is fine for direct numerical input
                id="price"
                name="price"
                value={product.price || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={product.category || ""}
                onChange={(e) => {
                  console.log("Category dropdown changed to:", e.target.value);
                  handleInputChange(e);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required
              >
                <option value="">Select a category</option>
                <option value="BottomWear">BottomWear</option>
                <option value="FootWear">FootWear</option>
                <option value="TopWear">TopWear</option>
                <option value="Accessories">Accessories</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current category:{" "}
                <span className="font-semibold">
                  {product.category || "None selected"}
                </span>
                {!product.category && (
                  <span className="text-red-500 ml-2">⚠ Required!</span>
                )}
              </p>
            </div>
            {/* New Input for Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Image URL
              </label>
              <input
                type="url" // Use type="url" for better browser validation hints
                id="imageUrl"
                name="imageUrl" // This name will be caught by handleInputChange
                value={productImageUrl}
                onChange={handleInputChange}
                placeholder="Enter direct image URL (e.g., from ImgBB)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <p className="text-xs text-gray-500 mt-1">
                If updating image, paste a new direct image URL here.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Current Stock</h3>
            <Link
              to={`/edit/${productId}/addstock`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
            >
              Add Stock
            </Link>
          </div>
          <div className="space-y-2">
            {product.stocks && product.stocks.length > 0 ? (
              product.stocks.map((stock, index) => (
                <div
                  key={stock.idStock || index}
                  className="grid grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-700">Size: </span>
                    <span className="text-gray-900">{stock.size || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Quantity: </span>
                    <span className="text-gray-900">{stock.stockQuantity}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No stock information available for this product.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDetails;
