import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CircleAlert,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const formatDate = value => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    refetch,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.filter(user => user.role === "user");
    },
    retry: false,
  });

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter(user =>
      `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(query)
    );
  }, [users, search]);

  const handleDelete = id => {
    toast(
      confirmation => (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Delete this customer account?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(confirmation.id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(confirmation.id);
                try {
                  const response = await axiosSecure.delete(`/users/${id}`);
                  if (response.data.deletedCount > 0) {
                    toast.success("Customer account deleted.");
                    await refetch();
                  } else {
                    toast.error("The customer account could not be deleted.");
                  }
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Could not delete the customer account."
                  );
                }
              }}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Delete account
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><LoaderCircle className="animate-spin text-emerald-700" size={32} /></div>;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <Shield size={14} />
              Administration
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Customers</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Review customer accounts and manage access to the GreenBasket community.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white focus-within:ring-2 focus-within:ring-white/40 sm:min-w-64 lg:flex-none">
              <Search size={17} className="shrink-0 text-emerald-100/70" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search customers"
                aria-label="Search customers"
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
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Customer accounts</p>
            <p className="mt-1 text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Search results</p>
            <p className="mt-1 text-2xl font-bold">{filteredUsers.length}</p>
          </div>
        </div>
      </header>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm">
          <CircleAlert className="mx-auto text-rose-600" size={28} />
          <h3 className="mt-4 font-bold text-slate-900">Customers couldn’t load</h3>
          <p className="mt-2 text-sm text-slate-500">Please check the server and try again.</p>
          <button type="button" onClick={() => refetch()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Users size={26} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {search ? "No matching customers" : "No customer accounts yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {search ? "Try another name or email address." : "New customer accounts will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredUsers.map((user, index) => {
            const name = user.name || user.email || "GreenBasket customer";
            const initials = name.trim().slice(0, 1).toUpperCase();
            const photo = user.profileImage || user.photo;
            return (
              <article key={user._id} className="min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
                <div className="flex items-start gap-3">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 font-bold text-emerald-800">
                    {initials}
                    {photo && (
                      <img src={photo} alt="" onError={event => { event.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900" title={name}>{name}</p>
                    <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-sky-800">
                    {user.role || "user"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">Joined</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(user.created_at)}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-xs text-slate-400"><Clock3 size={12} /> Last active</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(user.last_login || user.lasted_login)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(user._id)}
                  aria-label={`Delete ${name}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                >
                  <Trash2 size={16} /> Delete customer
                </button>
                <span className="sr-only">Customer {index + 1} of {filteredUsers.length}</span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AllUsers;
