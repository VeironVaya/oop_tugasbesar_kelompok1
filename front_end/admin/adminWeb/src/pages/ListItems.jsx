import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const ListItems = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true); // Re-enable loading when filter/search changes
      try {
        // Fetch with category filter via API
        const url =
          categoryFilter === "All"
            ? "http://localhost:8080/api/v1/products"
            : `http://localhost:8080/api/v1/products?category=${encodeURIComponent(categoryFilter)}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Backend might return directly the data array, or an object with a 'data' key
        const productData = response.data.data || response.data; 
        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          console.error("API response is not an array:", productData);
          setError("Invalid data format from the server.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [token, navigate, categoryFilter]); // Add categoryFilter to dependency array

  const filteredProducts = products.filter((product) =>
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/products/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.idProduct !== productToDelete)
      );
      alert(`Product with ID: ${productToDelete} has been deleted.`);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    } finally {
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  if (isLoading) return <div className="text-center p-10 font-semibold text-gray-500">Loading products...</div>;
  if (error) return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 font-sans">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">All Products List</h1>

        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border px-4 py-2 rounded-md w-full md:w-1/2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-4 py-2 rounded-md w-full md:w-1/4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          >
            <option value="All">All Categories</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 uppercase text-xs text-gray-700">
              <tr>
                <th className="py-3 px-6">Image</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.idProduct} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <img
                      src={
                        // Use product.urlimage if available, otherwise fallback
                        product.urlimage 
                          ? product.urlimage 
                          : "https://placehold.co/100x100/e0e0e0/777?text=No+Img"
                      }
                      alt={product.name || "Product Image"}
                      className="h-14 w-14 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/100x100/e0e0e0/777?text=No+Img";
                      }}
                    />
                  </td>
                  

                  <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6 font-semibold">
                    {/* Format price to Indonesian Rupiah */}
                    Rp.{product.price?.toLocaleString("id-ID")}
                  </td>
                  <td className="flex items-center justify-center gap-2 py-4 px-6 text-center">
                    <Link
                      to={`/editdetails/${product.idProduct}`}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Edit Product"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product.idProduct)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Delete Product"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M4.22 19h15.56a1 1 0 00.94-1.34L13.73 4a1 1 0 00-1.46 0L3.28 17.66A1 1 0 004.22 19z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
              <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this product?</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListItems;
