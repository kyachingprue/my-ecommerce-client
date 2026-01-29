import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBoxOpen, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch all products
  const { data: products = [], refetch, isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  const handleUpdate = (id) => {
    navigate(`/dashboard/admin/update-product/${id}`);
  };

  // Delete product with confirm/cancel toast
  const handleDelete = (id) => {
    toast.custom((t) => (
      <div
        className={`bg-white border shadow-lg rounded-xl p-5 flex flex-col items-center gap-3 transition-all w-[280px] ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
      >
        <p className="text-gray-700 font-medium text-center">
          Are you sure you want to delete this product?
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await axiosSecure.delete(`/products/${id}`);
                if (res.data.deletedCount > 0) {
                  toast.success("Product deleted successfully!");
                  refetch();
                } else {
                  toast.error("Failed to delete product.");
                }
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete product");
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="p-5 min-h-screen bg-gray-200">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">All Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-green-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Weight</th>
                <th className="px-6 py-3">Origin</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr
                  key={idx}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="px-6 py-3 text-black font-semibold">{idx + 1}</td>
                  <td className="px-6 py-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-700 flex items-center gap-2">
                    <FaBoxOpen className="text-green-500" />
                    {product.title}
                  </td>
                  <td className="px-6 text-black py-3">{product.category}</td>
                  <td className="px-6 py-3 text-black flex items-center gap-1 font-medium">
                    <span> {product.price}</span> {product.currency}
                  </td>
                  <td className="px-6 text-black py-3">{product.stock}</td>
                  <td className="px-6 text-black py-3">{product.sku}</td>
                  <td className="px-6 text-black py-3">{product.weight}</td>
                  <td className="px-6 text-black py-3">{product.origin}</td>
                  <td className="px-6 py-3 text-center flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="bg-blue-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <span>🛠️</span> Update
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center gap-1 transition"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
