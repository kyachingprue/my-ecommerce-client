import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const STATUS_COLORS = ["#059669", "#0ea5e9", "#f59e0b", "#f43f5e", "#64748b"];
const EMPTY_LIST = Object.freeze([]);

const SalesAnalytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/products?sellerEmail=${encodeURIComponent(user.email)}`
      );
      return response.data;
    },
    enabled: !!user?.email,
    retry: false,
  });

  const ordersQuery = useQuery({
    queryKey: ["sellerOrders", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/seller-orders/${encodeURIComponent(user.email)}`
      );
      return response.data.data;
    },
    enabled: !!user?.email,
    retry: false,
  });

  const products = productsQuery.data || EMPTY_LIST;
  const orders = ordersQuery.data || EMPTY_LIST;
  const isLoading = productsQuery.isLoading || ordersQuery.isLoading;
  const isFetching = productsQuery.isFetching || ordersQuery.isFetching;
  const isError = productsQuery.isError || ordersQuery.isError;

  const productMetrics = useMemo(
    () =>
      products.map(product => {
        const productOrders = orders.filter(
          order => String(order.productId) === String(product._id)
        );
        const paidOrders = productOrders.filter(
          order => order.order_status?.toLowerCase() === "paid"
        );
        const revenue = paidOrders.reduce(
          (total, order) => total + (Number(order.price ?? order.amount) || 0),
          0
        );
        return {
          name: product.title || "Untitled",
          shortName:
            (product.title || "Untitled").length > 13
              ? `${product.title.slice(0, 12)}…`
              : product.title || "Untitled",
          stock: Number(product.stock) || 0,
          orders: productOrders.length,
          revenue,
        };
      }),
    [products, orders]
  );

  const paidOrders = orders.filter(
    order => order.order_status?.toLowerCase() === "paid"
  );
  const totalRevenue = paidOrders.reduce(
    (total, order) => total + (Number(order.price ?? order.amount) || 0),
    0
  );
  const fulfillmentData = useMemo(() => {
    const statusCounts = new Map();
    orders.forEach(order => {
      const status = (order.status || "pending").toLowerCase();
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
    });
    return [...statusCounts.entries()].map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [orders]);

  const refreshAnalytics = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["myProducts", user?.email] }),
      queryClient.invalidateQueries({ queryKey: ["sellerOrders", user?.email] }),
    ]);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <BarChart3 size={14} />
              Seller insights
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Sales analytics
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Track product stock, customer orders, fulfillment, and paid sales in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshAnalytics}
            disabled={isFetching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-70 sm:w-auto"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh analytics
          </button>
        </div>
      </header>

      {isError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={17} />
            Analytics data couldn’t load.
          </p>
          <button type="button" onClick={refreshAnalytics} className="text-sm font-bold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products listed", value: products.length, icon: <Package size={20} />, tone: "bg-emerald-50 text-emerald-700" },
          { label: "Customer orders", value: orders.length, icon: <ShoppingBag size={20} />, tone: "bg-sky-50 text-sky-700" },
          { label: "Paid orders", value: paidOrders.length, icon: <Store size={20} />, tone: "bg-violet-50 text-violet-700" },
          { label: "Paid revenue", value: `${totalRevenue.toLocaleString()} BDT`, icon: <CircleDollarSign size={20} />, tone: "bg-amber-50 text-amber-700" },
        ].map(metric => (
          <article key={metric.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-500">{metric.label}</span>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.tone}`}>
                {metric.icon}
              </span>
            </div>
            <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900">
              {metric.value}
            </p>
          </article>
        ))}
      </div>

      {products.length === 0 && !isError ? (
        <div className="flex min-h-[38vh] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Store size={29} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900">Your sales dashboard is ready</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your first product to start seeing stock, orders, and sales analytics here.
          </p>
          <Link
            to="/dashboard/seller/add-product"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Add your first product <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div>
              <h3 className="font-bold text-slate-900">Orders and stock by product</h3>
              <p className="mt-1 text-xs text-slate-500">
                Compare current inventory with orders received
              </p>
            </div>
            {productMetrics.length ? (
              <div className="mt-5 h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productMetrics} margin={{ top: 8, right: 8, left: -18, bottom: 24 }} accessibilityLayer>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: "#64748b" }} interval={0} angle={-18} textAnchor="end" height={58} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""} />
                    <Legend />
                    <Bar dataKey="stock" name="In stock" fill="#059669" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="orders" name="Orders" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-5 flex h-[320px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
                <Package className="text-slate-300" size={30} />
                <p className="mt-3 text-sm font-semibold text-slate-700">No product data to chart</p>
              </div>
            )}
          </article>

          <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div>
              <h3 className="font-bold text-slate-900">Paid revenue by product</h3>
              <p className="mt-1 text-xs text-slate-500">
                Revenue is calculated from orders marked as paid
              </p>
            </div>
            {productMetrics.some(product => product.revenue > 0) ? (
              <div className="mt-5 h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productMetrics} margin={{ top: 8, right: 12, left: 0, bottom: 24 }} accessibilityLayer>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: "#64748b" }} interval={0} angle={-18} textAnchor="end" height={58} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""}
                      formatter={value => [`${Number(value).toLocaleString()} BDT`, "Paid revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" name="Paid revenue" stroke="#059669" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-5 flex h-[320px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-4 text-center">
                <CircleDollarSign className="text-slate-300" size={30} />
                <p className="mt-3 text-sm font-semibold text-slate-700">No paid sales to chart yet</p>
                <p className="mt-1 text-xs text-slate-500">Revenue appears after an order is marked as paid.</p>
              </div>
            )}
          </article>

          <article className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
            <h3 className="font-bold text-slate-900">Order fulfillment status</h3>
            <p className="mt-1 text-xs text-slate-500">Current status of customer orders for your products</p>
            {fulfillmentData.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(180px,0.6fr)] md:items-center">
                <div className="h-[280px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart accessibilityLayer>
                      <Pie
                        data={fulfillmentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={92}
                        paddingAngle={3}
                      >
                        {fulfillmentData.map((item, index) => (
                          <Cell key={item.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                  {fulfillmentData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex h-[220px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
                <ShoppingBag className="text-slate-300" size={30} />
                <p className="mt-3 text-sm font-semibold text-slate-700">No order activity yet</p>
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  );
};

export default SalesAnalytics;
