// src/pages/Dashboard/MyOrders.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaTrashAlt, FaMoneyBillWave } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch orders for logged-in user
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  console.log("data", orders);

  // Order payment
  const handlePayment = async (order) => {
    navigate(`/dashboard/payment/${order.productId}`)
  }

  // Delete order
  const handleDelete = async (id) => {
    // Show toast confirmation
    toast(
      (t) => (
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <span>Are you sure you want to delete this order?</span>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id); // dismiss the confirmation toast
                try {
                  await axiosSecure.delete(`/orders/${id}`);
                  toast.success("✅ Order deleted successfully!");
                  refetch();
                } catch (error) {
                  toast.error(error.message);
                }
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: Infinity } // keep toast open until user clicks
    );
  };

  if (isLoading)
    return <LoadingSpinner></LoadingSpinner>;
  if (isError)
    return <p className="text-center mt-10 text-red-500">Failed to load orders!</p>;

  return (
    <div className="p-4 md:p-4 lg:px-5 bg-gray-200 overflow-x-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found!</p>
      ) : (
        <div className="min-w-full">
          <table className="table-auto w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700 text-sm md:text-base">
                <th className="p-2">#</th>
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Product Id</th>
                <th className="p-2">Price</th>
                <th className="p-2">Seller Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-2 text-black text-center">{index + 1}</td>
                  <td className="p-2 text-center">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-12 h-12 md:w-16 md:h-16 rounded object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2 text-black font-semibold">{order.title}</td>
                  <td className="p-2 text-black">{order._id}</td>
                  <td className="p-2 text-black">{order.price} {order.currency}</td>
                  <td className="p-2 text-black">{order.seller_email}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 text-xs md:text-sm font-semibold rounded-full ${order.order_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {order.order_status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-1 md:gap-2 justify-center items-center pt-3 md:pt-6">
                    <button
                      title="View"
                      className="btn btn-sm btn-info items-center text-white"
                    >
                      <FaEye /> view
                    </button>
                    <button
                      title="Pay"
                      className="btn btn-sm btn-success text-white"
                      onClick={() => handlePayment(order)}
                      disabled={order.order_status === "paid"}
                    >
                      <FaMoneyBillWave /> pay
                    </button>
                    <button
                      title="Delete"
                      className="btn btn-sm btn-error text-white"
                      onClick={() => handleDelete(order._id)}
                    >
                      <FaTrashAlt /> delete
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

export default MyOrders;
