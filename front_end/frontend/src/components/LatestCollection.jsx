import React from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useShop } from "../context/ShopContext";

const LatestCollection = () => {
  const { products, loading, error } = useShop();

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Kami menyediakan berbagai koleksi topwear, bottomwear, footwear, dan aksesoris untuk melengkapi penampilanmu setiap hari.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
        {products.slice(0, 10).map((item, index) => (
          <ProductItem
            key={item.id_product}
            id={item.id_product}
            name={item.name}
            price={item.price}
            image={item.image || "/default.jpg"}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
