import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";


const ProductTracking = () => {
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  console.log(trackedProducts);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/track-products/${user.email}`);
        setTrackedProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching tracked products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure, user?.email]);

  if (loading) return <LoadingSpinner />;

  const getOrderStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "packaging":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-blue-200 text-blue-900";
      case "Out for Delivery":
        return "bg-blue-200 text-gray-800";
      case "Delivered":
        return "bg-orange-200 text-black";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 bg-gray-200">
      <h2 className="text-2xl text-black font-bold mb-6">Product Tracking Dashboard</h2>

      {trackedProducts.length === 0 ? (
        <p className="text-gray-600">No products purchased yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {trackedProducts.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-2 flex items-center gap-3">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <span className="text-gray-700 font-medium">{item.productTitle}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.price} {item.currency}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${item.paymentStatus === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.paymentStatus === "succeeded" ? "succeeded" : "Failed"}
                    </span>
                  </td>
                  <td className="px-6 text-cyan-800 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusClass(
                        item.orderStatus
                      )}`}
                    >
                      {item.orderStatus.charAt(0).toUpperCase() + item.orderStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(item.createdAt).toLocaleString()}
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

export default ProductTracking;
