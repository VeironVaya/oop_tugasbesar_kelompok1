import React from 'react';

const Add = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <form className="w-full max-w-4xl bg-white p-10 rounded-lg shadow-md">
        {/* Upload Image */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Upload Image</h2>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <label
                key={i}
                className="flex items-center justify-center border border-dashed border-gray-400 h-24 cursor-pointer"
              >
                <input type="file" className="hidden" />
                <span className="text-gray-500">Upload</span>
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
          <input
            type="text"
            placeholder="Type here"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-black"
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product description</label>
          <textarea
            placeholder="Write content here"
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring focus:ring-black"
          ></textarea>
        </div>

        {/* Category, Sub-category, Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product category</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Men</option>
              <option>Women</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub category</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Topwear</option>
              <option>Bottomwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Price</label>
            <input
              type="number"
              placeholder="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Product Sizes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Sizes</label>
          <div className="flex space-x-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button
                key={size}
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller Checkbox
        <div className="mb-6">
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Add to bestseller</span>
          </label>
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-32 bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
