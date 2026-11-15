import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Box,
  Leaf,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useRole from "../Hooks/useRole";
import useTitle from "../Hooks/useTitle";
import LoadingSpinner from "./LoadingSpinner";
import StarRating from "./StarRating";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();
  const [addingToCart, setAddingToCart] = useState(false);
  const initialProduct = location.state?.product;

  const {
    data: product = initialProduct,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    initialData: initialProduct,
    retry: false,
  });

  useTitle(product?.title || "Product details");

  if (!product && isPending) return <LoadingSpinner />;

  if (!product) {
    return (
      <main className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-[#f6f8f4] to-lime-100 px-4 py-12 sm:px-6">
        <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-lime-300/25 blur-3xl" />
        <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-800 shadow-inner">
            <Box size={28} />
          </div>
          <span className="mt-5 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Fresh find missing
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Product not found
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
            {isError
              ? "We couldn’t load this product just now. Check your connection and reload its data."
              : "This product may have been removed or is no longer available."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
              {isFetching ? "Reloading data..." : "Reload data"}
            </button>
            <Link
              to="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Browse products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tags = Array.isArray(product.tags) ? product.tags : [];
  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.reviewsCount) || 0;
  const stockCount = Number(product.stock);
  const isInStock = product.stock === undefined || product.stock === null || stockCount > 0;
  const isOrganic =
    product.organic === true ||
    tags.some(tag => String(tag).toLowerCase() === "organic");
  const isRestrictedRole = role === "seller" || role === "admin";
  const currency = product.currency || "BDT";
  const formattedPrice = Number.isFinite(Number(product.price))
    ? Number(product.price).toLocaleString()
    : product.price;
  const sellerName = product.seller?.name || "GreenBasket market";
  const sellerInitials = sellerName.slice(0, 1).toUpperCase();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add this product to your basket.");
      return;
    }

    if (!isInStock || isRestrictedRole || roleLoading) return;

    const orderData = {
      productId: String(product._id || id),
      title: product.title,
      category: product.category,
      price: product.price,
      currency,
      sku: product.sku,
      image: product.image,
      seller_email: product.seller?.email || "",
      user_email: user.email,
      order_status: "unpaid",
      status: "pending",
    };

    setAddingToCart(true);
    try {
      const response = await axiosSecure.post("/orders", orderData);
      if (!response.data.success) {
        toast.error(response.data.message || "Could not add this product to your basket.");
        return;
      }

      toast.success("Added to your basket!");
      navigate("/dashboard/orders");
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not add this product to your basket."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f4] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
            <Link to="/" className="transition hover:text-emerald-800">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/products" className="transition hover:text-emerald-800">Products</Link>
            {product.category && (
              <>
                <span aria-hidden="true">/</span>
                <span className="truncate text-slate-700">{product.category}</span>
              </>
            )}
          </nav>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh product details"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
        </div>

        {isError && (
          <p role="status" className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Couldn’t refresh the latest product details. Showing the last loaded information.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] sm:p-5">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f2f6ef]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-emerald-50 to-lime-100 text-8xl">
                  🥬
                </div>
              )}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
                {isOrganic && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur">
                    <Leaf size={14} />
                    Organic choice
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                  <PackageCheck size={14} className={isInStock ? "text-emerald-700" : "text-slate-400"} />
                  {isInStock ? "In stock" : "Currently unavailable"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 px-1 pb-1 pt-4 sm:gap-4 sm:px-2 sm:pt-5">
              <div className="rounded-2xl bg-[#f7f9f6] p-3 sm:p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                  <Leaf size={17} />
                </span>
                <p className="mt-3 text-xs font-semibold text-slate-800">Freshly selected</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                  Quality for your table
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7f9f6] p-3 sm:p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                  <Truck size={17} />
                </span>
                <p className="mt-3 text-xs font-semibold text-slate-800">Delivery ready</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                  To your doorstep
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7f9f6] p-3 sm:p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                  <ShieldCheck size={17} />
                </span>
                <p className="mt-3 text-xs font-semibold text-slate-800">Secure checkout</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                  Safe shopping
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  {product.category}
                </span>
              )}
              {isOrganic && (
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-3 py-1.5 text-xs font-semibold text-lime-800">
                  <BadgeCheck size={13} />
                  Organic
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <StarRating rating={rating} />
              <span className="text-sm font-semibold text-slate-700">
                {rating > 0 ? rating.toFixed(1) : "New"}
              </span>
              <span className="h-4 w-px bg-slate-200" />
              <span className="text-sm text-slate-500">
                {reviewCount > 0
                  ? `${reviewCount} customer ${reviewCount === 1 ? "review" : "reviews"}`
                  : "Be the first to review"}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-[#f6f9f4] p-4 sm:p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">
                  Price
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-900">
                  {formattedPrice}{" "}
                  <span className="text-base font-semibold text-emerald-800">{currency}</span>
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                isInStock ? "bg-white text-emerald-800" : "bg-white text-slate-500"
              }`}>
                <span className={`h-2 w-2 rounded-full ${isInStock ? "bg-emerald-500" : "bg-slate-400"}`} />
                {isInStock
                  ? product.stock !== undefined && product.stock !== null
                    ? `${stockCount} available`
                    : "Available"
                  : "Out of stock"}
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-600">
              {product.description || "A fresh pick, selected with care for your everyday table."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.weight && (
                <div className="rounded-2xl border border-slate-100 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Package size</p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    {product.weight} {product.unit || ""}
                  </p>
                </div>
              )}
              {product.origin && (
                <div className="rounded-2xl border border-slate-100 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Origin</p>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <MapPin size={14} className="text-emerald-700" />
                    {product.origin}
                  </p>
                </div>
              )}
              {product.sku && (
                <div className="rounded-2xl border border-slate-100 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Product code</p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">{product.sku}</p>
                </div>
              )}
              {product.category && (
                <div className="rounded-2xl border border-slate-100 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Category</p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">{product.category}</p>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5 text-xs font-medium text-emerald-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-100 p-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">
                {sellerInitials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Sold by
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">
                  {sellerName}
                </span>
              </span>
              {product.seller?.email && (
                <span className="hidden max-w-44 truncate text-xs text-slate-500 sm:block">
                  {product.seller.email}
                </span>
              )}
            </div>

            <div className="mt-auto pt-7">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || roleLoading || isRestrictedRole || !isInStock}
                  className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  <ShoppingBag size={18} />
                  {addingToCart
                    ? "Adding to basket..."
                    : !isInStock
                      ? "Out of stock"
                      : "Add to basket"}
                  {!addingToCart && isInStock && <ArrowRight size={17} />}
                </button>
                <Link
                  to="/products"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900"
                >
                  <ArrowLeft size={16} />
                  Keep shopping
                </Link>
              </div>

              {isRestrictedRole && (
                <p className="mt-3 text-center text-xs text-slate-500">
                  Shopping is available to customer accounts.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
