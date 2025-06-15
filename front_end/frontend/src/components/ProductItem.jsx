// === src/components/ProductItem.jsx ===
import React from "react";
import { useNavigate } from "react-router-dom";

const ProductItem = ({ id, name, price, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="border rounded-md overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image || "/default.jpg"}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <p className="text-sm text-gray-700">Rp {price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductItem;
