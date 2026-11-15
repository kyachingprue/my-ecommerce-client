import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  ChevronRight,
  CirclePlus,
  ClipboardList,
  CreditCard,
  Leaf,
  LogOut,
  Menu,
  Package,
  PackageCheck,
  ShoppingBag,
  Store,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import LoadingSpinner from "../components/LoadingSpinner";
import useTitle from "../Hooks/useTitle";

const workspaces = {
  user: {
    name: "Customer",
    description: "Your shopping space",
    icon: ShoppingBag,
    links: [
      { to: "/dashboard/orders", label: "My orders", icon: <PackageCheck size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/payment-history", label: "Payment history", icon: <CreditCard size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/order-tracking", label: "Order tracking", icon: <ClipboardList size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/profile", label: "My profile", icon: <UserRound size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/seller-request", label: "Become a seller", icon: <Store size={17} strokeWidth={1.9} /> },
    ],
  },
  seller: {
    name: "Seller",
    description: "Manage your shop",
    icon: Store,
    links: [
      { to: "/dashboard/seller/products", label: "My products", icon: <Package size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/seller/add-product", label: "Add a product", icon: <CirclePlus size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/seller/orders", label: "Customer orders", icon: <ClipboardList size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/seller/analytics", label: "Sales analytics", icon: <BarChart3 size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/profile", label: "My profile", icon: <UserRound size={17} strokeWidth={1.9} /> },
    ],
  },
  admin: {
    name: "Admin",
    description: "Manage GreenBasket",
    icon: Boxes,
    links: [
      { to: "/dashboard/admin/all-users", label: "Users", icon: <Users size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/admin/all-sellers", label: "Sellers", icon: <Store size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/admin/all-products", label: "Products", icon: <Package size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/admin/orders", label: "Orders & tracking", icon: <ClipboardList size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/admin/add-product", label: "Add product", icon: <CirclePlus size={17} strokeWidth={1.9} /> },
      { to: "/dashboard/admin/reports", label: "Reports & analytics", icon: <BarChart3 size={17} strokeWidth={1.9} /> },
      {
        to: "/dashboard/admin/seller-request-admin",
        label: "Seller requests",
        icon: <ClipboardList size={17} strokeWidth={1.9} />,
      },
      { to: "/dashboard/profile", label: "My profile", icon: <UserRound size={17} strokeWidth={1.9} /> },
    ],
  },
};

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const { role, userData, roleLoading, isError } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  const workspace = workspaces[role] || workspaces.user;
  const currentLink = workspace.links.find(
    (item) =>
      location.pathname === item.to ||
      location.pathname.startsWith(`${item.to}/`)
  );
  const pageTitle =
    currentLink?.label ||
    (location.pathname.includes("/edit-product/")
      ? "Edit product"
      : location.pathname.includes("/payment/")
        ? "Checkout"
        : "Dashboard");
  const initials = (user?.displayName || user?.email || "U")
    .slice(0, 1)
    .toUpperCase();
  const profileImage = userData.profileImage || userData.photo || user?.photoURL;
  const WorkspaceIcon = workspace.icon;

  useTitle(`${workspace.name} Dashboard`);

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Could not sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (authLoading || roleLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f5] px-5">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Boxes size={25} />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            Dashboard unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn&apos;t load your account details. Please refresh the page
            or try again in a moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-slate-800">
      {drawerOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          className="fixed inset-0 z-40 cursor-default bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeDrawer}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          drawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <Link
            to="/"
            onClick={closeDrawer}
            className="group inline-flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-800 text-white shadow-lg shadow-emerald-900/15 transition group-hover:-rotate-6">
              <Leaf size={21} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[17px] font-bold tracking-tight text-slate-900">
                GreenBasket
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                Fresh living
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={closeDrawer}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl bg-[#f4f8f3] px-3.5 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
            <WorkspaceIcon size={19} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-800">
              {workspace.name} workspace
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {workspace.description}
            </span>
          </span>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <ul className="space-y-1">
            {workspace.links.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                      isActive
                        ? "bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-900/[0.03]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-white text-emerald-800 shadow-sm"
                            : "text-slate-400 group-hover:text-emerald-700"
                        }`}
                      >
                        {icon}
                      </span>
                      <span className="min-w-0 flex-1">{label}</span>
                      {isActive && (
                        <ChevronRight size={15} className="text-emerald-700" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <Link
            to="/"
            onClick={closeDrawer}
            className="mb-3 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-800"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <Store size={17} />
              </span>
              Back to storefront
            </span>
            <ArrowUpRight size={15} />
          </Link>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-900 ring-2 ring-white">
              {initials}
              {profileImage && (
                <img
                  src={profileImage}
                  alt=""
                  onError={event => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-slate-800">
                {user?.displayName || user?.email || "GreenBasket member"}
              </span>
              <span className="mt-0.5 block text-[11px] capitalize text-slate-500">
                {workspace.name} account
              </span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:ml-[272px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open dashboard menu"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              >
                <Menu size={19} />
              </button>
              <div className="min-w-0">
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 sm:block">
                  {workspace.name} workspace
                </p>
                <h1 className="truncate text-base font-semibold text-slate-900 sm:mt-0.5 sm:text-lg">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 sm:text-sm"
              >
                <span className="hidden sm:inline">Visit storefront</span>
                <ArrowUpRight size={16} />
              </Link>
              <span className="hidden h-8 w-px bg-slate-200 sm:block" />
              <Link
                to="/dashboard/profile"
                onClick={closeDrawer}
                className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-1.5 transition hover:bg-slate-50 sm:pr-2.5"
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 ring-2 ring-white">
                  {initials}
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt=""
                      onError={event => {
                        event.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </span>
                <span className="hidden max-w-36 text-left sm:block">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    {user?.displayName || "Your account"}
                  </span>
                  <span className="mt-0.5 block text-[10px] capitalize text-slate-500">
                    {workspace.name}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
