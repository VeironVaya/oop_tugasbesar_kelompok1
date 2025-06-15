import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddStock = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  // Get the token from local storage
  const token = localStorage.getItem("token");

  // State for product data, loading, and errors
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the form inputs
  const [sizeInput, setSizeInput] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(""); // Initialize as empty string to allow controlled input

  // --- LOGIC: Fetch product data ---
  useEffect(() => {
    // Check for token first, handle unauthorized access
    if (!token) {
      setError("Unauthorized. Please log in to manage stock.");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchProduct = async () => {
      const apiUrl = `http://localhost:8080/api/v1/products/${productId}`;
      console.log("Fetching product from URL:", apiUrl);

      try {
        // Add Authorization header to the GET request
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const productData = response.data;
        // Ensure stocks array exists, even if empty
        if (!productData.stocks) {
          productData.stocks = [];
        }
        setProduct(productData);
      } catch (err) {
        console.error("Failed to fetch product", err);
        if (err.response && err.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(
            "Could not find the specified product. Check the console for details."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, token, navigate]);

  // --- Handlers for quantity input ---
  const handleQuantityInput = (e) => {
    // Allow only digits
    const value = e.target.value.replace(/[^0-9]/g, "");
    setQuantityToAdd(value);
  };

  const increaseStock = () => {
    setQuantityToAdd((prev) => {
      const num = parseInt(prev, 10);
      return isNaN(num) ? 1 : num + 1; // Start from 1 if current is not a number
    });
  };

  const decreaseStock = () => {
    setQuantityToAdd((prev) => {
      const num = parseInt(prev, 10);
      return isNaN(num) || num <= 0 ? 0 : num - 1; // Don't go below 0
    });
  };


  // --- LOGIC: Saves stock by either updating an existing one or creating a new one ---
  const handleSave = async () => {
    // Convert quantityToAdd to number for validation
    const numericQuantityToAdd = parseInt(quantityToAdd, 10);

    if (!product || isNaN(numericQuantityToAdd) || numericQuantityToAdd <= 0) {
      alert("Please specify a quantity greater than zero.");
      return;
    }

    const finalSize = sizeInput.trim();
    // Validate finalSize: it should not be empty if a new stock is being created
    if (!finalSize && !product.stocks.find(s => s.size === finalSize)) {
        alert("Please enter a size for new stock entries.");
        return;
    }

    const existingStock = product.stocks.find((s) => s.size === finalSize);

    // Define headers once to use for both PATCH and POST
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      if (existingStock) {
        // --- LOGIC TO UPDATE EXISTING STOCK ---
        const newQuantity = existingStock.stockQuantity + numericQuantityToAdd;
        const apiUrl = `http://localhost:8080/api/v1/products/${productId}/stocks/${existingStock.idStock}`;
        const payload = { stockQuantity: newQuantity };

        // Add headers to PATCH request
        await axios.patch(apiUrl, payload, { headers });
        alert(
          `Added ${numericQuantityToAdd} to size "${
            finalSize || "N/A"
          }". New total: ${newQuantity}.`
        );
      } else {
        // --- LOGIC TO CREATE NEW STOCK ---
        const apiUrl = `http://localhost:8080/api/v1/products/${productId}/stocks`;
        const payload = { size: finalSize, stockQuantity: numericQuantityToAdd };

        // Add headers to POST request
        await axios.post(apiUrl, payload, { headers });
        alert(
          `New stock for size "${
            finalSize || "N/A"
          }" created with quantity ${numericQuantityToAdd}.`
        );
      }
      navigate(`/editdetails/${productId}`);
    } catch (err) {
      console.error("Error saving stock:", err);
      let errorMessage = "Failed to update stock. Please try again.";
      if (err.response) {
        errorMessage = `Error: ${
          err.response.data.message || "The server returned an error."
        } (Status: ${err.response.status})`;
      }
      alert(errorMessage);
    }
  };

  // --- UI / JSX ---
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-700">Loading product information...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-gray-700">No product data available.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <Link
        to={`/editdetails/${productId}`}
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
        Back to Detail Product
      </Link>

      <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Add Stock for: {product.name}
        </h1>

        <div className="mb-6">
          <label
            htmlFor="sizeInput"
            className="font-medium mb-2 text-gray-700 block text-sm"
          >
            Product Size
          </label>
          <input
            id="sizeInput"
            type="text"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="Enter size (e.g., S, M, L, XL, XXL)"
            className="w-full border-gray-300 border rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 ease-in-out"
          />
           <p className="text-xs text-gray-500 mt-1">Leave blank if the product is one-size-fits-all, but if adding new stock for a specific size, you must enter it.</p>
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2 text-gray-700 text-sm">Quantity to Add</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={decreaseStock}
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-black"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="text" // Change to text to allow custom input handling
              inputMode="numeric" // Suggests numeric keyboard on mobile
              min="0"
              value={quantityToAdd}
              onChange={handleQuantityInput} // Use the new handler
              className="w-24 text-center border-gray-300 border rounded-md px-2 py-1 text-lg font-bold focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 ease-in-out"
            />
            <button
              onClick={increaseStock}
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-black"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Save Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
