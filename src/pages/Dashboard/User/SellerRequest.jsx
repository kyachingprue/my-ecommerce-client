import React, { useState } from "react";

import { toast } from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Fan } from "lucide-react";


const SellerRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSellerRequest = async (e) => {
    e.preventDefault();
    if (!user?.email) return toast.error("User not found!");

    try {
      setLoading(true);
      const requestData = {
        email: user.email,
        name: user.displayName || "",
        message,
        status: "pending", // initial status
        requested_at: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/seller-requests", requestData);

      if (res.data.success) {
        toast.success("Seller request submitted successfully!");
        setMessage(""); // reset message
      } else {
        toast.error(res.data.message || "Request already submitted!");
      }
    } catch (error) {
      console.error("Error submitting seller request:", error);
      toast.error("Failed to submit request!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-cyan-100 shadow-2xl rounded-md mt-8">
      <h2 className="text-2xl font-bold text-black mb-4 text-center">Become a Seller 🌱</h2>
      <form onSubmit={handleSellerRequest} className="space-y-4">
        <div>
          <label className="block mb-1 text-black text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={user?.displayName || ""}
            disabled
            className="w-full p-2 text-gray-700 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1 text-black text-sm font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full p-2 text-gray-700 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-black font-medium">
            Why do you want to become a seller?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="Write your request message..."
            className="w-full p-2 rounded-md border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-colors"
        >
          {loading ? <Fan className="font-bold text-9xl text-white rounded-md transition-colors animate-spin mx-auto" /> : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default SellerRequest;
