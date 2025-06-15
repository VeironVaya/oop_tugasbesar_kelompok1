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
        src={image || "https://placehold.co/100x100/e0e0e0/777?text=No+Img"}
        alt={name || "Product image"}
        className="w-full h-48 object-cover"
        onError={(e) => {
          if (
            e.currentTarget.src !==
            "https://placehold.co/100x100/e0e0e0/777?text=No+Img"
          ) {
            e.currentTarget.src =
              "https://placehold.co/100x100/e0e0e0/777?text=No+Img";
          }
        }}
      />
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <p className="text-sm text-gray-700">Rp {price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductItem;
