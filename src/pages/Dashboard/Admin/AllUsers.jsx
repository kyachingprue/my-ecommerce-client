import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      // Filter out sellers or admins
      return res.data.filter((user) => user.role === "user");
    },
  });


  const handleDelete = (id) => {
    toast.custom((t) => (
      <div
        className={`bg-white border shadow-lg rounded-xl p-5 flex flex-col items-center gap-3 transition-all w-[280px] ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
      >
        <p className="text-gray-700 font-medium text-center">
          Are you sure you want to delete this user?
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await axiosSecure.delete(`/users/${id}`);
                if (res.data.deletedCount > 0) {
                  toast.success("User deleted successfully!");
                  refetch();
                } else {
                  toast.error("Failed to delete user.");
                }
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete user");
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
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="p-5 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">All Users</h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-blue-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="px-6 py-3 font-semibold">{idx + 1}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3 capitalize font-semibold">
                    {user.role}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(
                      user.last_login || user.lasted_login
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleDelete(user._id)}
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

export default AllUsers;
