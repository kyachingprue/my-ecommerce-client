import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?sellerEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  console.log("my seller product", products);

  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`max-w-md w-full bg-white shadow-lg rounded-lg p-5 flex flex-col gap-4 ${t.visible ? "animate-enter" : "animate-leave"
            }`}
        >
          <p className="text-gray-700 font-semibold text-lg">
            Are you sure you want to delete this product?
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              onClick={async () => {
                try {
                  await axiosSecure.delete(`/products/${id}`);
                  refetch();
                  toast.success("✅ Product deleted successfully!", { id: t.id });
                } catch (err) {
                  console.error(err);
                  toast.error("❌ Failed to delete product", { id: t.id });
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-200 py-10 px-4">
      <div className="w-11/12 mx-auto bg-white shadow-2xl rounded-md overflow-hidden border border-green-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-100">
          <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
            My Products
          </h2>
          <p className="text-gray-500 text-sm">
            Total: <span className="font-bold text-green-600">{products.length}</span>
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-lg">
            You haven’t added any products yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-green-600 text-white uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-xl">#</th>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Currency</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr
                    key={product._id}
                    className={`${idx % 2 === 0 ? "bg-green-50" : "bg-white"
                      } hover:bg-green-100 transition-colors duration-200`}
                  >
                    <td className="px-5 font-bold">{idx + 1}.</td>
                    <td className="px-6 py-2">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-xl border border-green-200"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-700">
                      {product.price} {product.currency}
                    </td>
                    <td className="px-6 text-blue-950 py-4">{product.stock}</td>
                    <td className="px-6 text-black py-4">{product.currency}</td>
                    <td className="px-6 py-5 flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/seller/edit-product/${product._id}`)}
                        className="bg-green-500 flex items-center gap-2 hover:bg-green-600 text-white p-2 rounded-lg shadow-sm transition"
                        title="Edit"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 flex items-center gap-2 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition"
                        title="Delete"
                      >
                        <FaTrashAlt />Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
