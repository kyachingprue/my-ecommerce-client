import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { ChevronRight, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { role, userData } = useRole();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = event => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = event => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = event => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin/all-users";
    if (role === "seller") return "/dashboard/seller/products";
    return "/dashboard/orders";
  };

  const profileInitial = (userData.name || user?.displayName || user?.email || "G")
    .trim()
    .slice(0, 1)
    .toUpperCase();
  const profileImage = userData.profileImage || userData.photo || user?.photoURL;
  const profileName = userData.name || user?.displayName || "GreenBasket member";

  const handleSearch = event => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setMobileNavOpen(false);
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
          Products
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
          About
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="pb-20">
      <header
        className={`fixed left-0 top-0 z-50 mx-auto flex w-full items-center justify-between gap-2 rounded-md px-3 py-3 shadow-2xl transition-all duration-300 sm:px-4 md:gap-0 ${
          isScrolled ? "bg-white/90 shadow-md" : "bg-white"
        }`}
      >
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileNavOpen(true)}
          className="btn btn-ghost btn-circle text-gray-800 lg:hidden"
        >
          <FiMenu className="h-7 w-7" aria-hidden="true" />
        </button>

        <Link to="/" className="shrink-0" aria-label="GreenBasket home">
          <div className="flex items-center">
            <p className="text-xl md:text-4xl">🌿</p>
            <h3 className="text-lg font-serif font-bold text-black sm:text-xl md:text-2xl lg:text-3xl">
              GreenBasket
            </h3>
          </div>
        </Link>

        <div className="hidden w-full px-3 lg:block lg:px-5">
          <div className="flex w-full items-center">
            <ul className="main-nav flex items-center gap-5 px-4 font-serif text-sm text-gray-600 md:text-base">
              {navLinks}
            </ul>
            <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-2xl items-center px-2">
              <label className="input w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </g>
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  required
                  placeholder="Search products"
                  className="outline-none"
                  aria-label="Search products"
                />
              </label>
              <button type="submit" className="btn btn-info ml-3 text-sm active:scale-95 md:text-base">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center gap-2 sm:gap-4 md:gap-3">
          <Link to={getDashboardLink()} aria-label="Shopping cart">
            <MdAddShoppingCart className="text-2xl text-cyan-900 md:text-3xl" />
          </Link>

          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={menuOpen}
                aria-controls="account-menu"
                aria-haspopup="true"
                onClick={() => setMenuOpen(!menuOpen)}
                className="group relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-emerald-950 outline-none transition duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-emerald-500/25 sm:h-12 sm:w-12"
              >
                <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-lime-100 to-emerald-200 ring-2 ring-white shadow-sm transition group-hover:ring-emerald-300 sm:h-11 sm:w-11">
                  <span aria-hidden="true">{profileInitial}</span>
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt=""
                      loading="lazy"
                      onError={event => {
                        event.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </span>
                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </button>

              {menuOpen && (
                <div
                  id="account-menu"
                  aria-label="Account options"
                  className="absolute right-0 z-[70] mt-3 w-[min(90vw,340px)] origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/15"
                >
                  <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 p-4 text-white">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-lime-100 to-emerald-200 text-sm font-bold text-emerald-950 ring-2 ring-white/80">
                      {profileInitial}
                      {profileImage && (
                        <img
                          src={profileImage}
                          alt=""
                          loading="lazy"
                          onError={event => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {profileName}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-emerald-100/75">
                        {user.email}
                      </span>
                      <span className="mt-2 inline-flex rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-medium capitalize text-emerald-50">
                        {role || "user"} account
                      </span>
                    </span>
                  </div>

                  <div className="space-y-1.5 p-2.5">
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-950 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-emerald-800">
                        <LayoutDashboard size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">Dashboard</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Manage your account</span>
                      </span>
                      <ChevronRight size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" />
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-950 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-emerald-800">
                        <UserRound size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">Profile</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Update your personal details</span>
                      </span>
                      <ChevronRight size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" />
                    </Link>

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-rose-700 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition group-hover:bg-white">
                        <LogOut size={18} />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block text-sm font-semibold">
                          {loggingOut ? "Logging out..." : "Logout"}
                        </span>
                        <span className="mt-0.5 block text-xs text-rose-500/80">Sign out of your account</span>
                      </span>
                      <ChevronRight size={16} className="text-rose-300 transition group-hover:translate-x-0.5 group-hover:text-rose-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-accent px-3 text-sm active:scale-95 sm:px-4 md:text-base">
                Login
              </Link>
              <Link to="/register" className="btn btn-info hidden active:scale-95 md:inline-flex md:text-sm lg:text-base">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          mobileNavOpen ? "" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          aria-hidden={!mobileNavOpen}
          tabIndex={mobileNavOpen ? 0 : -1}
          onClick={() => setMobileNavOpen(false)}
          className={`absolute inset-0 h-full w-full bg-slate-950/45 transition-opacity duration-300 ${
            mobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!mobileNavOpen}
          inert={!mobileNavOpen}
          className={`absolute bottom-0 left-0 top-0 flex w-[min(86vw,360px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
            <Link
              to="/"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center"
            >
              <span className="text-2xl">🌿</span>
              <span className="ml-1 font-serif text-xl font-bold text-gray-900">GreenBasket</span>
            </Link>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileNavOpen(false)}
              className="btn btn-ghost btn-circle text-gray-700"
            >
              <FiX className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="main-nav flex-1 px-5 py-6" aria-label="Main navigation">
            <ul className="flex flex-col gap-3 font-medium text-gray-700">
              {navLinks}
            </ul>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3">
              <label className="input w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </g>
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  required
                  placeholder="Search products"
                  className="outline-none"
                  aria-label="Search products"
                />
              </label>
              <button type="submit" className="btn btn-info w-full active:scale-95">
                Search products
              </button>
            </form>

            {!user && (
              <Link
                to="/register"
                onClick={() => setMobileNavOpen(false)}
                className="btn btn-outline btn-success mt-6 w-full"
              >
                Create an account
              </Link>
            )}
          </nav>
          <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
            Fresh groceries, delivered with care.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Navbar;
