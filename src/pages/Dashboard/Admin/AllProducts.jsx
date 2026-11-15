import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CircleAlert,
  Eye,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Wheat,
  Wrench,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: products = [],
    refetch,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
    retry: false,
  });

  const categories = useMemo(
    () => [...new Set(products.map(product => product.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = products.filter(product => {
      const text = [
        product.title,
        product.category,
        product.sku,
        product.seller?.name,
        product.seller?.email,
        ...(Array.isArray(product.tags) ? product.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (!query || text.includes(query)) &&
        (category === "all" || product.category === category);
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === "stock-low") return Number(a.stock || 0) - Number(b.stock || 0);
      if (sortBy === "title") return String(a.title || "").localeCompare(String(b.title || ""));
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [products, search, category, sortBy]);

  const handleDelete = id => {
    toast(
      confirmation => (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Delete this product from the catalog?
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => toast.dismiss(confirmation.id)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(confirmation.id);
                try {
                  const response = await axiosSecure.delete(`/products/${id}`);
                  if (response.data.deletedCount > 0) {
                    toast.success("Product deleted.");
                    await refetch();
                  } else {
                    toast.error("The product could not be deleted.");
                  }
                } catch (error) {
                  toast.error(error.response?.data?.message || "Could not delete the product.");
                }
              }}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Delete product
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><LoaderCircle className="animate-spin text-emerald-700" size={32} /></div>;

  const outOfStockCount = products.filter(product => Number(product.stock) <= 0).length;

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-lime-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <Wheat size={14} />
              Catalog management
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">All products</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Browse the complete catalog, inspect product pages, and manage listings.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white focus-within:ring-2 focus-within:ring-white/40 sm:min-w-56 xl:flex-none">
              <Search size={17} className="shrink-0 text-emerald-100/70" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search products"
                aria-label="Search products by name, seller, or SKU"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-emerald-100/60"
              />
            </label>
            <Link
              to="/dashboard/admin/add-product"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              <Plus size={17} /> Add product
            </Link>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-70"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Catalog products</p>
            <p className="mt-1 text-2xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Out of stock</p>
            <p className="mt-1 text-2xl font-bold">{outOfStockCount}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <span className="inline-flex items-center gap-2 px-1 text-sm font-semibold text-slate-600">
          <SlidersHorizontal size={16} className="text-emerald-700" />
          Filters
        </span>
        <label className="flex-1">
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 sm:max-w-56"
          >
            <option value="all">All categories</option>
            {categories.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex-1">
          <span className="sr-only">Sort products</span>
          <select
            value={sortBy}
            onChange={event => setSortBy(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 sm:max-w-56"
          >
            <option value="newest">Newest first</option>
            <option value="title">Name A–Z</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="stock-low">Lowest stock</option>
          </select>
        </label>
        <span className="px-1 text-xs font-medium text-slate-500" aria-live="polite">
          Showing {filteredProducts.length} of {products.length}
        </span>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm">
          <CircleAlert className="mx-auto text-rose-600" size={28} />
          <h3 className="mt-4 font-bold text-slate-900">Products couldn’t load</h3>
          <p className="mt-2 text-sm text-slate-500">Please check the server and try again.</p>
          <button type="button" onClick={() => refetch()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-5 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Package size={26} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {search || category !== "all" ? "No products match these filters" : "No products yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {search || category !== "all"
              ? "Try changing the search or category filters."
              : "Create the first listing to start building the catalog."}
          </p>
          {!search && category === "all" && (
            <Link to="/dashboard/admin/add-product" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              <Plus size={16} /> Create a product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map(product => (
            <article key={product._id} className="min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
              <Link to={`/products/${product._id}`} className="group relative block aspect-[16/10] overflow-hidden bg-emerald-50">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-emerald-900 shadow-sm">
                  {product.category || "Product"}
                </span>
                <span className="flex h-full items-center justify-center text-emerald-700">
                  <Package size={34} />
                </span>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title || "Product"}
                    loading="lazy"
                    onError={event => { event.currentTarget.style.display = "none"; }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                )}
              </Link>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900" title={product.title}>
                      {product.title || "Untitled product"}
                    </h3>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {product.seller?.name || product.seller?.email || "Seller not specified"}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    Number(product.stock) > 0
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-rose-50 text-rose-700"
                  }`}>
                    {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <p className="mt-4 text-lg font-bold text-emerald-800">
                  {product.price ?? "—"} <span className="text-sm font-semibold">{product.currency || "BDT"}</span>
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <Link
                    to={`/products/${product._id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
                  >
                    <Eye size={14} /> Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/admin/update-product/${product._id}`)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
                  >
                    <Wrench size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    aria-label={`Delete ${product.title || "product"}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-100 px-2 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllProducts;
