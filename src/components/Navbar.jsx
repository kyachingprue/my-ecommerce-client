import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import useRole from "../Hooks/useRole";
import { CiLogout } from "react-icons/ci";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { role, roleLoading } = useRole();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin/all-users";
    if (role === "seller") return "/dashboard/seller/products";
    return "/dashboard/orders";
  };

  if (roleLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }

  const handleSearch = () => {
    // navigate to products page with query as URL param
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="mb-20">
      <div
        className={`fixed w-full top-0 left-0 z-50 transition-all flex mx-auto px-2 items-center justify-between md:justify-baseline rounded-md shadow-2xl py-5 duration-300 ${isScrolled ? "bg-black shadow-md" : "bg-black"
          }`}
      >
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost text-white lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 main-nav rounded-box z-1 mt-3 w-36 p-2 shadow"
          >
            <h3 className="text-blue-900 block text-md md:hidden font-medium py-2 px-2">
              GreenBasket
            </h3>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>Products</NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link to="/">
          <div className="flex items-center">
            <p className="text-4xl">🌿</p>
            <h3 className="text-blue-200 hidden md:block text-xl md:text-2xl lg:text-3xl font-medium">
              GreenBasket
            </h3>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="w-full hidden md:block ">
          <div className="flex items-center w-full">
            <ul className="flex items-center gap-3 main-nav text-gray-200 px-4 text-sm">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>Products</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
              </li>
            </ul>
            <div className="flex w-full items-center px-4">
              <label className="input w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input type="search" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} required placeholder="Search" />
              </label>
              <button onClick={handleSearch} className="btn btn-info">Search</button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4 relative">
          {/* Cart Icon */}
          <Link to={getDashboardLink()}>
            <MdAddShoppingCart className="text-2xl md:text-3xl text-white" />
          </Link>

          {/* ✅ User Login Condition */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="focus:outline-none"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-12 h-12 object-cover mr-8 rounded-full border-2 border-green-400"
                  />
                ) : (
                  <FaUserCircle className="text-5xl mr-4 text-white" />
                )}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg p-2">
                  <p className="text-center text-sm font-bold text-white rounded-md px-2 bg-cyan-950 border-b pb-1 ">
                    {user.displayName || "User"}
                  </p>
                  <ul className="mt-2 space-y-1 px-5 text-gray-700 text-sm">
                    <li className="mt-2">
                      <Link to="/" className="border hover:bg-cyan-700 hover:text-white border-gray-200 px-8 rounded-md" onClick={() => setMenuOpen(false)}>
                        Home
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link to="/products" className="border hover:bg-cyan-700 hover:text-white border-gray-200 px-6 rounded-md" onClick={() => setMenuOpen(false)}>
                        Products
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link to="/about" className="border hover:bg-cyan-700 hover:text-white border-gray-200 px-8 rounded-md" onClick={() => setMenuOpen(false)}>
                        About
                      </Link>
                    </li>
                    <li className="mt-2">
                      <Link to={getDashboardLink()} className="border hover:bg-cyan-700 hover:text-white border-gray-200 px-5 rounded-md" onClick={() => setMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-blue-700 flex items-center gap-1 font-bold py-1 px-5 border hover:bg-cyan-800 hover:text-white border-gray-200 rounded-md"
                      >
                        <span><CiLogout className="text-xl" /></span> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-accent text-sm">
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
