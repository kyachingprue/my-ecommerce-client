import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

const CustomerOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["sellerOrders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-orders/${user.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  // ✅ Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/orders/${orderId}`, { status: newStatus });
      if (res.data.modifiedCount > 0) {
        toast.success(`Order updated to "${newStatus}"`);
        refetch(); // refresh data
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="text-center py-10 text-gray-500">No orders yet.</p>;

  return (
    <div className="min-h-screen bg-gray-200 py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Customer Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-green-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Customer Email</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-center">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={idx % 2 === 0 ? "bg-green-50" : "bg-white"}
                >
                  <td className="px-4 py-2 font-bold">{idx + 1}</td>
                  <td className="px-4 py-2">{order.user_email}</td>
                  <td className="px-4 py-2 font-semibold">{order.productTitle}</td>
                  <td className="px-4 py-2">{order.quantity || 1}</td>
                  <td className="px-4 py-2 font-semibold text-green-700">
                    ${order.price}
                  </td>

                  {/* Display current status */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-white ${order.status === "delivered"
                        ? "bg-green-600"
                        : order.status === "shipped"
                          ? "bg-blue-600"
                          : order.status === "processing"
                            ? "bg-yellow-500"
                            : order.status === "cancelled"
                              ? "bg-red-600"
                              : "bg-gray-400"
                        }`}
                    >
                      {order.status || "pending"}
                    </span>
                  </td>

                  {/* ✅ Dropdown to change status */}
                  <td className="px-4 py-2 text-center">
                    <select
                      className="border border-gray-300 rounded-md p-1"
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;
