import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  ArrowUpRight,
  CircleAlert,
  Eye,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Wheat,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

const SellerProductManager = ({ pageTitle = "My products" }) => {
  const { user } = useAuth();
  const { userData } = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: products = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currency: "BDT",
      unit: "kg",
      organic: "true",
    },
  });

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(product =>
      `${product.title || ""} ${product.category || ""} ${product.sku || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  const handleCreateProduct = async values => {
    const product = {
      title: values.title.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      currency: values.currency.trim() || "BDT",
      stock: Number(values.stock),
      sku: values.sku?.trim() || "",
      weight: values.weight?.trim() || "",
      unit: values.unit?.trim() || "kg",
      seller: {
        name: userData.name || user.displayName || user.email,
        email: user.email,
      },
      description: values.description?.trim() || "",
      image: values.image.trim(),
      tags: (values.tags || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean),
      rating: 0,
      reviewsCount: 0,
      origin: values.origin?.trim() || "",
      organic: values.organic === "true",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axiosSecure.post("/products", product);
      if (!response.data.insertedId) {
        throw new Error("The product was not added. Please try again.");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myProducts", user.email] }),
        queryClient.invalidateQueries({ queryKey: ["sellerProducts", user.email] }),
        queryClient.invalidateQueries({ queryKey: ["allProducts"] }),
      ]);
      reset();
      setShowForm(false);
      toast.success("Product created successfully.");
      navigate("/dashboard/seller/add-product");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Could not create the product."
      );
    }
  };

  const handleDelete = id => {
    toast(
      confirmation => (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Delete this product from your shop?
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
                  await axiosSecure.delete(`/products/${id}`);
                  toast.success("Product deleted.");
                  await refetch();
                  await queryClient.invalidateQueries({
                    queryKey: ["sellerProducts", user.email],
                  });
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Could not delete the product."
                  );
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

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle size={32} className="animate-spin text-emerald-700" />
      </div>
    );
  }

  const outOfStock = products.filter(product => Number(product.stock) <= 0).length;
  const totalStock = products.reduce(
    (total, product) => total + Math.max(0, Number(product.stock) || 0),
    0
  );

  return (
    <section className="min-h-[calc(100vh-9rem)] space-y-6 text-slate-800">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-lime-800 p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
              <Wheat size={14} />
              Seller workspace
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {pageTitle}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Manage your shop listings, keep stock current, and add products for customers.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setShowForm(current => !current)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              {showForm ? <X size={17} /> : <Plus size={17} />}
              {showForm ? "Close form" : "Create product"}
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh your products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-70"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Products</p>
            <p className="mt-1 text-2xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-emerald-50/75">Units in stock</p>
            <p className="mt-1 text-2xl font-bold">{totalStock.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {showForm ? (
        <form
          onSubmit={handleSubmit(handleCreateProduct)}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Create a product listing</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add accurate details so customers can find your product.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={16} /> Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Product name
              <input
                {...register("title", { required: "Product name is required." })}
                placeholder="e.g. Fresh organic tomatoes"
                className={fieldClass}
              />
              {errors.title && <span className="mt-1 block text-xs text-rose-600">{errors.title.message}</span>}
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Category
              <input
                {...register("category", { required: "Category is required." })}
                placeholder="Vegetables"
                className={fieldClass}
              />
              {errors.category && <span className="mt-1 block text-xs text-rose-600">{errors.category.message}</span>}
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                {...register("price", {
                  required: "Price is required.",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative." },
                })}
                placeholder="0.00"
                className={fieldClass}
              />
              {errors.price && <span className="mt-1 block text-xs text-rose-600">{errors.price.message}</span>}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold text-slate-700">
                Currency
                <input {...register("currency")} className={fieldClass} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Stock
                <input
                  type="number"
                  min="0"
                  step="1"
                  {...register("stock", {
                    required: "Stock is required.",
                    valueAsNumber: true,
                    min: { value: 0, message: "Stock cannot be negative." },
                  })}
                  placeholder="0"
                  className={fieldClass}
                />
                {errors.stock && <span className="mt-1 block text-xs text-rose-600">{errors.stock.message}</span>}
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Product image URL
              <input
                type="url"
                {...register("image", { required: "Product image URL is required." })}
                placeholder="https://example.com/product-image.jpg"
                className={fieldClass}
              />
              {errors.image && <span className="mt-1 block text-xs text-rose-600">{errors.image.message}</span>}
            </label>
            <label className="text-sm font-semibold text-slate-700">
              SKU <span className="font-normal text-slate-400">(optional)</span>
              <input {...register("sku")} placeholder="Product code" className={fieldClass} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold text-slate-700">
                Weight
                <input {...register("weight")} placeholder="1" className={fieldClass} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Unit
                <input {...register("unit")} className={fieldClass} />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700">
              Origin
              <input {...register("origin")} placeholder="Product origin" className={fieldClass} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Organic
              <select {...register("organic")} className={fieldClass}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Description
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe the product, its quality, and how it is produced."
                className={`${fieldClass} resize-y`}
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Tags <span className="font-normal text-slate-400">(comma separated)</span>
              <input {...register("tags")} placeholder="fresh, organic, local" className={fieldClass} />
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <LoaderCircle size={17} className="animate-spin" />}
              {isSubmitting ? "Creating product..." : "Create product"}
            </button>
          </div>
        </form>
      ) : isError ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm">
          <CircleAlert className="text-rose-600" size={30} />
          <h3 className="mt-4 text-lg font-bold text-slate-900">Products couldn’t load</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Please check your connection and try loading your shop products again.
          </p>
          <button type="button" onClick={() => refetch()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white px-5 py-12 text-center shadow-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Package size={30} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-900">Your shop is ready for its first product</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your first listing to start building your shop and help customers discover your products.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            <Plus size={17} /> Create your first product
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500" aria-live="polite">
              Showing <span className="font-semibold text-slate-800">{filteredProducts.length}</span> of{" "}
              <span className="font-semibold text-slate-800">{products.length}</span> products
              {outOfStock > 0 && <span className="ml-2 text-amber-700">· {outOfStock} out of stock</span>}
            </p>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500/30 sm:w-72">
              <Search size={16} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search your products"
                aria-label="Search your products"
                className="min-w-0 flex-1 text-sm outline-none"
              />
            </label>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
              <Search className="mx-auto text-slate-300" size={28} />
              <h3 className="mt-4 font-bold text-slate-900">No products match your search</h3>
              <button type="button" onClick={() => setSearch("")} className="mt-3 text-sm font-semibold text-emerald-800 underline underline-offset-2">
                Clear search
              </button>
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
                      <Package size={32} />
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
                        <h3 className="truncate font-bold text-slate-900" title={product.title}>
                          {product.title || "Untitled product"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {product.price ?? "—"} {product.currency || "BDT"}
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
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                      <Link
                        to={`/products/${product._id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <Eye size={14} /> View
                      </Link>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/seller/edit-product/${product._id}`)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800"
                      >
                        <ArrowUpRight size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        aria-label={`Delete ${product.title || "product"}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-100 px-2 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default SellerProductManager;
