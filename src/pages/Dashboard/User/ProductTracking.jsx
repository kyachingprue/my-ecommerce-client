import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BadgeCheck,
  CircleAlert,
  Clock3,
  MapPinned,
  Package,
  PackageCheck,
  RefreshCw,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

const trackingSteps = [
  "Pending",
  "Confirmed",
  "Packaging",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

const normalizeStatus = status =>
  String(status || "pending")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

const formatDate = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ProductTracking = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: trackedProducts = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["trackedProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/track-products/${encodeURIComponent(user.email)}`
      );
      return res.data.data;
    },
    enabled: !!user?.email,
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;

  const deliveredCount = trackedProducts.filter(
    item => normalizeStatus(item.orderStatus) === "delivered"
  ).length;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <MapPinned size={14} />
              Delivery updates
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Order tracking
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Follow your purchases from confirmation to delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh tracking
          </button>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Tracked orders</p>
            <p className="mt-1 text-2xl font-bold">{trackedProducts.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Delivered</p>
            <p className="mt-1 text-2xl font-bold">{deliveredCount}</p>
          </div>
        </div>
      </header>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <CircleAlert size={25} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Tracking information couldn’t load
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Please try again to get the latest delivery updates.
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
      ) : trackedProducts.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-16">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-800">
            <Truck size={29} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900">
            Nothing is on the way yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Complete an order to see its payment and delivery progress here.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Shop GreenBasket <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {trackedProducts.map(item => {
            const currentStatus = normalizeStatus(item.orderStatus);
            const currentStep = trackingSteps.findIndex(
              step => normalizeStatus(step) === currentStatus
            );
            const paymentStatus = String(item.paymentStatus || "pending").toLowerCase();
            const paymentComplete = paymentStatus === "succeeded";
            const paymentFailed = paymentStatus === "failed";

            return (
              <article
                key={item._id}
                className="min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 text-emerald-700 sm:h-24 sm:w-24">
                    <Package size={28} />
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productTitle || "Tracked product"}
                        onError={event => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          paymentComplete
                            ? "bg-emerald-50 text-emerald-800"
                            : paymentFailed
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {paymentComplete
                          ? "Payment complete"
                          : paymentFailed
                            ? "Payment failed"
                            : `Payment ${paymentStatus}`}
                      </span>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold capitalize text-cyan-900">
                        {item.orderStatus || "Pending"}
                      </span>
                    </div>
                    <h3 className="mt-3 break-words text-lg font-bold text-slate-900">
                      {item.productTitle || "GreenBasket product"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-emerald-800">
                      {item.price ?? "—"} {item.currency || "BDT"}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 size={14} />
                      Updated from order placed {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-4 py-5 sm:px-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-800">Delivery progress</p>
                    {currentStatus === "delivered" ? (
                      <BadgeCheck size={18} className="text-emerald-700" />
                    ) : (
                      <PackageCheck size={18} className="text-cyan-700" />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-6">
                    {trackingSteps.map((step, index) => {
                      const completed = currentStep >= index;
                      return (
                        <div key={step} className="flex min-w-0 flex-col items-center text-center">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              completed
                                ? "bg-emerald-700 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span
                            className={`mt-1.5 text-[10px] leading-4 sm:text-[11px] ${
                              completed ? "font-semibold text-emerald-800" : "text-slate-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductTracking;
