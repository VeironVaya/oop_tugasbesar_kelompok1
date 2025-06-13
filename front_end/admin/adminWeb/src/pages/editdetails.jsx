import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EditDetails = () => {
  const { productId } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/products/${productId}`);
        // Ensure stocks is always an array
        const productData = response.data;
        if (!productData.stocks) {
          productData.stocks = [];
        }
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details. The product may not exist.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && productId !== 'undefined') {
      fetchProductById();
    } else {
      setError("No product ID was provided in the URL.");
      setIsLoading(false);
    }
  }, [productId]);

  // --- Handles changes for top-level product fields (name, price, etc.) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  // --- Saves all product changes, EXCLUDING stocks ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!product) return;

    console.log("Attempting to update with payload (excluding stocks):", product);

    try {
      await axios.patch(`http://localhost:8080/api/v1/products/${productId}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        // Stocks are no longer sent from this page
      });
      alert("Product updated successfully!");
      navigate("/listitems");
    } catch (err) {
      console.error("Error updating product:", err);
      
      let errorMessage = "Failed to update product. Please try again.";
      if (err.response) {
        console.error("Server responded with error:", err.response.data);
        const serverMessage = err.response.data.message || JSON.stringify(err.response.data);
        errorMessage = `Update failed. Server says: ${serverMessage} (Status: ${err.response.status})`;
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMessage = "Update failed. No response from the server. Is it running?";
      } else {
        console.error("Error setting up request:", err.message);
        errorMessage = `Update failed. Error: ${err.message}`;
      }
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10 font-semibold text-gray-500">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600">Product Not Found</h2>
        <Link to="/" className="mt-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
          Back to Product List
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to product list
      </Link>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={product.imageUrl || 'https://placehold.co/400x400/e0e0e0/777?text=No+Image'}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e0e0e0/777?text=No+Image'; }}
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* ... other product inputs like name, description, price, category ... */}
             <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" id="productName" name="name" value={product.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" value={product.description || ''} onChange={handleInputChange} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required ></textarea>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" id="price" name="price" value={product.price || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" id="category" name="category" value={product.category || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>
        </div> 

        {/* --- Stock Details Section (Display Only) --- */}
        <div className="mt-10 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Current Stock</h3>
            <Link 
              to={`/editdetails/${productId}/addstock`} 
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
            >
              Add Stock
            </Link>
          </div>
          <div className="space-y-2">
            {product.stocks && product.stocks.length > 0 ? (
                product.stocks.map((stock, index) => (
                <div key={stock.idStock || index} className="grid grid-cols-2 gap-4 p-3 border rounded-lg bg-gray-50">
                    <div>
                        <span className="text-sm font-medium text-gray-700">Size: </span>
                        <span className="text-sm text-gray-900">{stock.size}</span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-700">Quantity: </span>
                        <span className="text-sm text-gray-900">{stock.stockQuantity}</span>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">No stock information available for this product.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button type="submit" className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditDetails;
