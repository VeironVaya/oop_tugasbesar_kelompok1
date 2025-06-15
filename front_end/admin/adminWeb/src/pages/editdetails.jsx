import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EditDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState(""); // State for image URL, will be set by Cloudinary

  // Cloudinary Configuration (SESUAIKAN DENGAN PUNYA ANDA)
  const cloudinaryCloudName = "dim14penk"; // Ganti dengan Cloud Name Cloudinary Anda
  const cloudinaryUploadPreset = "assetPBO"; // Ganti dengan unsigned upload preset Anda

  // --- Cloudinary Upload Handler ---
  const openCloudinaryWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudinaryCloudName,
          uploadPreset: cloudinaryUploadPreset,
          sources: ["local", "url", "camera", "google_drive"], // Sesuaikan sumber yang diizinkan
          folder: "product_images", // Opsional: tentukan folder di Cloudinary
          // Anda bisa menambahkan opsi lain di sini, seperti transformasi, tags
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log(
              "Done uploading!!! Here is the image info: ",
              result.info
            );
            setProductImageUrl(result.info.secure_url); // Set URL dari Cloudinary
            alert("Image uploaded!");
          } else if (error) {
            console.error("Cloudinary upload error:", error);
            alert("Image upload failed. Please try again.");
          }
        }
      );
      widget.open(); // Buka widget
    } else {
      alert(
        "Script widget Cloudinary belum dimuat. Periksa file index.html Anda."
      );
    }
  };

  useEffect(() => {
    // *** PERBAIKAN: Tangani autentikasi di sini, tanpa setTimeout dan alert di awal rendering ***
    if (!token) {
      // Jika tidak ada token, langsung redirect ke login.
      // ProtectedRoute di App.jsx seharusnya sudah menangani ini,
      // tetapi ini adalah fallback yang baik untuk komponen individual.
      navigate("/login");
      return; // Hentikan eksekusi useEffect ini
    }

    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const productData = response.data;
        if (!productData.stocks) {
          productData.stocks = [];
        }

        if (!productData.category || productData.category.trim() === "") {
          productData.category = "TopWear";
        }

        // Set the image URL state from fetched data (prioritize urlimage)
        setProductImageUrl(productData.urlimage || productData.imageUrl || "");

        console.log("Fetched product data:", productData);
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        // Error handling untuk 401 dari API call
        if (err.response && err.response.status === 401) {
          setError("Your session has ended. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login"); // Redirect langsung tanpa setTimeout
        } else {
          setError(
            "Failed to retrieve product details. The product may not exist or an error occurred."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && productId !== "undefined") {
      fetchProductById();
    } else {
      setError("No product ID was provided in the URL.");
      setIsLoading(false);
    }
  }, [productId, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);

    // Sekarang, 'productImageUrl' tidak lagi diubah oleh input langsung,
    // tetapi oleh Cloudinary widget. Jadi, tidak perlu ada penanganan khusus di sini
    // kecuali Anda tetap ingin input teks manual sebagai fallback/opsi tambahan.
    // Jika hanya Cloudinary, Anda bisa menghapus `if (name === "imageUrl")`.
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!product) {
      alert("Product data hasn't loaded yet.");
      return;
    }

    const requiredFields = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      // imageUrl: productImageUrl, // Tambahkan ini jika Anda ingin mewajibkan gambar di update
    };

    const missingFields = Object.keys(requiredFields).filter((field) => {
      const value = requiredFields[field];
      const isEmpty = !value || value.toString().trim() === "";
      return isEmpty;
    });

    // Validasi gambar: Jika belum ada imageUrl dan tidak ada yang diupload, beri peringatan
    if (!productImageUrl && !product.urlimage && !product.imageUrl) {
      alert("Image must be uploaded.");
      return;
    }

    if (missingFields.length > 0) {
      const message = `This field must not empty: ${missingFields.join(", ")}.`;
      alert(message);
      return;
    }

    const numericPrice = parseFloat(product.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Price must be grater than 0.");
      return;
    }

    const updatedData = {
      name: (product.name || "").toString().trim(),
      description: (product.description || "").toString().trim(),
      price: numericPrice,
      category: (product.category || "").toString().trim(),
      urlimage: (productImageUrl || "").toString().trim(), // Menggunakan productImageUrl yang di-set dari Cloudinary
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined || updatedData[key] === null) {
        delete updatedData[key];
      }
    });

    if (!updatedData.category || updatedData.category === "") {
      alert("KRITIS: Category still empty. Please refresh the page.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/v1/products/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Update successful:", response.data);
      alert("Produk berhasil diperbarui!");
      navigate("/listitems");
    } catch (err) {
      console.error("=== ERROR DETAILS ===");
      console.error("Full error object:", err);
      console.error(
        "Request URL:",
        `http://localhost:8080/api/v1/products/${productId}`
      );
      console.error(
        "Request data that was sent:",
        JSON.stringify(updatedData, null, 2)
      );
      console.error("Request headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      console.error("=== ERROR DETAILS END ===");

      let errorMessage = "Gagal memperbarui produk. Silakan coba lagi.";
      // Error handling untuk 401
      if (err.response && err.response.status === 401) {
        errorMessage = "Sesi Anda telah berakhir. Mohon login kembali.";
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      // Error handling umum lainnya
      if (err.response) {
        const serverMessage =
          err.response.data.message || JSON.stringify(err.response.data);
        errorMessage = `Pembaruan gagal. Server mengatakan: ${serverMessage} (Status: ${err.response.status})`;
      } else if (err.request) {
        errorMessage =
          "Pembaruan gagal. Tidak ada respons dari server. Apakah server berjalan?";
      } else {
        errorMessage = `Pembaruan gagal. Error: ${err.message}`;
      }
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 font-semibold text-gray-500">
        Load detail product...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600">
          Produk Tidak Ditemukan
        </h2>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Back to list items
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg font-sans">
      <Link
        to="/"
        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to list items
      </Link>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={
                productImageUrl ||
                "https://placehold.co/400x400/e0e0e0/777?text=No+Image"
              } // Menggunakan productImageUrl state untuk tampilan
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/400x400/e0e0e0/777?text=No+Image";
              }}
            />
            {/* Tombol untuk membuka widget Cloudinary */}
            <div className="mt-4">
              <button
                type="button" // Penting: type="button" untuk mencegah submit form
                onClick={openCloudinaryWidget}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Change Image
              </button>
              {productImageUrl && (
                <p className="text-xs text-gray-500 mt-2 break-all">
                  URL Baru: {productImageUrl.substring(0, 50)}...
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="name"
                value={product.name || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description || ""}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={product.category || ""}
                onChange={(e) => {
                  console.log("Category dropdown changed to:", e.target.value);
                  handleInputChange(e);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required
              >
                <option value="">Select Category</option>
                <option value="BottomWear">BottomWear</option>
                <option value="FootWear">FootWear</option>
                <option value="TopWear">TopWear</option>
                <option value="Accessories">Accessories</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current category:{" "}
                <span className="font-semibold">
                  {product.category || "Belum dipilih"}
                </span>
                {!product.category && (
                  <span className="text-red-500 ml-2">⚠ Wajib!</span>
                )}
              </p>
            </div>
            {/* Input untuk Image URL yang sudah dihapus dan diganti dengan tombol upload */}
            {/* Bagian ini tidak lagi diperlukan karena digantikan oleh Cloudinary widget */}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Stock</h3>
            <Link
              to={`/edit/${productId}/addstock`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
            >
              Add Stock
            </Link>
          </div>
          <div className="space-y-2">
            {product.stocks && product.stocks.length > 0 ? (
              product.stocks.map((stock, index) => (
                <div
                  key={stock.idStock || index}
                  className="grid grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-700">Size: </span>
                    <span className="text-gray-900">{stock.size || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Quantity:{" "}
                    </span>
                    <span className="text-gray-900">{stock.stockQuantity}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                This Product don't have any details.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDetails;
