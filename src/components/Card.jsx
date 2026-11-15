import { ArrowUpRight, Leaf, PackageCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const Card = ({ product }) => {
  const {
    _id,
    title,
    image,
    category,
    price,
    seller,
    currency,
    rating,
    reviewsCount,
    stock,
    organic,
    tags,
  } = product;
  const numericPrice = Number(price);
  const priceLabel = Number.isFinite(numericPrice)
    ? numericPrice.toLocaleString()
    : price;
  const isAvailable = Number(stock) > 0;
  const isOrganic =
    organic === true ||
    (Array.isArray(tags) && tags.some(tag => String(tag).toLowerCase() === "organic"));

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_8px_30px_-20px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_50px_-25px_rgba(16,87,58,0.24)]"
    >
      <Link
        to={`/products/${_id}`}
        state={{ product }}
        aria-label={`View ${title}`}
        className="relative block overflow-hidden bg-[#f4f7f1]"
      >
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-[1.3] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[1.3] w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-lime-100 text-5xl">
            🥬
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {isOrganic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 shadow-sm backdrop-blur">
              <Leaf size={12} />
              Organic
            </span>
          )}
          {category && (
            <span className="rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur">
              {category}
            </span>
          )}
        </div>
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur ${
            isAvailable
              ? "bg-white/95 text-emerald-800"
              : "bg-white/95 text-slate-500"
          }`}
        >
          <PackageCheck size={12} />
          {isAvailable ? "In stock" : "Out of stock"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex min-h-5 items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-slate-400">
            {seller?.name || "GreenBasket market"}
          </span>
          {Number(rating) > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-700">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {Number(rating).toFixed(1)}
              {Number(reviewsCount) > 0 && (
                <span className="font-normal text-slate-400">({reviewsCount})</span>
              )}
            </span>
          )}
        </div>

        <Link
          to={`/products/${_id}`}
          state={{ product }}
          className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-900 transition hover:text-emerald-800"
        >
          {title}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={Number(rating) || 0} />
          {Number(rating) > 0 ? (
            <span className="text-[11px] text-slate-400">
              {Number(reviewsCount) > 0 ? `${reviewsCount} reviews` : "Rated"}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">New arrival</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
              Price
            </p>
            <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
              {priceLabel}{" "}
              <span className="text-xs font-semibold text-slate-500">
                {currency || "BDT"}
              </span>
            </p>
          </div>
          <Link
            to={`/products/${_id}`}
            state={{ product }}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-3.5 text-xs font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
          >
            View product
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Card;
