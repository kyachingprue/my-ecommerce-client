import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  BarChart3,
  ClipboardList,
  Package,
  RefreshCw,
  Store,
  Users,
} from "lucide-react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ORDER_COLORS = ["#059669", "#f59e0b"];
const EMPTY_LIST = Object.freeze([]);

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await axiosSecure.get("/users");
      return response.data.filter(user => user.role === "user");
    },
    retry: false,
  });
  const sellersQuery = useQuery({
    queryKey: ["allSellers"],
    queryFn: async () => {
      const response = await axiosSecure.get("/users");
      return response.data.filter(user => user.role === "seller");
    },
    retry: false,
  });
  const productsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const response = await axiosSecure.get("/products");
      return response.data;
    },
    retry: false,
  });
  const ordersQuery = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await axiosSecure.get("/orders");
      return response.data;
    },
    retry: false,
  });
  const requestsQuery = useQuery({
    queryKey: ["sellerRequests"],
    queryFn: async () => {
      const response = await axiosSecure.get("/seller-requests");
      return response.data;
    },
    retry: false,
  });

  const users = usersQuery.data || EMPTY_LIST;
  const sellers = sellersQuery.data || EMPTY_LIST;
  const products = productsQuery.data || EMPTY_LIST;
  const orders = ordersQuery.data || EMPTY_LIST;
  const requests = requestsQuery.data || EMPTY_LIST;
  const queries = [usersQuery, sellersQuery, productsQuery, ordersQuery, requestsQuery];
  const isLoading = queries.some(query => query.isLoading);
  const isFetching = queries.some(query => query.isFetching);
  const isError = queries.some(query => query.isError);

  const stockByCategory = useMemo(() => {
    const categoryMap = new Map();
    products.forEach(product => {
      const category = product.category || "Uncategorized";
      categoryMap.set(
        category,
        (categoryMap.get(category) || 0) + Math.max(0, Number(product.stock) || 0)
      );
    });
    return [...categoryMap.entries()]
      .map(([category, stock]) => ({ category, stock }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 7);
  }, [products]);

  const paidOrders = orders.filter(
    order => order.order_status?.toLowerCase() === "paid"
  );
  const pendingOrders = orders.length - paidOrders.length;
  const paidOrderValue = paidOrders.reduce(
    (total, order) => total + (Number(order.price) || 0),
    0
  );
  const inventoryValue = products.reduce(
    (total, product) =>
      total + (Number(product.price) || 0) * (Number(product.stock) || 0),
    0
  );
  const pendingRequests = requests.filter(
    request => request.status?.toLowerCase() === "pending"
  ).length;
  const orderStatusData = [
    { name: "Paid", value: paidOrders.length },
    { name: "Awaiting payment", value: pendingOrders },
  ].filter(item => item.value > 0);

  const refreshReports = async () => {
    await Promise.all(
      ["allUsers", "allSellers", "allProducts", "adminOrders", "sellerRequests"].map(
        queryKey => queryClient.invalidateQueries({ queryKey: [queryKey] })
      )
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <BarChart3 size={14} />
              Admin overview
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Reports &amp; analytics
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              A live snapshot of marketplace accounts, catalog stock, orders, and seller applications.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshReports}
            disabled={isFetching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh analytics
          </button>
        </div>
      </header>

      {isError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={17} />
            Some report data couldn’t load. Displayed totals may be incomplete.
          </p>
          <button type="button" onClick={refreshReports} className="text-sm font-bold underline underline-offset-2">
            Retry data
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Customers", value: users.length, icon: <Users size={19} />, tone: "bg-sky-50 text-sky-700" },
          { label: "Sellers", value: sellers.length, icon: <Store size={19} />, tone: "bg-violet-50 text-violet-700" },
          { label: "Products", value: products.length, icon: <Package size={19} />, tone: "bg-emerald-50 text-emerald-700" },
          { label: "Orders", value: orders.length, icon: <BarChart3 size={19} />, tone: "bg-amber-50 text-amber-700" },
          { label: "Pending requests", value: pendingRequests, icon: <ClipboardList size={19} />, tone: "bg-rose-50 text-rose-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                {Icon}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-span-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Available stock by category</h3>
              <p className="mt-1 text-xs text-slate-500">Units currently listed across the catalog</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{products.length} total products</span>
          </div>
          {stockByCategory.length ? (
            <div className="mt-5 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByCategory} margin={{ top: 8, right: 8, left: -18, bottom: 18 }} accessibilityLayer>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} interval={0} angle={-15} textAnchor="end" height={56} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip cursor={{ fill: "#f0fdf4" }} />
                  <Bar dataKey="stock" name="Units in stock" fill="#059669" radius={[7, 7, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-5 flex h-[300px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
              <Package className="text-slate-300" size={30} />
              <p className="mt-3 text-sm font-semibold text-slate-700">No inventory data yet</p>
              <p className="mt-1 text-xs text-slate-500">Products will appear here once they are added.</p>
            </div>
          )}
        </article>

        <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
          <div>
            <h3 className="font-bold text-slate-900">Order payment status</h3>
            <p className="mt-1 text-xs text-slate-500">Paid orders compared with orders awaiting payment</p>
          </div>
          {orderStatusData.length ? (
            <>
              <div className="mt-3 h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart accessibilityLayer>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={4}
                    >
                      {orderStatusData.map(entry => (
                        <Cell
                          key={entry.name}
                          fill={entry.name === "Paid" ? ORDER_COLORS[0] : ORDER_COLORS[1]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {orderStatusData.map(item => (
                  <div key={item.name} className="rounded-xl bg-slate-50 p-3">
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            item.name === "Paid" ? ORDER_COLORS[0] : ORDER_COLORS[1],
                        }}
                      />
                      {item.name}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-5 flex h-[300px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
              <BarChart3 className="text-slate-300" size={30} />
              <p className="mt-3 text-sm font-semibold text-slate-700">No order data yet</p>
              <p className="mt-1 text-xs text-slate-500">Order activity will appear in this report.</p>
            </div>
          )}
        </article>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Paid order value</p>
          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {paidOrderValue.toLocaleString()} BDT
          </p>
          <p className="mt-1 text-xs text-slate-400">Calculated from orders marked as paid</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Inventory value</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {inventoryValue.toLocaleString()} BDT
          </p>
          <p className="mt-1 text-xs text-slate-400">Current product price multiplied by available stock</p>
        </article>
      </div>
    </section>
  );
};

export default Reports;
