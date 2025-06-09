import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'; // assuming plus_icon and minus_icon are exported from here

// Same mock data as EditDetails
const mockProductData = [
  {
    id: 'prod_123',
    name: 'Kid Tapered Slim Fit Trouser',
    stock: [
      { size: 'S', quantity: 10 },
      { size: 'M', quantity: 5 },
      { size: 'L', quantity: 0 },
    ],
  },
  {
    id: 'prod_124',
    name: 'Men Round Neck Pure Cotton T-shirt',
    stock: [
      { size: 'M', quantity: 8 },
      { size: 'L', quantity: 3 },
    ],
  },
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const AddStock = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [stockQuantity, setStockQuantity] = useState(0);

  useEffect(() => {
    const found = mockProductData.find((p) => p.id === productId);
    if (found) setProduct(found);
    else alert('Product not found');
  }, [productId]);

  const increaseStock = () => setStockQuantity(prev => prev + 1);
  const decreaseStock = () => setStockQuantity(prev => (prev > 0 ? prev - 1 : 0));

  const handleSave = () => {
    if (!product) return;
    const updatedStock = [...(product.stock || [])];
    const stockIndex = updatedStock.findIndex(s => s.size === selectedSize);
    if (stockIndex !== -1) {
      updatedStock[stockIndex].quantity += stockQuantity;
    } else {
      updatedStock.push({ size: selectedSize, quantity: stockQuantity });
    }

    console.log(`Updated stock for ${product.name}:`, updatedStock);
    alert(`Stock for size ${selectedSize} added: +${stockQuantity}`);
    navigate(`/edit/${productId}`);
  };

  if (!product) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to={`/edit/${productId}`}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
         Back to detail product
      </Link>

      <div className="border rounded-lg p-6 shadow-sm">
        <h2 className="font-medium mb-4">Product Size</h2>
        <div className="flex space-x-2 mb-6">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded ${
                selectedSize === size
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2">Stock Quantity</h2>
          <div className="flex items-center space-x-2">
            <button onClick={decreaseStock}>
              <img src={assets.minus_icon} alt="minus" className="w-5 h-5" />
            </button>
            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
              className="w-20 text-center border rounded px-2 py-1"
            />
            <button onClick={increaseStock}>
              <img src={assets.plus_icon} alt="plus" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
