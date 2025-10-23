import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const SellerRequestsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["sellerRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/seller-requests");
      return res.data;
    },
  });
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/seller-requests/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["sellerRequests"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update request");
    },
  });

  const handleAction = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-5 bg-cyan-100 shadow-2xl rounded-md">
      <h2 className="text-2xl font-semibold mb-6 w-2/12 border-b border-gray-500 pb-2">
        Seller Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No seller requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Table Header */}
            <thead className="border-b border-gray-300">
              <tr className="text-left text-gray-700">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Message</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="transition-colors hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-2 px-3">{req.name}</td>
                  <td className="py-2 px-3">{req.email}</td>
                  <td className="py-2 px-3">{req.message}</td>
                  <td className="py-2 px-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-white ${req.status === "approved"
                        ? "bg-green-600"
                        : req.status === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {req.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req._id, "approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-white ${req.status === "approved"
                          ? "bg-green-600"
                          : "bg-red-600"
                          }`}
                      >
                        {req.status}
                      </span>
                    )}
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

export default SellerRequestsAdmin;
