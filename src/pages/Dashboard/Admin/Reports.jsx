import React from "react";
import { FaUserAlt, FaUserTie, FaBoxOpen, FaDollarSign } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Reports = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.filter(u => u.role === "user");
    },
  });

  // Fetch all sellers
  const { data: sellers = [] } = useQuery({
    queryKey: ["allSellers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.filter(u => u.role === "seller");
    },
  });

  // Fetch all products
  const { data: products = [] } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  // Example revenue calculation
  const totalRevenue = products.reduce((acc, product) => acc + (product.price || 0) * (product.stock || 0), 0);

  // Recharts data
  const productData = products.map(p => ({ name: p.title, stock: p.stock }));
  const revenueData = [
    { name: "Revenue", value: totalRevenue },
    { name: "Remaining", value: 100000 - totalRevenue } // Example remaining
  ];

  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="p-5 bg-cyan-100 rounded-2xl min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center justify-between gap-4 hover:scale-105 transition">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
            <FaUserAlt size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl text-gray-600 font-bold">{users.length}</p>
        </div>

        {/* Total Sellers */}
        <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center justify-between gap-4 hover:scale-105 transition">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full">
            <FaUserTie size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Sellers</h3>
          <p className="text-2xl text-gray-600 font-bold">{sellers.length}</p>
        </div>

        {/* Total Products */}
        <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center justify-between gap-4 hover:scale-105 transition">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
            <FaBoxOpen size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-2xl text-gray-600 font-bold">{products.length}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center justify-between gap-4 hover:scale-105 transition">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full">
            <FaDollarSign size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl text-gray-600 font-bold">BDT {totalRevenue}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Bar Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-5 col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Products Stock</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Pie Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
