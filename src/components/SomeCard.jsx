import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const collections = [
  {
    title: "Healthier everyday",
    category: "Thoughtful choices for your table",
    image: "https://i.ibb.co.com/qLc1yT5B/BSC-Healthy-Plate-1200x628-Revised-1200x610.jpg",
  },
  {
    title: "Farm-fresh organic",
    category: "Good food, grown with care",
    image: "https://i.ibb.co.com/Gfxbdgjt/Journey-from-Farm-to-Table-How-Fresh-Organic-Foods-Delivers-Quality1-1000x565.jpg",
  },
  {
    title: "Fresh vegetables",
    category: "Bring color to every meal",
    image: "https://i.ibb.co.com/wr3cx7SJ/20240314121138650.jpg",
  },
];

const SomeCard = () => (
  <section className="mx-auto my-8 grid max-w-[1500px] grid-cols-1 gap-4 sm:my-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
    {collections.map((collection, index) => (
      <article
        key={collection.title}
        data-aos="fade-up"
        data-aos-duration={700 + index * 150}
        className="group relative isolate flex min-h-56 items-end overflow-hidden rounded-[1.5rem] bg-slate-900 p-5 shadow-lg shadow-slate-900/10 sm:min-h-64 sm:p-7"
      >
        <img
          src={collection.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            {collection.category}
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl">{collection.title}</h2>
            <Link
              to="/products"
              aria-label={`Shop ${collection.title}`}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-900 transition group-hover:bg-emerald-400"
            >
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    ))}
  </section>
);

export default SomeCard;
