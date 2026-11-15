import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BadgeCheck,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const formatDate = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    isLoading,
    isFetching,
    isError,
    data: payments = [],
    refetch,
  } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments/${encodeURIComponent(user.email)}`
      );
      return res.data.data;
    },
    enabled: !!user?.email,
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;

  const successfulPayments = payments.filter(
    payment => payment.status?.toLowerCase() === "succeeded"
  ).length;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <CreditCard size={14} />
              Secure payments
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Payment history
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Your payment receipts and transaction details, all in one place.
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
            Refresh history
          </button>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Transactions</p>
            <p className="mt-1 text-2xl font-bold">{payments.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Successful</p>
            <p className="mt-1 text-2xl font-bold">{successfulPayments}</p>
          </div>
        </div>
      </header>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <CircleAlert size={25} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Payment history couldn’t load
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your payment records are safe. Please try loading them again.
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
      ) : payments.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-16">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ReceiptText size={29} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900">
            No payments to show
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Once you complete a purchase, your receipt and payment details will appear here.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Explore products <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {payments.map((payment, index) => {
            const isSuccessful = payment.status?.toLowerCase() === "succeeded";
            return (
              <article
                key={payment._id}
                className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isSuccessful
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {isSuccessful ? <BadgeCheck size={21} /> : <CreditCard size={21} />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Transaction {index + 1}
                      </p>
                      <h3 className="mt-1 break-words font-bold text-slate-900">
                        {payment.title || "GreenBasket purchase"}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      isSuccessful
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {payment.status || "Pending"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Amount</p>
                    <p className="mt-1 text-lg font-bold text-emerald-800">
                      {payment.amount ?? "—"} {payment.currency || "BDT"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Paid on</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatDate(payment.createdAt_string || payment.createdAt)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Product ID</p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-700" title={payment.productId}>
                      {payment.productId || "Not available"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Receipt ID</p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-700" title={payment._id}>
                      {payment._id || "Not available"}
                    </p>
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

export default PaymentHistory;
