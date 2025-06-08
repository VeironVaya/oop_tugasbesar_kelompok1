import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Mock data for demonstration purposes
const mockProductData = [
    {
        id: 'prod_123',
        name: 'Kid Tapered Slim Fit Trouser',
        category: 'Kids',
        price: 38,
        imageUrl: 'https://placehold.co/100x100/f0f0f0/333?text=Trouser',
        description: 'Comfortable tapered trousers for kids.',
        stock: [
            { size: 'S', quantity: 10 },
            { size: 'M', quantity: 5 },
            { size: 'L', quantity: 0 },
        ],
    },
    {
        id: 'prod_124',
        name: 'Men Round Neck Pure Cotton T-shirt',
        category: 'Men',
        price: 64,
        imageUrl: 'https://placehold.co/100x100/e9e9e9/333?text=T-Shirt',
        description: 'Soft and breathable cotton t-shirt.',
        stock: [
            { size: 'M', quantity: 8 },
            { size: 'L', quantity: 3 },
        ],
    },
    // Add more products as needed
];

const EditDetails = () => {
    const { productId } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch product data by ID from the mock data array
        const foundProduct = mockProductData.find(p => p.id === productId);
        if (foundProduct) {
            // Simulate network latency
            setTimeout(() => {
                setProduct(foundProduct);
                setIsLoading(false);
            }, 500);
        } else {
            // Handle case where product is not found
            setIsLoading(false);
            console.error("Product not found");
        }
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        // In a real app, you would send the updated product data to your API
        console.log("Saving product:", product);
        alert(`Product "${product.name}" saved!`);
        navigate('/'); // Navigate back to the list after saving
    };

    if (isLoading) {
        return <div className="text-center p-10 font-semibold text-gray-500">Loading product details...</div>;
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
                Back to detail product
            </Link>

            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Image Column */}
                    <div className="md:col-span-1">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e0e0e0/777?text=No+Image'; }}
                        />
                    </div>

                    {/* Details and Stock Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                value={product.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                        </div>
                        
                        {/* Stock Section */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Stock</h3>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 font-semibold text-gray-500 text-sm">
                                    <span>Size</span>
                                    <span>Quantity</span>
                                </div>
                                {product.stock && product.stock.length > 0 ? (
                                    product.stock.map((item, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4 text-gray-800">
                                            <span>{item.size}</span>
                                            <span>{item.quantity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500">No stock information available.</div>
                                )}
                            </div>
                            <Link
                            to={`/edit/${product.id}/addstock`} // <-- This creates the dynamic link
                            className="text-red-600 text-sm font-semibold mt-4 hover:underline"
                        >
                            Add stock
                        </Link>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDetails;
