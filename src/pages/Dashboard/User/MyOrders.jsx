import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CircleAlert,
  Eye,
  LoaderCircle,
  Package,
  PackageOpen,
  RefreshCw,
  ShoppingBag,
  Trash2,
  WalletCards,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/orders?email=${encodeURIComponent(user.email)}`
      );
      return res.data;
    },
    enabled: !!user?.email,
    retry: false,
  });

  const handleDelete = id => {
    toast(
      confirmation => (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-800">
            Delete this order from your list?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(confirmation.id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(confirmation.id);
                try {
                  await axiosSecure.delete(`/orders/${id}`);
                  toast.success("Order removed.");
                  await refetch();
                } catch (error) {
                  toast.error(error.response?.data?.message || "Could not delete the order.");
                }
              }}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Delete order
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (isLoading) return <LoadingSpinner />;

  const paidCount = orders.filter(
    order => order.order_status?.toLowerCase() === "paid"
  ).length;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <ShoppingBag size={14} />
              Customer workspace
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              My orders
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Review your purchases, finish a payment, or follow your order details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {isFetching ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Refresh orders
          </button>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Total orders</p>
            <p className="mt-1 text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Paid orders</p>
            <p className="mt-1 text-2xl font-bold">{paidCount}</p>
          </div>
        </div>
      </header>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <CircleAlert size={25} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Orders couldn’t load</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Please check your connection and try loading your orders again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-16">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <PackageOpen size={29} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900">No orders yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your next favorite find is waiting. Explore the GreenBasket collection and your orders will appear here.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Browse products <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {orders.map((order, index) => {
            const isPaid = order.order_status?.toLowerCase() === "paid";
            return (
              <article
                key={order._id}
                className="min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
                  <Link
                    to={`/products/${order.productId}`}
                    aria-label={`View ${order.title || "product"}`}
                    className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 text-emerald-700 sm:h-24 sm:w-24"
                  >
                    <Package size={28} />
                    {order.image && (
                      <img
                        src={order.image}
                        alt={order.title || "Ordered product"}
                        onError={event => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Order #{index + 1}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {isPaid ? "Paid" : "Payment due"}
                      </span>
                    </div>
                    <h3 className="mt-2 break-words text-base font-bold text-slate-900 sm:text-lg">
                      {order.title || "GreenBasket product"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-emerald-800">
                      {order.price ?? "—"} {order.currency || "BDT"}
                    </p>
                    <div className="mt-3 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
                      <p className="truncate" title={order._id}>
                        Order ID: {order._id}
                      </p>
                      <p className="truncate" title={order.seller_email}>
                        Seller: {order.seller_email || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:px-5">
                  <Link
                    to={`/products/${order.productId}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 sm:flex-none"
                  >
                    <Eye size={16} /> View product
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/dashboard/payment/${order.productId}`, {
                        state: { orderId: order._id },
                      })
                    }
                    disabled={isPaid}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 sm:flex-none"
                  >
                    <WalletCards size={16} /> {isPaid ? "Paid" : "Pay now"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(order._id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-white px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 sm:flex-none"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyOrders;
