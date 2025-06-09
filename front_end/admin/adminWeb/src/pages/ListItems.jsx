import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';


// --- Mock Data ---
// This array simulates the data that would normally come from a real API.
// You can remove this once your API is connected.
const mockProductData = [
  {
    id: 'prod_123',
    name: 'Kid Tapered Slim Fit Trouser',
    category: 'Bottomwear',
    price: 38,
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333?text=Trouser',
  },
  {
    id: 'prod_124',
    name: 'Men Round Neck Pure Cotton T-shirt',
    category: 'Topwear',
    price: 64,
    imageUrl: 'https://placehold.co/100x100/e9e9e9/333?text=T-Shirt',
  },
  {
    id: 'prod_125',
    name: 'Boy Round Neck Pure Cotton T-shirt',
    category: 'Topwear',
    price: 60,
    imageUrl: 'https://placehold.co/100x100/f5f5f5/333?text=T-Shirt',
  },
  {
    id: 'prod_126',
    name: 'Women Zip-Front Relaxed Fit Jacket',
    category: 'Topwear',
    price: 74,
    imageUrl: 'https://placehold.co/100x100/e0e0e0/333?text=Jacket',
  },
   {
    id: 'prod_127',
    name: 'Men Tapered Fit Flat-Front Trousers',
    category: 'Bottomwear',
    price: 58,
    imageUrl: 'https://placehold.co/100x100/f8f8f8/333?text=Trousers',
  },
  {
    id: 'prod_128',
    name: "Girl's Round Neck Cotton Top",
    category: 'Topwear',
    price: 56,
    imageUrl: 'https://placehold.co/100x100/fdfdfd/333?text=Top',
  },
];


const ListItems = () => {
   // State for products list, loading, and error
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // State for the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // This function is now called when the delete button is clicked.
  // It sets the state to show the modal.
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  // This function is called when the user confirms the deletion.
  const confirmDelete = () => {
    if (productToDelete) {
      // In a real application, you would call your API here:
      // fetch(`/api/v1/products/${productToDelete}`, { method: 'DELETE' });
      alert(`Product with ID: ${productToDelete} would be deleted.`);

      // To update the UI instantly, we filter the deleted product out of the local state.
      setProducts(currentProducts =>
        currentProducts.filter(p => p.id !== productToDelete)
      );
    }
    // Close the modal
    closeDeleteModal();
  };
  
  // This function closes the modal and resets the state.
  const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
  };

  // useEffect handles side effects, like fetching data, after the component renders.
  useEffect(() => {
    // --- MOCK DATA FETCH (for development) ---
    const fetchMockProducts = () => {
      setTimeout(() => {
        try {
          setProducts(mockProductData);
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    };
    fetchMockProducts();

  }, []); // The empty `[]` means this effect runs only once.

  // Conditional Rendering for loading and error states
  if (isLoading) {
    return <div className="text-center p-10 font-semibold text-gray-500">Loading products...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-600">Error fetching data: {error}</div>;
  }

  // If not loading and no error, render the main product table and the modal if it's open.
  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">All Products List</h1>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or description..."
            className="border px-4 py-2 rounded w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
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
                <th scope="col" className="py-3 px-6">Image</th>
                <th scope="col" className="py-3 px-6">Name</th>
                <th scope="col" className="py-3 px-6">Category</th>
                <th scope="col" className="py-3 px-6">Price</th>
                <th scope="col" className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-14 w-14 object-cover rounded-md"
                      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/e0e0e0/777?text=No+Img'; }}
                    />
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6 font-semibold">${product.price}</td>
                  <td className="flex items-center gap-2 py-4 px-6 text-center">
                      <button
                        onClick={() => alert(`Edit product: ${product.id}`)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Edit Product"
                      >
                         <img src={assets.edit_icon} alt="Edit" className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product.id)}
                        className="p-2 hover:bg-gray-100 rounded ml-2"
                        title="Delete Product"
                      >
                          <img src={assets.delete_icon} alt="Delete" className="h-5 w-5" />
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
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-auto"
              >
                No, Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2  bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// The main App component that renders our ListItems component.
export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <ListItems />
    </div>
  );
}
