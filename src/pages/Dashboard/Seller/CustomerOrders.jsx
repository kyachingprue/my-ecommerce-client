import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Eye,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const orderStatuses = [
  "confirmed",
  "processing",
  "packaging",
  "shipped",
  "out for delivery",
  "delivered",
  "cancelled",
];

const statusClass = status => {
  switch (String(status || "pending").toLowerCase()) {
    case "delivered":
      return "bg-emerald-50 text-emerald-800";
    case "confirmed":
      return "bg-emerald-50 text-emerald-800";
    case "shipped":
      return "bg-sky-50 text-sky-800";
    case "processing":
      return "bg-amber-50 text-amber-800";
    case "cancelled":
      return "bg-rose-50 text-rose-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const CustomerOrders = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: orders = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: isAdmin ? ["adminOrders"] : ["sellerOrders", user?.email],
    queryFn: async () => {
      const response = isAdmin
        ? await axiosSecure.get("/admin-orders")
        : await axiosSecure.get(
            `/seller-orders/${encodeURIComponent(user.email)}`
          );
      return response.data.data;
    },
    enabled: isAdmin || !!user?.email,
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosSecure.patch(`/orders/${id}`, { status });
      return response.data;
    },
    onSuccess: async (response, variables) => {
      if (response.modifiedCount > 0 || response.matchedCount > 0) {
        toast.success(`Order updated to ${variables.status}.`);
        await queryClient.invalidateQueries({
          queryKey: isAdmin ? ["adminOrders"] : ["sellerOrders", user.email],
        });
        await queryClient.invalidateQueries({
          queryKey: ["trackedProducts"],
        });
      } else {
        toast.error("The order status was not updated.");
      }
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Could not update the order status.");
    },
  });

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter(order => {
      const status = String(order.status || "pending").toLowerCase();
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesSearch =
        !query ||
        `${order.user_email || ""} ${order.seller_email || ""} ${order.productTitle || ""} ${order.productId || ""}`
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle size={32} className="animate-spin text-emerald-700" />
      </div>
    );
  }

  const deliveredCount = orders.filter(
    order => order.status?.toLowerCase() === "delivered"
  ).length;
  const activeCount = orders.filter(
    order => !["delivered", "cancelled"].includes(order.status?.toLowerCase())
  ).length;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <Truck size={14} />
              {isAdmin ? "Admin workspace" : "Seller workspace"}
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {isAdmin ? "All customer orders" : "Customer orders"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              {isAdmin
                ? "Review paid marketplace orders and manage their delivery tracking."
                : "Review paid orders for your products and keep customers updated as you fulfill them."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white focus-within:ring-2 focus-within:ring-white/40 sm:min-w-56 xl:flex-none">
              <Search size={17} className="shrink-0 text-emerald-100/70" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search orders"
                aria-label="Search by customer, product, or order ID"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-emerald-100/60"
              />
            </label>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-70"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Total orders</p>
            <p className="mt-1 text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">In progress</p>
            <p className="mt-1 text-2xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Delivered</p>
            <p className="mt-1 text-2xl font-bold">{deliveredCount}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <span className="px-1 text-sm font-semibold text-slate-600">Order status</span>
        <div className="grid flex-1 grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {["all", ...orderStatuses].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`rounded-xl px-3 py-2 text-sm font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
                statusFilter === status
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <span className="px-1 text-xs text-slate-500" aria-live="polite">
          {filteredOrders.length} shown
        </span>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm">
          <AlertCircle className="mx-auto text-rose-600" size={29} />
          <h3 className="mt-4 font-bold text-slate-900">Orders couldn’t load</h3>
          <p className="mt-2 text-sm text-slate-500">Please check your connection and try again.</p>
          <button type="button" onClick={() => refetch()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-800">
            <ShoppingBag size={29} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900">
            {isAdmin ? "No paid orders yet" : "No paid customer orders yet"}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {isAdmin
              ? "Successful customer payments will appear here for tracking."
              : "Successful payments for your products will appear here for fulfillment."}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
          <Search className="mx-auto text-slate-300" size={28} />
          <h3 className="mt-4 font-bold text-slate-900">No orders match your filters</h3>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="mt-3 text-sm font-semibold text-emerald-800 underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredOrders.map(order => (
            <article key={order._id} className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-lg hover:shadow-slate-900/5 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <PackageCheck size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="break-words font-bold text-slate-900">
                      {order.productTitle || order.title || "Product order"}
                    </h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(order.status)}`}>
                      {order.status || "pending"}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    Customer: {order.user_email || "Not specified"}
                  </p>
                  {isAdmin && (
                    <p className="mt-1 break-all text-sm text-slate-500">
                      Seller: {order.seller_email || "Not specified"}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span>Qty: {order.quantity || 1}</span>
                    <span className="font-semibold text-emerald-800">
                      {order.price ?? "—"} {order.currency || "BDT"}
                    </span>
                    {order.order_status && (
                      <span className="capitalize">Payment: {order.order_status}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to={`/products/${order.productId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <Eye size={16} /> View product
                </Link>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  Update tracking
                  <select
                    value={order.status || "pending"}
                    onChange={event =>
                      updateStatusMutation.mutate({
                        id: order._id,
                        status: event.target.value,
                      })
                    }
                    disabled={updateStatusMutation.isPending}
                    aria-label={`Update status for ${order.productTitle || "order"}`}
                    className="min-w-36 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium capitalize text-slate-700 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CustomerOrders;
