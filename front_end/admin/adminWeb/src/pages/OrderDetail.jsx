import { useParams, useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data (bisa nanti dari context atau API)
  const items = [
    {
      name: "Women Zip-Front Relaxed Fit Jacket",
      gender: "Woman",
      price: "RP.189.000,-",
      image: "https://via.placeholder.com/80", 
    },
    {
      name: "Women Zip-Front Relaxed Fit Jacket",
      gender: "Woman",
      price: "RP.189.000,-",
      image: "https://via.placeholder.com/80",
    },
  ];

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Back to order list
      </button>

      <h2 className="font-semibold mb-2">ID: {id}</h2>
      <p className="mb-2">
        Status:
        <select className="border rounded px-2 py-1 ml-2">
          <option>Unpaid</option>
          <option>Paid</option>
        </select>
      </p>

      <p className="mb-4">Order date: 30-05-2025</p>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center border p-4 rounded mb-2">
          <img
            src={item.image}
            alt="product"
            className="w-20 h-20 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <p>{item.name}</p>
            <p>{item.gender}</p>
          </div>
          <p>{item.price}</p>
        </div>
      ))}

      <p className="mt-4 font-semibold">Total: Rp.378.000,-</p>
    </div>
  );
};

export default OrderDetail;

