import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  CircleAlert,
  Clock3,
  LoaderCircle,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const formatDate = value => {
  if (!value) return "Date not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not provided"
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-800 ring-amber-600/10",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-600/10",
  rejected: "bg-rose-50 text-rose-800 ring-rose-600/10",
};

const SellerRequestsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: requests = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["sellerRequests"],
    queryFn: async () => {
      const response = await axiosSecure.get("/seller-requests");
      return response.data;
    },
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosSecure.patch(`/seller-requests/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Seller request updated.");
      queryClient.invalidateQueries({ queryKey: ["sellerRequests"] });
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Could not update this request.");
    },
  });

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter(request => {
      const matchesStatus =
        statusFilter === "all" || request.status?.toLowerCase() === statusFilter;
      const matchesSearch =
        !query ||
        `${request.name || ""} ${request.email || ""} ${request.message || ""}`
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [requests, search, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-emerald-700" size={32} />
      </div>
    );
  }

  const countByStatus = status =>
    requests.filter(request => request.status?.toLowerCase() === status).length;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <ShieldCheck size={14} />
              Partner onboarding
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Seller requests
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Review applications and make decisions about new marketplace partners.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white focus-within:ring-2 focus-within:ring-white/40 sm:min-w-56 xl:flex-none">
              <Search size={17} className="shrink-0 text-emerald-100/70" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search applications"
                aria-label="Search seller requests"
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
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["All requests", requests.length],
            ["Pending", countByStatus("pending")],
            ["Approved", countByStatus("approved")],
            ["Rejected", countByStatus("rejected")],
          ].map(([label, count]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-medium text-emerald-50/75">{label}</p>
              <p className="mt-1 text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <span className="px-1 text-sm font-semibold text-slate-600">Filter by status</span>
        <div className="grid flex-1 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {["all", "pending", "approved", "rejected"].map(status => (
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
        <span className="px-1 text-xs font-medium text-slate-500" aria-live="polite">
          Showing {filteredRequests.length} of {requests.length}
        </span>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm">
          <CircleAlert className="mx-auto text-rose-600" size={28} />
          <h3 className="mt-4 font-bold text-slate-900">Requests couldn’t load</h3>
          <p className="mt-2 text-sm text-slate-500">Please check the server and try again.</p>
          <button type="button" onClick={() => refetch()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Store size={26} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {requests.length ? "No requests match these filters" : "No seller applications yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {requests.length
              ? "Try another search or status."
              : "New seller applications will appear here for review."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredRequests.map(request => {
            const status = request.status?.toLowerCase() || "pending";
            const pending = status === "pending";
            const changingThisRequest =
              updateStatusMutation.isPending &&
              updateStatusMutation.variables?.id === request._id;
            const name = request.name || request.email || "Seller applicant";
            return (
              <article key={request._id} className="min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-lg hover:shadow-slate-900/5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                    <UserRound size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="break-words font-bold text-slate-900">{name}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[status] || statusStyles.pending}`}>
                        {status === "approved" ? <BadgeCheck size={14} /> : status === "rejected" ? <XCircle size={14} /> : <Clock3 size={14} />}
                        {status}
                      </span>
                    </div>
                    <a
                      href={`mailto:${request.email}`}
                      className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm text-emerald-800 underline-offset-2 hover:underline"
                    >
                      <Mail size={14} className="shrink-0" />
                      {request.email || "Email not provided"}
                    </a>
                    <p className="mt-1 text-xs text-slate-400">
                      Submitted {formatDate(request.requested_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Application message
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {request.message || "No application message provided."}
                  </p>
                </div>

                {pending && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatusMutation.mutate({ id: request._id, status: "approved" })}
                      disabled={updateStatusMutation.isPending}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:cursor-wait disabled:opacity-60"
                    >
                      {changingThisRequest ? <LoaderCircle size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
                      Approve seller
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatusMutation.mutate({ id: request._id, status: "rejected" })}
                      disabled={updateStatusMutation.isPending}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-wait disabled:opacity-60"
                    >
                      {changingThisRequest ? <LoaderCircle size={16} className="animate-spin" /> : <XCircle size={16} />}
                      Reject request
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SellerRequestsAdmin;
