import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const SalesAnalytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [chartData, setChartData] = useState([]);

  // Fetch products for seller
  const { data: products = [] } = useQuery({
    queryKey: ["sellerProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?sellerEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch orders for seller's products
  const { data: orders = [] } = useQuery({
    queryKey: ["sellerOrders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?sellerEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!products.length) return;

    // Build chart data with all products
    const data = products.map((product) => {
      const productOrders = orders.filter((o) => o.productId === product._id);
      const revenue = productOrders.reduce((acc, o) => acc + (o.amount || 0), 0);
      return {
        name: product.title,
        stock: product.stock || 0,
        sold: productOrders.length,
        revenue: revenue,
      };
    });

    setChartData(data);
  }, [products, orders]);

  // Calculate totals
  const totalProducts = products.length;
  const totalSold = orders.length;
  const totalRevenue = chartData.reduce((acc, item) => acc + item.revenue, 0);

  return (
    <div className="p-5 min-h-screen bg-gray-200">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-amber-700 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">Total Products</p>
          <h2 className="text-4xl font-bold mt-2">{totalProducts}</h2>
        </div>
        <div className="bg-cyan-700 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">Total Sold</p>
          <h2 className="text-4xl font-bold mt-2">{totalSold}</h2>
        </div>
        <div className="bg-fuchsia-700 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">Total Revenue</p>
          <h2 className="text-4xl font-bold mt-2">৳ {totalRevenue}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Products Sold vs Stock</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#34d399" name="Stock" />
              <Bar dataKey="sold" fill="#f87171" name="Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Revenue per Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
