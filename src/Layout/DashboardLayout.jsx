import React, { useState } from "react";
import {
  FaUser,
  FaBox,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHistory,
  FaClipboardList,
  FaUsers,
  FaStore,
  FaChartBar,
  FaCogs,
} from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../Hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import useTitle from "../Hooks/useTitle";


const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { isPending, data: userRole = [] } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`)
      return res.data;
    }
  })

  useTitle("Dashboard-layout")

  if (isPending) {
    return <LoadingSpinner></LoadingSpinner>
  }

  const userLinks = [
    { to: "/dashboard/orders", label: "My Orders", icon: <FaShoppingCart /> },
    { to: "/dashboard/payment-history", label: "Payment History", icon: <FaHistory /> },
    { to: "/dashboard/order-tracking", label: "Order Tracking", icon: <FaClipboardList /> },
    { to: "/dashboard/profile", label: "Profile Update", icon: <FaUser /> },
    { to: "/dashboard/seller-request", label: "Send Seller Request", icon: <FaUser /> },
  ];

  const sellerLinks = [
    { to: "/dashboard/seller/products", label: "My Products", icon: <FaBox /> },
    { to: "/dashboard/seller/add-product", label: "Add New Product", icon: <FaCogs /> },
    { to: "/dashboard/seller/orders", label: "Customer Orders", icon: <FaClipboardList /> },
    { to: "/dashboard/seller/analytics", label: "Sales Analytics", icon: <FaChartBar /> },
    { to: "/dashboard/profile", label: "Profile Update", icon: <FaUser /> },
  ];

  const adminLinks = [
    { to: "/dashboard/admin/all-users", label: "Manage Users", icon: <FaUsers /> },
    { to: "/dashboard/admin/all-sellers", label: "Manage Sellers", icon: <FaStore /> },
    { to: "/dashboard/admin/all-products", label: "Manage Products", icon: <FaBox /> },
    { to: "/dashboard/admin/reports", label: "Reports & Analytics", icon: <FaChartBar /> },
    { to: "/dashboard/admin/seller-request-admin", label: "SellerRequestsAdmin", icon: <FaUser /> },
    { to: "/dashboard/profile", label: "Profile Update", icon: <FaUser /> },
  ];

  const role = userRole?.role;

  const navLinks =
    role === "admin" ? adminLinks :
      role === "seller" ? sellerLinks :
        userLinks;

  const handleNavClick = () => setDrawerOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* ===== Mobile Header ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 py-3 shadow-sm">
        <Link to="/" className="text-lg font-semibold text-green-600">
          GreenBasket
        </Link>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="text-gray-700 dark:text-gray-200"
        >
          {drawerOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </header>

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 lg:w-64 bg-green-600 text-white z-30 transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="h-16 lg:h-20 flex items-center px-6 border-b border-green-500">
          <Link to="/" onClick={handleNavClick} className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">GreenBasket</span>
            <span className="text-xs text-green-100/80">
              (Dashboard)
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="px-2 py-4 overflow-y-auto h-[calc(100vh-5rem)]">
          <ul className="space-y-1">
            {navLinks.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md mx-2 transition-colors text-sm ${isActive
                      ? "bg-green-700/90 shadow-md font-semibold"
                      : "hover:bg-green-700/60"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ===== Overlay for Mobile ===== */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* ===== Main Content ===== */}
      <main className="flex-1 min-h-screen bg-gray-200 overflow-y-auto pt-14 lg:pt-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
