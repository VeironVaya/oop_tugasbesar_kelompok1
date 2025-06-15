import React, { useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import axios from "axios";

const LatestCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/products");
        setProducts(res.data);
      } catch (err) {
        setError("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 m-auto text-sm text-gray-600">
          Koleksi terbaru kami dari berbagai kategori fashion.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
        {products.map((item) => (
          <ProductItem
            key={item.idProduct}
            id={item.idProduct}
            name={item.name}
            price={item.price}
            image={
              item.urlimage && item.urlimage.trim() !== ""
                ? item.urlimage
                : "https://placehold.co/100x100/e0e0e0/777?text=No+Img"
            }
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
