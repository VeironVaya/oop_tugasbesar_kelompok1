import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddStock = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // State for product data, loading, and errors
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the form
  const [sizeInput, setSizeInput] = useState(''); 
  const [quantityToAdd, setQuantityToAdd] = useState(0);

  // --- Fetch product data ---
  useEffect(() => {
    const fetchProduct = async () => {
      const apiUrl = `http://localhost:8080/api/v1/products/${productId}`;
      console.log("Fetching product from URL:", apiUrl);

      try {
        const response = await axios.get(apiUrl);
        const productData = response.data;
        if (!productData.stocks) {
          productData.stocks = [];
        }
        setProduct(productData);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("Could not find the specified product. Check the console for details.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const increaseStock = () => setQuantityToAdd(prev => prev + 1);
  const decreaseStock = () => setQuantityToAdd(prev => (prev > 0 ? prev - 1 : 0));

  // --- Saves stock by either updating an existing one or creating a new one ---
  const handleSave = async () => {
    // MODIFIED: Removed the constraint for the size input.
    if (!product || quantityToAdd <= 0) {
      alert("Please specify a quantity greater than zero.");
      return;
    }

    // Use a trimmed version of the size or a default for "no size"
    const finalSize = sizeInput.trim(); 
    const existingStock = product.stocks.find(s => s.size === finalSize);

    try {
      if (existingStock) {
        // --- LOGIC TO UPDATE EXISTING STOCK ---
        const newQuantity = existingStock.stockQuantity + quantityToAdd;
        const apiUrl = `http://localhost:8080/api/v1/products/${productId}/stocks/${existingStock.idStock}`;
        const payload = { stockQuantity: newQuantity };

        console.log("Updating existing stock at URL:", apiUrl);
        console.log("With payload:", payload);
        
        await axios.patch(apiUrl, payload);
        alert(`Added ${quantityToAdd} to size "${finalSize || 'N/A'}". New total: ${newQuantity}.`);

      } else {
        // --- LOGIC TO CREATE NEW STOCK ---
        const apiUrl = `http://localhost:8080/api/v1/products/${productId}/stocks`;
        const payload = { size: finalSize, stockQuantity: quantityToAdd };

        console.log("Creating new stock at URL:", apiUrl);
        console.log("With payload:", payload);

        await axios.post(apiUrl, payload);
        alert(`New stock for size "${finalSize || 'N/A'}" created with quantity ${quantityToAdd}.`);
      }

      navigate(`/editdetails/${productId}`);

    } catch (err) {
      console.error("Error saving stock:", err);
      let errorMessage = "Failed to update stock. Please try again.";
      if (err.response) {
        errorMessage = `Error: ${err.response.data.message || 'The server returned an error.'} (Status: ${err.response.status})`;
      }
      alert(errorMessage);
    }
  };

  // --- Conditional Rendering ---
  if (isLoading) {
    return <div className="p-6 text-center">Loading product information...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="p-6 text-center">No product data available.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to={`/editdetails/${productId}`}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Detail Product
      </Link>

      <div className="border rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-2">Add Stock for: {product.name}</h1>
        
        <div className="mb-6">
          <label htmlFor="sizeInput" className="font-medium mb-2 text-gray-700 block">Product Size (Optional)</label>
          <input
            id="sizeInput"
            type="text"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="Enter size (e.g., S, M, L) or leave blank"
            className="w-full border-gray-300 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2 text-gray-700">Quantity to Add</h2>
          <div className="flex items-center space-x-4">
            <button onClick={decreaseStock} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <input
              type="number"
              min="0"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(parseInt(e.target.value, 10) || 0)}
              className="w-24 text-center border-gray-300 border rounded-md px-2 py-1 text-lg font-bold focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={increaseStock} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="bg-black text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Save Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStock;