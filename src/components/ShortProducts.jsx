import { useQuery } from "@tanstack/react-query";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";
import useAxiosInstance from "../Hooks/useAxiosInstance";

const ShortProducts = () => {
  const axiosInstance = useAxiosInstance();
  const {
    data: products = [],
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products", ""],
    queryFn: async () => {
      const response = await axiosInstance.get("/products?search=");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.products)) return response.data.products;
      throw new Error("The product service returned an unexpected response.");
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (isPending) return <LoadingSpinner />;

  if (isError && products.length === 0) {
    return (
      <section className="my-12 rounded-3xl border border-red-100 bg-white px-5 py-12 text-center shadow-sm sm:px-8">
        <h2 className="text-xl font-bold text-slate-900">Products are temporarily unavailable</h2>
        <p className="mt-2 text-sm text-slate-600">{error?.message || "Please try again."}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1500px] py-10 sm:py-14">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            Fresh from local suppliers
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Shop fresh favorites
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} quality {products.length === 1 ? "pick" : "picks"} for your everyday table
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh products"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
          <Link
            to="/products"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            Browse all
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {isError && (
        <p role="status" className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing the last loaded products. Refresh failed: {error?.message || "Please try again."}
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 sm:gap-5">
          {products.slice(0, 8).map((product, index) => (
            <Card key={product._id || `${product.title}-${index}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="font-semibold text-slate-800">No products available right now.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 text-sm font-semibold text-emerald-800 underline underline-offset-4"
          >
            Refresh products
          </button>
        </div>
      )}
    </section>
  );
};

export default ShortProducts;
